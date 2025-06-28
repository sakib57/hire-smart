import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { SignupDTO } from './dto/signup.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { seconds, Throttle } from '@nestjs/throttler';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe(true))
  @ApiSecurity('X-CSRF-TOKEN')
  @Post('signup')
  signup(@Body() signUpDto: SignupDTO) {
    return this.authService.signup(signUpDto);
  }

  @UsePipes(new ValidationPipe(true))
  @Throttle({
    default: {
      limit: 5,
      ttl: seconds(60),
    },
  })
  @ApiSecurity('X-CSRF-TOKEN')
  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }
}
