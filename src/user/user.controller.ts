import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { InsertUserDto } from './dto/insert.user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 유저 등록 
   */
  @Post()
  @ApiOperation({ summary: '유저 정보 등록'})
  async insertUser(
    @Body() dto: InsertUserDto ) {
    return await this.userService.insertUser(dto)
  }

}
