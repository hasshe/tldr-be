import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class GeminiService {
  async processUrl(url: string): Promise<string> {
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash-lite',
      maxOutputTokens: 2048,
    });
    const response = await model.invoke([new HumanMessage('Hello world!')]);
    const text = response.content;
    console.log('Gemini API response:', response.content);
    return text.toString();
  }
}
