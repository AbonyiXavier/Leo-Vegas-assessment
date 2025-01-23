import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { AuthService } from '../../../src/domains/auth/services/auth.service';
import { UsersService } from '../../../src/domains/users/services/users.service';
import { mysqlDataSource } from '../db/mysql/int-container';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../../src/domains/users/users.module';
import createConnectionOptions from '../../../ormconfig';
import { usersMockData } from '../../mocks/signup-data';
import { mockData } from '../../mocks/signin-data';

describe('AuthService Integration Tests', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, TypeOrmModule.forRoot(createConnectionOptions)],
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        JwtService,
        {
          provide: Logger,
          useValue: new Logger('AuthService'),
        },
      ],
    })
      .overrideProvider(DataSource)
      .useValue(mysqlDataSource)
      .compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should sign up a new user', async () => {
    const result = await authService.signUp(usersMockData.signUpDto);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('access_token');
    expect(result.email).toBe(usersMockData.signUpDto.email);
  });

  it('should sign up a new admin user', async () => {
    const result = await authService.signUp(usersMockData.adminSignUpDto);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('access_token');
    expect(result.email).toBe(usersMockData.adminSignUpDto.email);
  });

  it('should sign in an existing user', async () => {
    const signUpResult = await authService.signUp(
      usersMockData.existingSignUpDto,
    );
    const signInResult = await authService.signIn(mockData.signInDto);

    expect(signInResult).toHaveProperty('access_token');
    expect(signInResult.email).toBe(signUpResult.email);
  });

  it('should fail to sign in with incorrect credentials', async () => {
    await expect(
      authService.signIn(mockData.nonExistentSignInDto),
    ).rejects.toThrow();
  });

  it('should check for duplicate email during sign up', async () => {
    await authService.signUp(usersMockData.userSignUpDto);

    await expect(
      authService.signUp(usersMockData.duplicateSignUpDto),
    ).rejects.toThrow();
  });
});
