import { Injectable } from '@nestjs/common';
import { CreateRoadmapDto } from '../dto/create-roadmap.dto';
import { UpdateRoadmapDto } from '../dto/update-roadmap.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Privilege } from 'src/utils/enums/privilege.enum';
import { PrivilegeService } from '../../privilege/user/privilege.service';

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

  async getCategory(categoryId: number) {
    if (categoryId !== undefined) {
      const category = await this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      return category ? category : undefined;
    } else return undefined;
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
          avatar: createRoadmapDto.avatar || '',
          rating: 0,
          description: createRoadmapDto.description || '',
          level: createRoadmapDto.level || '',
          duration: createRoadmapDto.duration || '',
          topics: createRoadmapDto.topics || 0,
          language: createRoadmapDto.language || '',
          isPublic: createRoadmapDto.isPublic || false,
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
          roadmap: {
            create: {
              title: createRoadmapDto.title,
              topics: '',
              createdAt: new Date(),
              updatedAt: new Date(),
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

  async createGeneratedRoadmap(
    userId: string,
    createRoadmapDto: CreateRoadmapDto,
  ) {
    try {
      const category = await this.getCategory(createRoadmapDto.categoryId);

      // Create roadmap details
      const roadmapDetails = this.prismaService.roadmapDetails.create({
        data: {
          title: createRoadmapDto.title,
          avatar: createRoadmapDto.avatar || '',
          rating: 0,
          description: createRoadmapDto.description || '',
          level: createRoadmapDto.level || '',
          duration: createRoadmapDto.duration || '',
          topics: createRoadmapDto.topics || 0,
          language: createRoadmapDto.language || '',
          isPublic: createRoadmapDto.isPublic || false,
          category: {
            connect: category,
          },
          privileges: {
            create: {
              type: Privilege[Privilege.OWNER],
              userId: userId,
              createdAt: new Date(),
            },
          },
          roadmap: {
            create: {
              title: createRoadmapDto.title,
              topics: createRoadmapDto.milestones,
              updatedAt: new Date(),
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
        isActivated: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async search(title: string) {
    return await this.prismaService.roadmapDetails.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        isPublic: true,
        isActivated: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findRelativeRoadmap(id: string) {
    const rm = await this.findOne(id);
    return await this.prismaService.roadmapDetails.findMany({
      where: {
        category: {
          id: rm.category.id,
        },
        isPublic: true,
        isActivated: true,
      },
      select: {
        id: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    try {
      const rm = await this.prismaService.roadmapDetails.findUnique({
        where: {
          id: id,
          isActivated: true,
        },
        include: {
          roadmap: true,
          tags: true,
          category: true,
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
          isPublic: updateRoadmapDto.isPublic || false,
          tags: {
            connect: tags,
          },
          category: {
            connect: category,
          },
          roadmap: {
            update: {
              where: {
                detailsId: id,
              },
              data: {
                title: updateRoadmapDto.title || undefined,
                topics: updateRoadmapDto.milestones || undefined,
                updatedAt: new Date(),
              },
            },
          },
          type: updateRoadmapDto.type || undefined,
          updateAt: new Date(),
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
