import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsAlphanumeric, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsAlphanumeric()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters!' })
  password: string;
}
