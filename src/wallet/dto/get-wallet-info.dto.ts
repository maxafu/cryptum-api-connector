import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Protocol } from '../../cryptum/interfaces/protocols.interface';

export class GetWalletInfoQueryStringDto {
  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tokenAddresses?: string[];
}

export class GetWalletInfoDto {
  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tokenAddresses?: string[];

  constructor(address: string, protocol: Protocol, tokenAddresses = null) {
    this.address = address;
    this.protocol = protocol;
    this.tokenAddresses = tokenAddresses;
  }
}
