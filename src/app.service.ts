import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { chromium } from 'playwright';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class GeminiService {
  async processUrl(url: string): Promise<string> {
    const htmlContent = await fetchPageContent(url);
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash-lite',
      maxOutputTokens: 2048,
      temperature: 0,
    });
    const response = await model.invoke([
      new HumanMessage(humanMessagePrompt.replace('{htmlContet}', htmlContent)),
    ]);
    const text = response.content;
    console.log('Gemini API response:', response.content);
    return text.toString();
  }
}

function fetchPageContent(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const content = await page.content();
      await browser.close();
      resolve(content);
    } catch (error) {
      reject(error);
    }
  });
}

const humanMessagePrompt = `Analyze this HTML rendered dump from a webpage and provide a concise summary of its main content, key points, and any relevant insights. 
Focus on extracting the most important information while ignoring any irrelevant details or boilerplate text. Format the response with a Header of the site name, if not present use the URL. The HTML dump is: {htmlContet}`;

// TODO: setup data validation for the incoming URL
// TODO: Setup error handling for the Gemini API call
// TODO: Implement a DB to store processed URLs and their summaries
