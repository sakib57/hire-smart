import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { UserUpdateDTO } from './dto/user-update.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get User List // TODO: Search and Pagination
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Update User
  @UsePipes(new ValidationPipe(true))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiSecurity('X-CSRF-TOKEN')
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: UserUpdateDTO) {
    return this.usersService.updateUser(id, body);
  }
}
