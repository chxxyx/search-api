import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SaveSearchKeywordDto } from './dto/save.search.keyword.dto';
import { GetTendingKeywordsDto } from './dto/get.trending.keywords.dto';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 검색어 저장 
   */
  @Post('keywords')
  async insertSearchKeyword(
    @Body() dto: SaveSearchKeywordDto ) {
    return await this.searchService.saveSearchKeyword(dto);
  }

  /**
   * 인기 검색어 조회
   */
  @Get('trending')
  async getTrendingKeywords(
    @Query() dto: GetTendingKeywordsDto
  ) {
    return await this.searchService.getTrendingKeywords(dto);
  }

}
