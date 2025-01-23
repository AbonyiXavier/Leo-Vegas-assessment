import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/constant';
import { PaginationQueryDto } from '../dto/input/paginationQuery.input';
import { UpdateUserDto } from '../dto/input/update.input';
import { ZodValidationPipe } from '../../../common/custom-pipes/zod-validation.pipe';
import { updateUserSchema, userIdSchema } from '../../../common/schemas';

@ApiTags('User APIs')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/me')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({
    description: 'User detail fetched successfully!',
  })
  async userMe(@Request() req) {
    return await this.usersService.userMe(req.user.id);
  }

  @Roles(UserRole.Admin)
  @Get('/')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination (default is 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page (default is 10)',
  })
  @ApiOkResponse({
    description: 'All users fetched successfully!',
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const pageNumber = isNaN(Number(page)) ? 1 : Number(page);
    const limitNumber = isNaN(Number(limit)) ? 10 : Number(limit);

    const query = new PaginationQueryDto(pageNumber, limitNumber);

    const { data, total } = await this.usersService.findAll(query);

    const totalPages = Math.ceil(total / limitNumber);

    return {
      data: data,
      meta: {
        total,
        total_pages: totalPages,
      },
      links: {
        prev:
          pageNumber > 1
            ? `/users?page=${pageNumber - 1}&limit=${limitNumber}`
            : null,
        next:
          pageNumber < totalPages
            ? `/users?page=${pageNumber + 1}&limit=${limitNumber}`
            : null,
      },
    };
  }

  @Roles(UserRole.Admin)
  @Get('/:id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiNoContentResponse({ description: 'User fetched successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UsePipes(
    new ZodValidationPipe({
      param: userIdSchema,
    }),
  )
  async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @Roles(UserRole.Admin, UserRole.User)
  @Patch('/:id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({
    type: UpdateUserDto,
  })
  @ApiOkResponse({
    description: 'Update user details successfully!',
  })
  @UsePipes(
    new ZodValidationPipe({
      body: updateUserSchema,
      param: userIdSchema,
    }),
  )
  async updateUserDetails(
    @Request() req,
    @Body() data: UpdateUserDto,
    @Param('id') id: string,
  ) {
    const result = await this.usersService.updateUserDetails(
      req.user.id,
      id,
      data,
      req.user.role,
    );
    return result;
  }

  @Roles(UserRole.Admin, UserRole.User)
  @Delete('/:id')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UsePipes(
    new ZodValidationPipe({
      param: userIdSchema,
    }),
  )
  async deleteUser(@Request() req, @Param('id') id: string): Promise<void> {
    await this.usersService.deleteUser(req.user.id, id, req.user.role);
  }
}
