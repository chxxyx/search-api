import { IsIn, IsOptional, IsString } from "class-validator";

export class GetTendingKeywordsDto {

 
    @IsString()
    @IsOptional()
    age: string;

    @IsIn(['M', 'W'])
    @IsString()
    @IsOptional()
    gender: string;  

    @IsString()
    @IsOptional()
    region: string;  
}