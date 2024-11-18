import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class InsertUserDto {

    @IsString()
    @ApiProperty({ example: 'test@test.com', description: '회원 이메일 값' })
    email: string;

    @IsString()
    @ApiProperty({ example: '35', description: '회원 나이' })
    age: string;

    @IsIn(['M', 'W'])
    @IsString()
    @ApiProperty({ example: 'M', description: '회원 성별' })
    gender: string;  

    @IsString()
    @ApiProperty({ example: 'KOREA', description: '회원 국가' })
    region: string;  
}