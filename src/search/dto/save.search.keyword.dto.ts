import { IsOptional, IsString } from "class-validator";

export class SaveSearchKeywordDto {

    @IsString()
    keyword: string;
  
    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    ip?: string;
}