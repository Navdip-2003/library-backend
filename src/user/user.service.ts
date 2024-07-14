import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import fb from '../firesbase/firebase.config';
import { CreateUserDto } from "./user.dto";
import * as jwt from 'jsonwebtoken';
import { UserAuthDto } from "./user.auth";
import { db_collections, JWT_SECRET, message, pageSize } from "src/common/constrats";
import { comparePassword, hashPassword, hashToken } from "src/common/utills";
import { UserSummaryRes } from "./user.rse";

@Injectable()
export class UserService {

    async registerUser(userProfile : CreateUserDto) {
        const isUserExists = await this.isUserExists(userProfile.mobileNumber)
        if (isUserExists) {
            console.error('User already exists!');
            throw new BadRequestException("User account with this email/phone number already exists!");
        }
        console.log(userProfile);

        const userAuth = await this.addUserAuth({
            mobileNumber: userProfile.mobileNumber,
            password: userProfile.password
        });

        const tokenForEmail = hashToken(Math.floor(1000 + Math.random() * 9000).toString());
        console.log(tokenForEmail);

        const userDeatiles = await
            this.addUserProfile({
                email: userProfile.email,
                name: userProfile.name,
                mobileNumber: userProfile.mobileNumber,
                age: userProfile.age,
                gender: userProfile.gender,
                role: userProfile.role,
                roleId : userProfile.roleId,
            address : userProfile.address,
                verifyToken: tokenForEmail,
                verifyTokenExpiry: new Date(Date.now() + 2000 * 86400),
            });

        delete userProfile.mobileNumber;
        const token = this.generateJWT(userProfile);
        return { "success" : true, "status": HttpStatus.OK, "data": {"token" : token }};
    }
    
    async loginUser(loginDto: UserAuthDto) {
        const isUserExists = await this.isUserExists(loginDto.mobileNumber)
        if (!isUserExists) {
            console.error('User doesnt exists!');
            throw new BadRequestException("User doesnt exists!");
        }

        const response = await this.validateUserLogin(loginDto);

        if(response.error) {
            switch (response.status) {
                case HttpStatus.BAD_REQUEST:
                    throw new BadRequestException(response.json);
                case HttpStatus.CONFLICT:
                    throw new ConflictException(response.json);
            }
        }
        return response;
    }

    async validateUserLogin(loginDto: UserAuthDto) {
        try {            
            const userAuth = await this.getUserAuth(loginDto.mobileNumber);
            const isPasswordValid = await this.validatePassword(loginDto.password, userAuth.password);
            if (!isPasswordValid) {
                console.error(`Invalid password!`);
                return {"error": true, "status": HttpStatus.BAD_REQUEST, json: message.error.invalid_username_password};
            }

            const response = await this.getUserProfileByMobileNumber(loginDto.mobileNumber);
       
            delete response.userProfile.mobileNumber;
            const token = this.generateJWT(response.userProfile);

            return {"success": true, "status": HttpStatus.OK, "data": {"token": token, "mobileNumber":loginDto.mobileNumber}};
        } catch (error) {
            console.error(error);
            if (error.status === HttpStatus.CONFLICT)
                throw new ConflictException(message.error.account_pending_verification);
            throw new InternalServerErrorException(error.message)
        }
    }

    async resetPassword(loginDto: UserAuthDto) {
        try {
            let userAuth = await this.getUserAuth(loginDto.mobileNumber);
            const isDuplicatePassword = await this.validatePassword(loginDto.password, userAuth.password);
            if(isDuplicatePassword) {
                console.error(message.error.duplicate_password);
                return { "error" : true, "status" : HttpStatus.INTERNAL_SERVER_ERROR, json : message.error.duplicate_password};
            }

            userAuth = await this.updateUserAuth({
                mobileNumber:loginDto.mobileNumber, 
                password: loginDto.password
            });
            const token = this.generateJWT(userAuth);
            return { "success" : true, "status": HttpStatus.OK, "data": {"token" : token } };
        } catch (error) {
            console.error(error);
            return { "error" : true, "status" : HttpStatus.INTERNAL_SERVER_ERROR, json : error};
        }
    }

