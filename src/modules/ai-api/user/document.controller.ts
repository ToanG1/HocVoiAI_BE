import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DocumentAiApiService } from './document-ai-api.service';

@Controller('api/ai/document')
export class DocumentController {
  constructor(private readonly documentService: DocumentAiApiService) {}

  @Get('subtitles')
  async getYoutubeSubsitles(@Query('videoId') videoId: string) {
    return this.documentService.getYoutubeSubsitles(videoId);
  }

  @Post('summarizes')
  async summarizeDocument(@Body('document') document: string) {
    return this.documentService.summarizeDocument(document);
  }
}
