import { IsIn, IsString } from "class-validator";

export class InsertUserDto {

    @IsString()
    email: string;

    @IsString()
    age: string;

    @IsIn(['M', 'W'])
    @IsString()
    gender: string;  

    @IsString()
    region: string;  
}