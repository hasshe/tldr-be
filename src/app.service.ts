import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { chromium } from 'playwright';
import {
  testConnection,
  saveSummary,
  getSummaryByUrl,
  updateSummary,
} from './repository/db';

@Injectable()
export class AppService {
  async onModuleInit() {
    await testConnection();
  }

  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class GeminiService {
  async processUrl(url: string): Promise<string> {
    const existingSummary = await getSummaryByUrl(url);
    const oneWeekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (existingSummary) {
      console.log('Found existing summary in DB for URL:', url);
      const createdAtMs = Date.parse(existingSummary.created_at + 'T00:00:00Z');
      if (createdAtMs >= oneWeekAgoMs) {
        console.log('Found existing recent summary in DB for URL:', url);
        return existingSummary.summary;
      }
      console.log('Summary is older than 1 week, refreshing for URL:', url);
      const text = await callGeminiAPI(url);
      await updateSummary(url, text);
      return text;
    }
    console.log('No existing summary found, creating new entry for URL:', url);
    const text = await callGeminiAPI(url);
    await saveSummary(url, text);
    return text;
  }
}

async function callGeminiAPI(url: string): Promise<string> {
  const htmlContent = await fetchPageContent(url);
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash-lite',
    maxOutputTokens: 2048,
    temperature: 0,
  });
  const response = await model.invoke([
    new HumanMessage(humanMessagePrompt.replace('{htmlContet}', htmlContent)),
  ]);
  const text =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
  return text;
}

async function fetchPageContent(url: string): Promise<string> {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const content = await page.content();
    await browser.close();
    return content;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

const humanMessagePrompt = `Analyze this HTML rendered dump from a webpage and provide a concise summary of its main content, key points, and any relevant insights. 
Focus on extracting the most important information while ignoring any irrelevant details or boilerplate text. Format the response with a Header of the site name, if not present use the URL. The HTML dump is: {htmlContet}`;

// TODO: setup data validation for the incoming URL
// TODO: Setup error handling for the Gemini API call
// TODO: Implement a DB to store processed URLs and their summaries
