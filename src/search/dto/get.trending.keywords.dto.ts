import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class GetTendingKeywordsDto {

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '35', description: '회원 나이' })
    age: string;

    @IsIn(['M', 'W'])
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'M', description: '회원 성별' })
    gender: string;  

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'KOREA', description: '회원 국가' })
    region: string;  
}