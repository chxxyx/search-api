import { Controller, Get, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 검색어 저장 
   */
  @Post('keywords')
  insertSearchKeyword() {}

  /**
   * 인기 검색어 조회
   */
  @Get('trending')
  getTrendingKeywords() {}

}
