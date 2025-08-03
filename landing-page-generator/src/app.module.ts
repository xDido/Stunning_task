// src/app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  LandingPage,
  LandingPageSchema,
} from './landing-page/schemas/landing-page.schema';
import { LandingPageController } from './landing-page/landing-page.controller';
import { LandingPageService } from './landing-page/landing-page.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) {
          throw new Error('MONGODB_URI environment variable is not set');
        }
        console.log('Connecting to MongoDB...');
        return { uri };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: LandingPage.name, schema: LandingPageSchema },
    ]),
  ],
  controllers: [LandingPageController],
  providers: [LandingPageService],
})
export class AppModule {}