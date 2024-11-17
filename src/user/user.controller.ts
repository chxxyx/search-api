import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { InsertUserDto } from './dto/insert.user.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 유저 등록 
   */
  @Post()
  async insertUser(
    @Body() dto: InsertUserDto ) {
    return await this.userService.insertUser(dto)
  }

}
