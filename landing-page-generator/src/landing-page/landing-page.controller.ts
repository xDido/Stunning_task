
import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { CreateLandingPageDto } from './dto/create-landing-page.dto';
import { LandingPage } from './schemas/landing-page.schema';

@Controller('landing-page')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Post()
  async create(@Body() dto: CreateLandingPageDto): Promise<LandingPage> {
    return this.landingPageService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LandingPage> {
    const page = await this.landingPageService.findOne(id);
    if (!page) throw new NotFoundException('Landing page not found');
    return page;
  }
}
