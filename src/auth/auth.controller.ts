import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Missing token');
    }

    return this.authService.verifyUser(token);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { email, password } = signupDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.signUp(email, password);
  }

  @Post('signin')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'fareed.945@gmail.com',
          description: 'User email address',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'Test#007',
          description: 'User password',
        },
      },
    },
  })
  async signin(@Body() signinDto: SignupDto) {
    const { email, password } = signinDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.signIn(email, password);
  }
}
