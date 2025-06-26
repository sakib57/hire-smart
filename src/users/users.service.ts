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

  // User Update
  async updateUser(
    id: string,
    data: { fullName?: string; location?: string; skillIds?: string[] },
  ) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        location: data.location,
      },
    });

    if (data.skillIds) {
      await this.prisma.userSkill.deleteMany({ where: { userId: id } });
      await this.prisma.userSkill.createMany({
        data: data.skillIds.map((skillId) => ({ userId: id, skillId })),
        skipDuplicates: true,
      });
    }

    return updateUser;
  }
}