    async updateUserProfile(userProfileRequest: CreateUserDto) {
        try {
            let { userProfile } = await this.getUserProfileByMobileNumber(userProfileRequest.mobileNumber);
            if (userProfile == null) {
                throw new NotFoundException(message.error.user_does_not_exists_with_mobile_number);
            }
            userProfile = {...userProfile, ...userProfileRequest};
            await this.updateUser(userProfile);
            return {"success": true, "status": HttpStatus.OK, "data": {}};
        } catch (error) {
            if(error instanceof NotFoundException){
                console.error(error.message);
                throw new NotFoundException(error.message);
            }else {
                console.error(`Error adding/updating user by ${userProfileRequest.mobileNumber} :`, error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async updateUserAuth(userAuthDto : UserAuthDto){
        try {
            const db = fb.getFirestore();
            userAuthDto.password = hashPassword(userAuthDto.password);
            console.log(userAuthDto);
            const userQuerySnapshot  = await db.collection(db_collections.user.auth).where("mobileNumber","==",userAuthDto.mobileNumber).get();
            if (userQuerySnapshot.empty) {
                throw new Error('User not found'); 
            }
            const userDocRef = userQuerySnapshot.docs[0].ref;
            await userDocRef.update({
                password: userAuthDto.password
            });
            console.log('User authentication updated successfully:', userAuthDto);
            return userAuthDto;
        } catch (error) {
            console.error(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAllUsers(pageNo : number) {
        const offset = (pageNo-1) * pageSize;
        const users: UserSummaryRes[] = [];
        try {
            let snapShot;
            const db = fb.getFirestore();
            if(pageNo == -1){
                snapShot = await db.collection(db_collections.user.profile).get();
            
            }else{
                snapShot = await db.collection(db_collections.user.profile)
                    .limit(pageSize)
                    .offset(offset)
                    .get();
            }
            
            if (snapShot.empty) {
                throw new NotFoundException("No user found in the database.");
            }
            
            for (const doc of snapShot.docs) {
                const userdata = doc.data() as CreateUserDto;
                userdata.id = doc.id;
                const userResponse = await this.mapToUserSummaryRes(doc.id, userdata);
                users.push(userResponse);
            }
            return {"success": true, "status": HttpStatus.OK, "data": {"count" : snapShot.size , users}};
        } catch (error) {
            if(error instanceof NotFoundException){
                console.error(error.message);
                throw new NotFoundException(error.message);
            }else {
                console.error(error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async getUserProfile(mobileNumber: string) {
        try {
            const { userProfile, id } = await this.getUserProfileByMobileNumber(mobileNumber);
            if (userProfile == null) {
                throw new NotFoundException(message.error.user_does_not_exists_with_mobile_number);
            }
            return {"success": true, "status": HttpStatus.OK, "data": {"user": await this.mapToUserSummaryRes(userProfile, id), "count" : 1}};
        } catch (error) {
            if(error instanceof NotFoundException){
                console.error(error.message);
                throw new NotFoundException(error.message);
            }else {
                console.error(`Error getting user by ${mobileNumber} :`, error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    async isUserExists(mobileNumber: string) {
        const db = fb.getFirestore();
        const userSnapshot = await db.collection(db_collections.user.auth).where('mobileNumber', '==', mobileNumber).get();
        return !userSnapshot.empty;
    }

    async addUserAuth(userAuthDto: UserAuthDto) {
        try {
            const db = fb.getFirestore();
            userAuthDto.password = hashPassword(userAuthDto.password);
            console.log(userAuthDto);
            await db.collection(db_collections.user.auth).add(JSON.parse(JSON.stringify(userAuthDto)));
            return userAuthDto;
        } catch (error) {
            console.error(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }

    async addUserProfile(userProfile: CreateUserDto) {
        try {
            const db = fb.getFirestore();
            await db.collection(db_collections.user.profile).add(JSON.parse(JSON.stringify(userProfile)));
            return userProfile;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getUserAuth(mobileNumber: string): Promise<UserAuthDto> {
        const db = fb.getFirestore();
        const snapShot = await db.collection(db_collections.user.auth).where('mobileNumber', '==', mobileNumber).get();
        return snapShot.docs[0].data() as UserAuthDto;
    }

    async validatePassword(password, hash) {
        return await comparePassword(password, hash);
    }

    async getUserProfileByEmail(email: string): Promise<CreateUserDto> {
        try {
            const db = fb.getFirestore();
            const snapShot = await db.collection(db_collections.user.profile).where('email', '==', email).get();
            if (snapShot.empty) {
                return null;
            }
            return snapShot.docs[0].data() as CreateUserDto;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getUserProfileByMobileNumber(mobileNumber: string) {
        try {
            const db = fb.getFirestore();
            const snapShot = await db.collection(db_collections.user.profile).where('mobileNumber', '==', mobileNumber).get();
            if (snapShot.empty) {
                return { userProfile: null };   
            }
            return { userProfile: snapShot.docs[0].data() as CreateUserDto, id: snapShot.docs[0].id};
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async validateUser(email: string) {
        try {
            const user = await this.getUserProfileByEmail(email);
            if (!user) {
                return null;
            }
            delete user.mobileNumber;
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateUser(userProfile: CreateUserDto) {
        try {
            const db = fb.getFirestore();
            const userRef = await db.collection(db_collections.user.profile).where("mobileNumber", "==", userProfile.mobileNumber).get();
            const snapShot = userRef.docs[0];
            if (!snapShot.exists) {
                throw new NotFoundException(message.error.user_does_not_exists);
            }
            await snapShot.ref.update({...userProfile});
        } catch (error) {
            if(error instanceof NotFoundException){
                console.error(error.message);
                throw new NotFoundException(error.message);
            }else {
                console.error(error);
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    generateJWT(payload: any) {
        return jwt.sign(payload, JWT_SECRET, {expiresIn: '30d'});
    }

    public async mapToUserSummaryRes(id, data) {
        const userRes: UserSummaryRes = {
            id: id,
            name: data.name,
            email: data.email,
            mobileNumber: data.mobileNumber,
            age: data.age,
            gender: data.gender,
            role: data.role,
            roleId: data.roleId
        };
        return userRes;
       }
    
}


