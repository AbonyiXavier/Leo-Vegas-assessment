import { TestingModule, Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../../src/domains/auth/services/auth.service';
import { UsersService } from '../../../src/domains/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

import {
  adminUser,
  adminUserData,
  expectedAdminResponse,
  expectedAdminUserResponse,
  expectedResponse,
  expectedUserResponse,
  incorrectOldPassword,
  mockCreateUser,
  mockFindById,
  mockFindUserByEmail,
  mockFindUserById,
  mockSignToken,
  mockUpdateUserPassword,
  newPassword,
  oldPassword,
  signInInput,
  signInInput2,
  signInInput3,
  signUpAdminUserInput,
  signUpUserInput,
  user,
  userData,
  userId,
} from './fixtures/mock-data';

describe('AuthService Unit Tests', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: mockFindUserByEmail,
            createUser: mockCreateUser,
            findUserById: mockFindUserById,
            updateUserPassword: mockUpdateUserPassword,
            findById: mockFindById,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: mockSignToken,
          },
        },
        {
          provide: Logger,
          useValue: new Logger('AuthService'),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('SignUp flow', () => {
    it('should sign up a user and return the user', async () => {
      mockCreateUser.mockResolvedValueOnce(userData);
      mockSignToken.mockReturnValueOnce('token');

      const response = await authService.signUp(signUpUserInput);

      expect(response).toEqual(expectedUserResponse);
    });

    it('should sign up a admin user and return the admin user', async () => {
      mockCreateUser.mockResolvedValueOnce(adminUserData);
      mockSignToken.mockReturnValueOnce('token');

      const response = await authService.signUp(signUpAdminUserInput);

      expect(response).toEqual(expectedAdminUserResponse);
    });

    it('should throw ConflictException if the email is already in use', async () => {
      const email = 'existing@example.com';

      mockFindUserByEmail.mockResolvedValueOnce({ id: 'user-id', email });

      await expect(authService.checkDuplicateEmail(email)).rejects.toThrow(
        ConflictException,
      );

      expect(mockFindUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('SignIn flow', () => {
    it('should throw an UnauthorizedException if the user cannot be signed in', async () => {
      mockFindUserByEmail.mockResolvedValueOnce(null);
      await expect(authService.signIn(signInInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should sign in a user and return user details along with an access token', async () => {
      const payload = {
        ...user,
        password: await argon.hash(user.password),
      };

      mockFindUserByEmail.mockResolvedValueOnce(payload);
      mockSignToken.mockReturnValueOnce('token');

      const response = await authService.signIn(signInInput2);

      expect(response).toEqual(expectedResponse);
    });

    it('should sign in an admin user and return admin user details along with an access token', async () => {
      const payload = {
        ...adminUser,
        password: await argon.hash(adminUser.password),
      };

      mockFindUserByEmail.mockResolvedValueOnce(payload);
      mockSignToken.mockReturnValueOnce('token');

      const response = await authService.signIn(signInInput3);

      expect(response).toEqual(expectedAdminResponse);
    });
  });

  describe('ChangePassword flow', () => {
    it('should change the password if the old password matches', async () => {
      const hashedOldPassword = await argon.hash(oldPassword);
      const hashedNewPassword = await argon.hash(newPassword);

      const user = {
        id: userId,
        password: hashedOldPassword,
      };

      mockFindById.mockResolvedValueOnce(user);
      mockUpdateUserPassword.mockResolvedValueOnce({
        id: userId,
        password: hashedNewPassword,
      });

      const result = await authService.changePassword(userId, {
        oldPassword,
        newPassword,
      });

      expect(mockFindById).toHaveBeenCalledWith(userId);
      expect(argon.verify(user.password, oldPassword)).resolves.toBeTruthy();
      expect(mockUpdateUserPassword).toHaveBeenCalledWith(userId, {
        password: expect.any(String),
      });
      expect(result).toEqual('Password updated successfully!');
    });

    it('should throw UnauthorizedException if the old password does not match', async () => {
      const user = {
        id: userId,
        password: await argon.hash(oldPassword),
      };

      mockFindById.mockResolvedValueOnce(user);

      await expect(
        authService.changePassword(userId, {
          oldPassword: incorrectOldPassword,
          newPassword,
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockFindById).toHaveBeenCalledWith(userId);
    });

    it('should log an error and throw if an error occurs', async () => {
      const error = new Error('Database error');

      mockFindById.mockRejectedValueOnce(error);

      await expect(
        authService.changePassword(userId, {
          oldPassword,
          newPassword,
        }),
      ).rejects.toThrow(error);

      expect(mockFindById).toHaveBeenCalledWith(userId);
    });
  });
});
