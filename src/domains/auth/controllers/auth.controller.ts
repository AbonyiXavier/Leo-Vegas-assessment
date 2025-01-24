import { Controller, Post, Body, UsePipes, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/input/signup.input';
import { Public } from '../../../common/decorators/public.decorator';
import { SignInDto } from '../dto/input/signin.input';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/custom-pipes/zod-validation.pipe';
import {
  changePasswordSchema,
  signInSchema,
  signUpSchema,
} from '../../../common/schemas';
import { ChangePasswordDto } from '../dto/input/change-password.input';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/signup')
  @ApiCreatedResponse({
    type: SignUpDto,
    description: 'Sign up successfully',
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiCreatedResponse()
  @UsePipes(
    new ZodValidationPipe({
      body: signUpSchema,
    }),
  )
  async signup(@Body() input: SignUpDto) {
    return await this.authService.signUp(input);
  }

  @Public()
  @Post('/signin')
  @ApiOkResponse({
    type: SignInDto,
    description: 'Signed in successfully',
  })
  @ApiUnauthorizedResponse()
  @UsePipes(
    new ZodValidationPipe({
      body: signInSchema,
    }),
  )
  async signin(@Body() input: SignInDto) {
    return await this.authService.signIn(input);
  }

  @Post('/password')
  @ApiBearerAuth('defaultBearerAuth')
  @ApiCreatedResponse({
    type: ChangePasswordDto,
    description: 'Password changed successfully',
  })
  @ApiUnauthorizedResponse()
  @UsePipes(
    new ZodValidationPipe({
      body: changePasswordSchema,
    }),
  )
  async changePassword(@Request() req, @Body() input: ChangePasswordDto) {
    return await this.authService.changePassword(req.user.id, input);
  }
}
