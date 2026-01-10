import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, GeminiService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
