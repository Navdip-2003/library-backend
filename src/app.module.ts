import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './core/Books/book.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [BookModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
