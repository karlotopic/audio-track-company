import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';
import { AccessTokenDto, CreateUserDto, LoginUserDto } from './dtos';
import { Body, Controller, Post } from '@nestjs/common';
import { AllowUnauthorized } from './auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiNotFoundResponse({
    description:
      'Employee with the given email, name and surname not existing.',
  })
  @ApiConflictResponse({
    description: 'Employee has a created account, go to login endpoint.',
  })
  @ApiOkResponse({
    description: 'Account for the given employee created.',
    type: AccessTokenDto,
    isArray: false,
  })
  @AllowUnauthorized()
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    return this.authService.register(createUser);
  }

  @ApiUnauthorizedResponse({
    description: 'Employee account not found or wrong credentials.',
  })
  @ApiOkResponse({
    description: 'Account for the given employee created.',
    type: AccessTokenDto,
    isArray: false,
  })
  @Post('login')
  @AllowUnauthorized()
  login(@Body() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  }
}
