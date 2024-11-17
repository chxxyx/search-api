import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SaveSearchKeywordDto } from './dto/save.search.keyword.dto';

@Injectable()
export class SearchService {
    
    constructor(
        private prismaService: PrismaService,
    ) {}

    /**
     *  동일한 유저와 검색어, 동일한 아이피와 검색어를 한 번 더 요청할 경우에는 ?
     * 
     */
    async saveSearchKeyword(dto: SaveSearchKeywordDto) {
       
        const { keyword, email, ip } = dto;
    
        // 검색어 테이블에 유저 식별 값을 저장하기 위한 변수
        let userId;

        // 회원이 요청한 경우 
        // 요청 이메일 값이 존재하는 지 확인 
        if (email) {
            // 회원 검색 처리
            const user = await this.prismaService.user.findUnique({
                where: { email },
            });
        
            if (!user) {
                throw new NotFoundException('일치하는 이메일이 존재하지 않습니다.');
            };

            userId = user.id;

        };
        
        // 같은 유저들이 동일한 검색어를 다시 요청한 경우
        try {

            // 검색어 저장
            const saveData = await this.prismaService.searchkeyword.create({
                data: {
                    keyword,
                    user_id: ip ? 0 : userId,
                    ip: userId ? "NULL" : ip,
                }
            });

            return {
                statusCode: 201,
                saveData,
            };

        } catch (error) {

            if (error) {
                console.log(error.code)

                throw new ConflictException('이미 동일한 검색어가 저장되어 있습니다.');
            }
            throw error;
        }
    }
}
