import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from '../dto/input/signup.input';
import { AuthResultDto } from '../dto/output/auth.result.output';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { CreateTokenResponse } from '../types/auth.type';
import { SignInDto } from '../dto/input/signin.input';
import { UsersService } from '../../users/services/users.service';
import { ChangePasswordDto } from '../dto/input/change-password.input';
import {
  // SafeUserResultDto,
  UserResultDto,
} from '../../users/dto/output/user.result.output';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async signUp(input: SignUpDto): Promise<AuthResultDto> {
    try {
      const { name, email, password, role } = input;

      await this.checkDuplicateEmail(email);

      const hashedPassword = await argon.hash(password);
      const payload = {
        name,
        email,
        password: hashedPassword,
        role,
      };

      const savedUser = await this.usersService.createUser(payload);

      const { access_token } = await this.createSignInToken(
        savedUser.id,
        savedUser.email,
      );

      const result = {
        ...savedUser,
        access_token,
      };

      return result;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async signIn(input: SignInDto): Promise<AuthResultDto> {
    const { email, password } = input;

    try {
      const user = await this.usersService.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const isPasswordMatch = await argon.verify(user?.password, password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const { access_token } = await this.createSignInToken(
        user.id,
        user.email,
      );

      const result = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        access_token,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return result;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async createSignInToken(
    userId: string,
    email: string,
  ): Promise<CreateTokenResponse> {
    const token = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    return { access_token: token };
  }

  async checkDuplicateEmail(email: string): Promise<void> {
    const existingClient = await this.usersService.findUserByEmail(email);

    if (existingClient) {
      throw new ConflictException('Email already in use.');
    }
  }

  async changePassword(
    userId: string,
    Input: ChangePasswordDto,
  ): Promise<UserResultDto> {
    try {
      const { oldPassword, newPassword } = Input;

      const user = await this.usersService.findUserById(userId);

      const isPasswordMatch = await argon.verify(user.password, oldPassword);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const hashedPassword = await argon.hash(newPassword);

      const result = await this.usersService.updateUserPassword(userId, {
        password: hashedPassword,
      });

      return result;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }
}
