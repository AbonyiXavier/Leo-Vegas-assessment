import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ required: true })
  @IsAlphanumeric()
  oldPassword: string;

  @ApiProperty({ required: true })
  @IsAlphanumeric()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters!' })
  newPassword: string;
}
