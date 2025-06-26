import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Account Creation
  async create(data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    location?: string;
  }) {
    return await this.prisma.user.create({ data });
  }

  // Find user by email
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  // find user by ID
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
