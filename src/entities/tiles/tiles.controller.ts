import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TilesService } from './tiles.service';

@Controller('tiles')
export class TilesController {
  constructor(private readonly tileService: TilesService) {}
  @Get(':z/:x/:y.pbf')
  async getTile(
    @Param('z') z: number,
    @Param('x') x: number,
    @Param('y') y: number,
    @Query('layers') layers: string,
    @Res() res: Response,
  ) {
    let buffer: Buffer;

    if (layers.includes('states')) {
      buffer = await this.tileService.getStateTile(z, x, y);
      res.setHeader('Content-Type', 'application/x-protobuf');
      res.send(buffer);
    } else if (layers.includes('counties')) {
      buffer = await this.tileService.getCountyTile(z, x, y);
      res.setHeader('Content-Type', 'application/x-protobuf');
      res.send(buffer);
    } else {
      res.status(404).send('Tile not found');
    }
  }
}
