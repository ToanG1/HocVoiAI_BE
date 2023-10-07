import { Injectable } from '@nestjs/common';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoadmapService {
  constructor(private prismaService: PrismaService) {}
  create(createRoadmapDto: CreateRoadmapDto) {
    return null;
  }

  findAll() {
    return `This action returns all roadmap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roadmap`;
  }

  update(id: number, updateRoadmapDto: UpdateRoadmapDto) {
    return `This action updates a #${id} roadmap`;
  }

  remove(id: number) {
    return `This action removes a #${id} roadmap`;
  }
}
