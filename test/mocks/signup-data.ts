import { UserRole } from '../../src/common/constant';

export const usersMockData = {
  signUpDto: {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    role: UserRole.User,
  },

  adminSignUpDto: {
    name: 'Admin User',
    email: 'testadminuser@example.com',
    password: 'password123',
    role: UserRole.Admin,
  },

  existingSignUpDto: {
    name: 'Existing User',
    email: 'another@example.com',
    password: 'password123',
    role: UserRole.User,
  },

  userSignUpDto: {
    name: 'Test User',
    email: 'duplicate@example.com',
    password: 'password123',
    role: UserRole.User,
  },

  duplicateSignUpDto: {
    name: 'Duplicate User',
    email: 'duplicate@example.com',
    password: 'password123',
    role: UserRole.User,
  },

  createUserInput: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password456',
    role: UserRole.User,
  },

  userUpdateData: {
    name: 'Johnathan Doe',
  },

  findAllQuery: { page: 1, limit: 10 },

  userData: {
    id: 'userId',
    name: 'test user',
    email: 'user@gmail.com',
    password: 'password',
    role: UserRole.User,
    created_at: new Date(),
    updated_at: new Date(),
  },

  adminUserData: {
    id: 'adminUserId',
    name: 'test user',
    email: 'user@gmail.com',
    password: 'password',
    role: UserRole.Admin,
    created_at: new Date(),
    updated_at: new Date(),
  },
};
