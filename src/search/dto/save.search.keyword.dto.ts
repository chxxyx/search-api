import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SaveSearchKeywordDto {

    @IsString()
    @ApiProperty({ example: '군밤', description: '검색어' })
    keyword: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'test@test.com', description: '회원으로 요청할 경우의 등록된 이메일 값' })
    email?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123.456.789.012', description: '비회원으로 요청할 경우의 IP 값' })
    ip?: string;
}