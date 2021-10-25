import { Controller, Get, Param, Query } from '@nestjs/common';
import { CryptumService } from '../cryptum/cryptum.service';
import { Protocol } from '../cryptum/interfaces/protocols.interface';
import { GetBlockDto } from './dto/get-block.dto';

@Controller('block')
export class BlockController {
  constructor(private cryptumService: CryptumService) {}

  @Get(':block')
  getBlock(
    @Param('block') block: string,
    @Query('protocol') protocol: Protocol,
  ) {
    return this.cryptumService.getBlock(new GetBlockDto(block, protocol));
  }
}
