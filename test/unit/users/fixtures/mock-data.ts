import { UserRole } from '../../../../src/common/constant';

export const mockUsersRepository = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  findAll: jest.fn(),
  updateUserPassword: jest.fn(),
  updateUserDetails: jest.fn(),
  deleteUser: jest.fn(),
};

export const mockUser = {
  id: 'user-id',
  name: 'Test User',
  email: 'test@example.com',
  role: UserRole.User,
  created_at: new Date(),
  updated_at: new Date(),
};

export const mockUsersList = [
  mockUser,
  {
    id: 'another-user-id',
    name: 'Another User',
    email: 'another@example.com',
    role: UserRole.User,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.Admin,
    created_at: new Date(),
    updated_at: new Date(),
  },
];
