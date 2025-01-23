import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../../../../common/constant';

export class SignUpDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsAlphanumeric()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters!' })
  password: string;

  @ApiProperty({ required: true, default: 'USER' })
  @IsEnum(UserRole)
  role: UserRole;
}
