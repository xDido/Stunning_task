// src/landing-page/landing-page.service.ts

import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import {
    LandingPage,
    LandingPageDocument,
} from './schemas/landing-page.schema';
import {Model} from 'mongoose';
import {CreateLandingPageDto} from './dto/create-landing-page.dto';

import {GoogleGenerativeAI} from '@google/generative-ai';

dotenv.config();

@Injectable()
export class LandingPageService {
    private genAI = new GoogleGenerativeAI("AIzaSyASNhhgvRRj9Y-WETn3-_m9vkU2WbvKSAA");
    private model = this.genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

    constructor(
        @InjectModel(LandingPage.name)
        private landingPageModel: Model<LandingPageDocument>,
    ) {
    }

    async create(dto: CreateLandingPageDto): Promise<LandingPage> {
        const prompt = this.buildPrompt(dto.idea);
        const result = await this.model.generateContent(prompt);
        const response = await result.response.text();

        // More comprehensive JSON cleaning
        let cleanJson = response
            .replace(/^\s*```json\s*/i, '') // remove ```json at start
            .replace(/^\s*```\s*/i, '')     // remove ``` at start
            .replace(/\s*```$/, '')         // remove ``` at end
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control characters
            .replace(/^\s+|\s+$/g, '')      // trim whitespace
            .replace(/\n\s*\n/g, '\n')      // remove extra blank lines
            .trim();

        // Log the cleaned JSON for debugging
        console.log('Raw response length:', response.length);
        console.log('Cleaned JSON:', cleanJson);
        console.log('First 100 chars:', cleanJson.substring(0, 100));
        console.log('Last 100 chars:', cleanJson.substring(cleanJson.length - 100));

        let sections: any[];
        try {
            const parsed = JSON.parse(cleanJson);

            // Validate that parsed object has sections array
            if (!parsed || typeof parsed !== 'object') {
                throw new Error('Parsed JSON is not an object');
            }

            if (!Array.isArray(parsed.sections)) {
                throw new Error('Sections is not an array');
            }

            sections = parsed.sections;
            console.log('Successfully parsed sections:', sections.length);

        } catch (e) {
            console.error('JSON Parse Error:', e.message);
            console.error('Failed to parse Gemini JSON:');
            console.error('Length:', cleanJson.length);
            console.error('Content:', JSON.stringify(cleanJson));

            // Try to find JSON within the response
            const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.sections) {
                        sections = parsed.sections;
                        console.log('Successfully parsed JSON from regex match');
                    } else {
                        throw new Error('No sections found in matched JSON');
                    }
                } catch (regexError) {
                    console.error('Regex match also failed:', regexError.message);
                    throw new Error(`Invalid JSON from Gemini. Original error: ${e.message}`);
                }
            } else {
                throw new Error(`Invalid JSON from Gemini. Original error: ${e.message}`);
            }
        }

        const landingPage = new this.landingPageModel({
            idea: dto.idea,
            sections,
        });

        return landingPage.save();
    }

    async findOne(id: string): Promise<LandingPage | null> {
        return this.landingPageModel.findById(id).exec();
    }

    getHello(): string {
        return 'Hello World!';
    }

    private buildPrompt(idea: string): string {
        return `
You are a frontend AI assistant. Given the idea "${idea}", generate a landing page layout as JSON.

Return ONLY valid JSON in this exact format with NO additional text, markdown, or explanations:

{
  "sections": [
    {
      "type": "hero",
      "props": {
        "heading": "Welcome to Sweet Crumbs",
        "subheading": "Freshly baked daily.",
        "backgroundImage": "/hero.jpg"
      }
    },
    {
      "type": "about",
      "props": {
        "title": "About Us",
        "description": "We are a family bakery with a passion for pastry."
      }
    },
    {
      "type": "contact",
      "props": {
        "email": "hello@bakery.com",
        "phone": "123-456-7890"
      }
    }
  ]
}

CRITICAL: Return ONLY the JSON object above, nothing else.
        `.trim();
    }
}