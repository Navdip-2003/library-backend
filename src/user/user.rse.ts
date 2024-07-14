import { genderEnum } from "./user.dto";

export class UserSummaryRes {
    id?: string;
    name: string;
    email: string;
    mobileNumber:string;
    age: number;
    gender: genderEnum;
    role?: string; 
    roleId? : string;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
}