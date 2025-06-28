import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { SignupDTO } from './dto/signup.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe(true))
  @Post('signup')
  signup(@Body() signUpDto: SignupDTO) {
    return this.authService.signup(signUpDto);
  }

  @UsePipes(new ValidationPipe(true))
  @Throttle({
    default: {
      limit: 5,
      ttl: 60,
    },
  })
  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }
}
