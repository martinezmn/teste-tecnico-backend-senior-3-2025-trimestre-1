import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { StaticService } from './static.service';
import { Response } from 'express';
import { lookup } from 'mime-types';

@Controller('static')
export class StaticController {
  private readonly logger = new Logger(StaticController.name);

  constructor(private readonly staticService: StaticService) {}

  @Get('image/:filename')
  async get(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const file = await this.staticService.getFile(filename);
      if (!file) {
        throw new NotFoundException('Image not found');
      }
      const mimeType = lookup(filename) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.send(file);
    } catch (error) {
      this.logger.error(error);
      res.status(500).send('Internal server error');
    }
  }
}
