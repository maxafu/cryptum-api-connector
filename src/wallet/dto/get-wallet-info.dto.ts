import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Protocol } from '../../cryptum/interfaces/protocols.interface';
import { Transform } from 'class-transformer';

export class GetWalletInfoQueryStringDto {
  @ApiProperty()
  @IsEnum(Protocol)
  protocol: Protocol;

  @ApiProperty({
    isArray: true,
    default: [],
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  tokenAddresses?: string[] = [];
}

export class GetWalletInfoDto extends GetWalletInfoQueryStringDto {
  address: string;

  constructor(address: string, protocol: Protocol, tokenAddresses = []) {
    super();
    this.address = address;
    this.protocol = protocol;
    this.tokenAddresses = tokenAddresses;
  }
}
