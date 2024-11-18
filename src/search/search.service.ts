import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SaveSearchKeywordDto } from './dto/save.search.keyword.dto';
import { GetTendingKeywordsDto } from './dto/get.trending.keywords.dto';

@Injectable()
export class SearchService {
    
    constructor(
        private prismaService: PrismaService,
    ) {}

    /**
     * 
     * @param dto :
     * - 비회원
     *   keyword(String), ip(String)
     * - 회원 :
     *   keyword(String), email(String)
     * @returns : 
     * { statusCode, search data }
     * 
     */
    async saveSearchKeyword(dto: SaveSearchKeywordDto) {
       
        const { keyword, email, ip } = dto;
    
        // 검색어 테이블에 유저 식별 값을 저장하기 위한 변수
        let userId: any;

        // 회원이 요청한 경우 
        // 요청 이메일 값이 존재하는 지 확인 
        if (email) {
            // 요청 값으로 회원 이메일 조회
            const user = await this.prismaService.user.findUnique({
                where: { email: email },
            });
        
            // 없을 경우 404 에러 처리
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
                // 이미 존재하면 예외 처리
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
            if (error.code === 'P2002') {  // 동일 유저의 검색어 중복 에러 코드
                throw new ConflictException('이미 동일한 검색어가 저장되어 있습니다.');
            }
            throw error;
        }
        
    }

    /**
     * 
     * @param dto :
     * - 필터링 요청 시 
     * age, gender, region (query)
     * @returns :
     * statusCode, data: []
     */
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

            // 상위 10개 검색어 필터링 리스트 
            const keyword = await this.prismaService.searchkeyword.groupBy({
                by: ['keyword'],
                where: filterConditions,
                _count: {
                    keyword: true, 
                },
                orderBy: {
                    _count: {
                        keyword: 'desc', // 내림차순
                    },
                },
                take: 10,
            });

            // 순위 및 응답 데이터 생성
            const response = keyword.map((item, index) => ({
                keyword: item.keyword, // 해당 검색어
                count: item._count.keyword, // 검색 횟수 
                rank: index + 1, // 순위
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
