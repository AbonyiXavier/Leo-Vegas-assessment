import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Users } from '../entities/user.entity';
import { UserResultDto } from '../dto/output/user.result.output';
import { SignUpDto } from '../../auth/dto/input/signup.input';
import { UsersRepository } from '../repository/users.repository';
import { PaginationQueryDto } from '../dto/input/paginationQuery.input';
import { PasswordDto } from '../dto/input/update.input';
import { UserRole } from '../../../common/constant';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(input: SignUpDto): Promise<UserResultDto> {
    try {
      return await this.usersRepository.createUser(input);
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<Users> {
    try {
      return await this.usersRepository.findUserByEmail(email);
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async userMe(userId: string): Promise<UserResultDto> {
    try {
      const user = await this.usersRepository.findUserById(userId);

      const result: UserResultDto = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return result;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<{ data: Users[]; total: number }> {
    try {
      return await this.usersRepository.findAll(query);
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async updateUserPassword(
    userId: string,
    updateData: PasswordDto,
  ): Promise<UserResultDto> {
    try {
      return await this.usersRepository.updateUserPassword(userId, updateData);
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async findById(userId: string): Promise<Users> {
    try {
      const user = await this.usersRepository.findUserById(userId);

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async findUserById(userId: string): Promise<UserResultDto> {
    try {
      const user = await this.usersRepository.findUserById(userId);

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const result: UserResultDto = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return result;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }

  async updateUserDetails(
    requestingUserId: string,
    targetUserId: string,
    updateData: Partial<Users>,
    role: UserRole,
  ): Promise<string> {
    const targetUser = await this.usersRepository.findUserById(targetUserId);

    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    if (requestingUserId !== targetUserId && role !== UserRole.Admin) {
      throw new ForbiddenException(
        'You are not authorized to update this user',
      );
    }

    const updatedUser = await this.usersRepository.updateUserDetails(
      targetUserId,
      updateData,
      role,
    );

    if (updatedUser) {
      return 'User updated successfully!';
    }
  }

  async deleteUser(
    requestingUserId: string,
    targetUserId: string,
    role: UserRole,
  ): Promise<void> {
    try {
      const userToDelete =
        await this.usersRepository.findUserById(targetUserId);

      if (!userToDelete) {
        throw new NotFoundException(`User with ID ${targetUserId} not found`);
      }

      if (requestingUserId === targetUserId) {
        throw new ForbiddenException('You cannot delete yourself');
      }

      if (role !== UserRole.Admin) {
        throw new ForbiddenException(
          'You do not have permission to delete users',
        );
      }

      await this.usersRepository.deleteUser(targetUserId);
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      throw error;
    }
  }
}
