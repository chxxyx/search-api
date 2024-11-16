import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SearchModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
