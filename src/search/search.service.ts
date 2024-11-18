import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SaveSearchKeywordDto } from './dto/save.search.keyword.dto';
import { group } from 'console';
import { GetTendingKeywordsDto } from './dto/get.trending.keywords.dto';

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
                where: { email: email },
            });
        
            if (!user) {
                throw new NotFoundException('일치하는 이메일이 존재하지 않습니다.');
            };

            userId = user.id;

        };
        
        try {
             // 중복된 검색어가 존재하는지 확인
            const existingKeyword = await this.prismaService.searchkeyword.findFirst({
                where: {
                    keyword,
                    user_id: ip ? null : userId,
                    ip: userId ? null : ip,
                }
            });

            if (existingKeyword) {
                // 이미 존재하면 예외를 던짐
                throw new ConflictException('이미 동일한 검색어가 저장되어 있습니다.');
            }

            // 검색어 저장
            const saveData = await this.prismaService.searchkeyword.create({
                data: {
                    keyword,
                    user_id: ip ? null : userId,
                    ip: userId ? null : ip,
                }
            });
        
            return {
                statusCode: 201,
                saveData,
            };
        } catch (error) {
            if (error.code === 'P2002') {  // Prisma에서 발생하는 중복 에러 코드
                throw new ConflictException('이미 동일한 검색어가 저장되어 있습니다.');
            }
            throw error;
        }
        
    }

    async getTrendingKeywords(dto: GetTendingKeywordsDto) {

        const {age, gender, region} = dto

        try {
            // 24시간 이내 검색 기록 필터링
            const past24Hours = new Date();
            past24Hours.setHours(past24Hours.getHours() - 24);
      
            // 조건 필터링
            const filterConditions: any = {
                createdAt: {
                gte: past24Hours, 
                },
            };

            if(age) {
                filterConditions.user = { userInfo: { age }, };
            }
            if(gender) {
                if (!filterConditions.user) filterConditions.user = { userInfo: {} };
                filterConditions.user.userInfo.gender = gender;
            }
            if(region) {
                if (!filterConditions.user) filterConditions.user = { userInfo: {} };
                filterConditions.user.userInfo.region = region;
            }

            console.log(filterConditions)
            const keyword = await this.prismaService.searchkeyword.groupBy({
                by: ['keyword'],
                where: filterConditions,
                _count: {
                    keyword: true, 
                },
                orderBy: {
                    _count: {
                        keyword: 'desc', 
                    },
                },
                take: 10,
            });

            // 순위 및 응답 데이터 생성
            const response = keyword.map((item, index) => ({
                keyword: item.keyword,
                count: item._count.keyword,
                rank: index + 1,
            }));

            return {
                statusCode: 200,
                data: response,
            };
        } catch (error) {
            console.error(error);
            throw new Error('인기 검색어 조회 중 오류가 발생했습니다.');
        }
    }
}
