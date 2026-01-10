import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService, GeminiService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly geminiService: GeminiService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Endpoint to receive URL and pass it to Gemini API for processing
  @Post('/process-url')
  async processUrl(@Body() body: { url: string }): Promise<any> {
    console.log('Received URL for processing:', body);
    if (!body || !body.url) {
      return 'Missing `url` in request body.';
    }
    const result = await this.geminiService.processUrl(body.url);
    return { summary: result };
  }
}

// TODO: setup database connection for logging requests and responses.
// TODO: Setup JWT authentication for secure access to the endpoints.
// TODO: Implement error handling and logging mechanisms.
// TODO: Endpoint to fetch processed data from the database.
