import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'avatar string of the user',
    type: String,
  })
  @IsBoolean()
  @IsOptional()
  isActivated: boolean;

  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({
    description: 'bio string of the user',
    type: String,
  })
  @IsString()
  @IsOptional()
  about: string;

  @ApiProperty({
    description: 'social links of the user',
    type: String,
  })
  @IsString()
  @IsOptional()
  socialLink: string;
}
