import { UserAuthDto } from "./user.auth";

export class CreateUserDto extends UserAuthDto{
    id?: string;
    name?: string;
    age?: number;
    gender?: genderEnum; 
    role? : string;
    roleId? : string;
    address?: string;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
}
  
export enum genderEnum {
    Male = "male",
    Female = "female",
    Others = "others"
}