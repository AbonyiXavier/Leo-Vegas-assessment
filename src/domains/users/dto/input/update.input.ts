import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../../common/constant';

export class PasswordDto {
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
