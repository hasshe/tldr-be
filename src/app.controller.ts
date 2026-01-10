import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Endpoint to receive URL and pass it to Gemini API for processing
  @Post('/process-url')
  processUrl(@Body() body: { url: string }): string {
    console.log('Received URL for processing:', body);
    if (!body || !body.url) {
      return 'Missing `url` in request body.';
    }
    return `Received URL: ${body.url}`;
  }
}

// TODO: Create a .env file to store Gemini API keys and other configurations securely.
// TODO: setup database connection for logging requests and responses.
// TODO: Setup JWT authentication for secure access to the endpoints.
// TODO: Implement error handling and logging mechanisms.
// TODO: Endpoint to fetch processed data from the database.
