import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";
import { CreateUserDto } from "./user.dto";
import { UserAuthDto } from "./user.auth";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    // Update user profile is same as creating a new user
    @Post('add')
    async registerUser(@Res() res, @Body() userProfile : CreateUserDto) {
        console.log('Received add user request for user!');
        const result =  await this.userService.registerUser(userProfile);
        return res.status(result).send(result);
    }

    @Post('login')
    async loginUser (@Res() res, @Body() loginDto: UserAuthDto) {
        console.log(`Received Login request`);
        const result = await this.userService.loginUser(loginDto)
        return res.status(result.status).send(result);
    }

    @Post('resetPassword')
    async resetPassword (@Res() res, @Body() loginDto: UserAuthDto) {
        console.log(`Received reset password's request`);
        const result = await this.userService.resetPassword(loginDto);
        return res.status(result.status).send(result);
    }

    @Post('update')
    async updateUser(@Res() res, @Body() userProfile: CreateUserDto) {
        console.log('Received update user request for user!');
        const result =  await this.userService.updateUserProfile(userProfile);
        return res.status(result.status).send(result);
    }

    @Get('all')
    async getActiveStudents(@Res() res , @Query('pageNo') pageNo: number = 1)  {
        console.log('Received get All user request');
        const result = await this.userService.getAllUsers(pageNo);
        return res.status(result.status).send(result);
    }

    @Get('/:mobileNumber')
    async getUser(@Res() res, @Param('mobileNumber') mobileNumber: string) {
        console.log('Received get user request for user: ' + mobileNumber);
        const result = await this.userService.getUserProfile(mobileNumber);
        return res.status(result.status).send(result);
    }
}