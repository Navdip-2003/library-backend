import { genderEnum } from "./user.dto";

export class UserSummaryRes {
    id?: string;
    name: string;
    email: string;
    mobileNumber:string;
    age: number;
    gender: genderEnum; 
    weight: number;
    height: number;
    dieataryPrefrencees: string;
    allergies: string;
    healthGoals: string;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
}