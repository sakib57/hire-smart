import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SkillCreateDTO } from './dto/skills-create.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: SkillCreateDTO) {
    try {
      return await this.prisma.skill.create({
        data: createDto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Skill already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByName(name: string) {
    return this.prisma.skill.findFirst({ where: { name } });
  }

  async delete(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return this.prisma.skill.delete({ where: { id } });
  }
}
