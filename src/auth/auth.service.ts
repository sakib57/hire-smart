import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { SignupDTO } from './dto/signup.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // SignUp Method
  async signup(signUpDto: SignupDTO) {
    try {
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
      const user = await this.usersService.create({
        ...signUpDto,
        password: hashedPassword,
      });
      return this.generateToken(user);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  // Login Method
  async login(loginDto: LoginDTO) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  // Token generation
  private generateToken(user: any) {
    const payload = { sub: user.id, role: user.role, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
