import { Injectable } from '@nestjs/common';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Privilege } from 'src/utils/enums/privilege';
import { PrivilegeService } from './privilege.service';

@Injectable()
export class RoadmapService {
  constructor(
    private prismaService: PrismaService,
    private readonly privilegeService: PrivilegeService,
  ) {}

  getTag(tagId: number[]) {
    if (!tagId) return undefined;
    if (tagId.length > 0) {
      return this.prismaService.tag.findMany({
        where: {
          id: {
            in: tagId,
          },
        },
      });
    } else undefined;
  }

  getCategory(categoryId: number) {
    return categoryId !== undefined
      ? this.prismaService.category.findUnique({
          where: {
            id: categoryId,
          },
        })
      : undefined;
  }

  async create(userId: string, createRoadmapDto: CreateRoadmapDto) {
    try {
      // Get tags and category which is legal
      const tags = await this.getTag(createRoadmapDto.tagId);
      const category = await this.getCategory(createRoadmapDto.categoryId);

      // Create roadmap details
      const roadmapDetails = this.prismaService.roadmapDetails.create({
        data: {
          title: createRoadmapDto.title,
          avatar: createRoadmapDto.avatar,
          rating: 0,
          description: createRoadmapDto.description,
          level: createRoadmapDto.level,
          duration: createRoadmapDto.duration,
          topics: createRoadmapDto.topics,
          language: createRoadmapDto.language,
          isPublic: createRoadmapDto.isPublic,
          category: {
            connect: category,
          },
          tags: {
            connect: tags,
          },
          privileges: {
            create: {
              type: Privilege[Privilege.OWNER],
              userId: userId,
              createdAt: new Date(),
            },
          },
          type: createRoadmapDto.type,
          createdAt: new Date(),
          updateAt: new Date(),
        },
      });

      return roadmapDetails;
    } catch (error) {
      return error.message;
    }
  }

  async findAllPublicWithoutContent() {
    return await this.prismaService.roadmapDetails.findMany({
      where: {
        isPublic: true,
      },
      select: {
        title: true,
        avatar: true,
        rating: true,
        description: true,
        level: true,
        duration: true,
        topics: true,
        tags: true,
        language: true,
        category: true,
      },
    });
  }

  async findOne(id: string) {
    try {
      const rm = await this.prismaService.roadmapDetails.findUnique({
        where: {
          id: id,
        },
      });
      return rm;
    } catch (error) {
      return error.message;
    }
  }

  async update(id: string, updateRoadmapDto: UpdateRoadmapDto) {
    try {
      // Get tags and category which is legal
      const tags = await this.getTag(updateRoadmapDto.tagId);
      const category = await this.getCategory(updateRoadmapDto.categoryId);

      // Check if roadmap content is exist then create
      let rm: any;
      if (updateRoadmapDto.roadmap) {
        await this.prismaService.roadmap.delete({
          where: {
            detailsId: id,
          },
        });
        rm = await this.prismaService.roadmap.create({
          data: {
            title: updateRoadmapDto.roadmap.title,
            topics: updateRoadmapDto.roadmap.topics,
            detailsId: id,
          },
        });
      } else
        rm = await this.prismaService.roadmap.findUnique({
          where: {
            detailsId: id,
          },
        });
      // Check if tag id is legal and connect with roadmap
      return this.prismaService.roadmapDetails.update({
        where: {
          id: id,
        },
        data: {
          title: updateRoadmapDto.title || undefined,
          avatar: updateRoadmapDto.avatar || undefined,
          description: updateRoadmapDto.description || undefined,
          level: updateRoadmapDto.level || undefined,
          duration: updateRoadmapDto.duration || undefined,
          topics: updateRoadmapDto.topics || undefined,
          language: updateRoadmapDto.language || undefined,
          isPublic: updateRoadmapDto.isPublic || undefined,
          tags: {
            connect: tags,
          },
          category: {
            connect: category,
          },
          roadmap: { connect: rm },
          type: updateRoadmapDto.type || undefined,
          updateAt: new Date() || undefined,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      // Remove all privilege to this roadmap details and set isPublic to false
      const removePrivilege = this.privilegeService.removeAllPrivileges(id);
      const setPrivate = this.prismaService.roadmapDetails.update({
        where: {
          id: id,
        },
        data: {
          isPublic: false,
        },
      });
      await this.prismaService.$transaction([removePrivilege, setPrivate]);
      return 'success';
    } catch (error) {
      return error.message;
    }
  }
}
