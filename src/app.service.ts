import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class GeminiService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  async processUrl(url: string): Promise<any> {
    console.log(`Processing URL with Gemini API: ${url}`);
    return { message: `Processed URL: ${url}` };
  }
}
