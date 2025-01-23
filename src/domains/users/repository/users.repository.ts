/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { PaginationQueryDto } from '../dto/input/paginationQuery.input';
import { PaginatedResultDto } from '../dto/output/pagination.result.output';
import { PasswordDto } from '../dto/input/update.input';
import { UserRole } from '../../../common/constant';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(data: Partial<Users>): Promise<Users> {
    const user = this.usersRepository.create(data);
    return await this.usersRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findUserById(userId: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResultDto<Users>> {
    const { page, limit } = query;
    const [data, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginatedResultDto<Users>(data, total);
  }

  async updateUserPassword(
    id: string,
    updateData: PasswordDto,
  ): Promise<Users> {
    const user = await this.findUserById(id);

    Object.assign(user, updateData);

    return await this.usersRepository.save(user);
  }

  async updateUserDetails(
    id: string,
    updateData: Partial<Users>,
    role: UserRole,
  ): Promise<Users> {
    const user = await this.findUserById(id);

    if (role !== UserRole.Admin) {
      const { role, password, email, ...allowedUpdates } = updateData;
      Object.assign(user, allowedUpdates);
    } else {
      const { password, email, ...adminAllowedUpdates } = updateData;
      Object.assign(user, adminAllowedUpdates);
    }

    return await this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
