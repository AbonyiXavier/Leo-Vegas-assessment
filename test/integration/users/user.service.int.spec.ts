import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../../src/domains/users/services/users.service';
import { mysqlDataSource } from '../db/mysql/int-container';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../../src/domains/users/users.module';
import createConnectionOptions from '../../../ormconfig';
import { UserRole } from '../../../src/common/constant';
import { usersMockData } from '../../mocks/signup-data';

describe('UserService Integration Tests', () => {
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, TypeOrmModule.forRoot(createConnectionOptions)],
      providers: [
        UsersService,
        {
          provide: Logger,
          useValue: new Logger('UsersService'),
        },
      ],
    })
      .overrideProvider(DataSource)
      .useValue(mysqlDataSource)
      .compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userInput = usersMockData.signUpDto;

      const result = await usersService.createUser(userInput);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email', userInput.email);
      expect(result).toHaveProperty('name', userInput.name);
    });
  });

  describe('updateUserDetails', () => {
    it('should update user details successfully', async () => {
      const userInput = usersMockData.createUserInput;
      const createdUser = await usersService.createUser(userInput);

      const updateData = usersMockData.userUpdateData;
      const updatedUser = await usersService.updateUserDetails(
        createdUser.id,
        createdUser.id,
        updateData,
        UserRole.User,
      );

      expect(updatedUser).toBe('User updated successfully');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(
        usersService.updateUserDetails(
          'invalid-id',
          'invalid-id',
          usersMockData.userUpdateData,
          UserRole.User,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should throw ForbiddenException if user tries to delete themselves', async () => {
      const userInput = usersMockData.adminSignUpDto;
      const createdUser = await usersService.createUser(userInput);

      await expect(
        usersService.deleteUser(createdUser.id, createdUser.id, UserRole.User),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const user = {
        ...usersMockData.createUserInput,
        email: 'another@example.com',
      };

      await usersService.createUser(user);

      const result = await usersService.findAll(usersMockData.findAllQuery);

      expect(result.data).toHaveLength(4);
      expect(result.total).toBe(4);
    });
  });
});
