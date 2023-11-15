import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PrivilegeService } from '../privilege/privilege.service';
import { Privilege } from '../../utils/enums/privilege';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';
import { ResponseModel } from 'src/interface/responseModel.interface';

@Controller('api/roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService,
    private readonly privilegeService: PrivilegeService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createRoadmapDto: CreateRoadmapDto,
    @Request() req: any,
  ) {
    let res: ResponseModel = {
      data: {},
      message: 'Create Roadmap successfully',
      code: HttpStatus.CREATED,
    };
    try {
      return (res = {
        ...res,
        data: await this.roadmapService.create(req.user.sub, createRoadmapDto),
      });
    } catch (err) {
      return (res = {
        ...res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      });
    }
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAllPublicWithoutContent(@Param('roadmapId') rmId: string) {
    let res: ResponseModel = {
      data: [],
      message: 'Find Roadmaps successfully',
      code: HttpStatus.OK,
    };
    try {
      if (!rmId)
        return (res = {
          ...res,
          data: await this.roadmapService.findAllPublicWithoutContent(),
        });
      else
        return (res = {
          ...res,
          data: await this.roadmapService.findRelativeRoadmap(rmId),
        });
    } catch (err) {
      return (res = {
        ...res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      });
    }
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async findManyOfUser(@Request() req: any) {
    let res: ResponseModel = {
      data: {},
      message: 'Find Roadmaps successfully',
      code: HttpStatus.OK,
    };
    try {
      return (res = {
        ...res,
        data: await this.privilegeService.getAllPrivilege(req.user.sub),
      });
    } catch (err) {
      return (res = {
        ...res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      });
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') rmId: string, @Request() req: any) {
    let res: ResponseModel = {
      data: {},
      message: 'Find Roadmap successfully',
      code: HttpStatus.OK,
    };
    try {
      // Get the roadmap details with content
      const rm = await this.roadmapService.findOne(rmId);
      // Get the right of user to roadmap
      const right = (
        await this.privilegeService.getPrivilege(req.user.sub, rmId)
      ).type;
      // Check if the user have right to access
      if (!right)
        return (res = {
          ...res,
          code: HttpStatus.FORBIDDEN,
          message: 'You dont have access right',
        });

      // Check if the roadmap dont exists
      if (!rm)
        return (res = {
          ...res,
          code: HttpStatus.NOT_FOUND,
          message: 'There was no roadmap found',
        });

      // Check if roadmap is private and the user is not the owner
      if (!rm.isPublic && right !== Privilege[Privilege.OWNER])
        return (res = {
          ...res,
          code: HttpStatus.NOT_FOUND,
          message: 'There was no roadmap found',
        });
      return (res = {
        ...res,
        data: rm,
      });
    } catch (err) {
      return (res = {
        ...res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      });
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') rmId: string,
    @Request() req: any,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    let res: ResponseModel = {
      data: {},
      message: 'Update Roadmap successfully',
      code: HttpStatus.OK,
    };
    try {
      //Check if the user is the owner
      const right = await this.privilegeService.getPrivilege(
        req.user.sub,
        rmId,
      );
      if (!right)
        return (res = {
          ...res,
          code: HttpStatus.NOT_FOUND,
          message: 'There was no roadmap found',
        });
      if (right.type !== Privilege[Privilege.OWNER])
        return (res = {
          ...res,
          code: HttpStatus.NOT_FOUND,
          message: 'There was no roadmap found',
        });
      return (res = {
        ...res,
        data: await this.roadmapService.update(rmId, updateRoadmapDto),
      });
    } catch (err) {
      return (res = {
        ...res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      });
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') rmId: string, @Request() req: any) {
    let res: ResponseModel = {
      data: {},
      message: 'Update Roadmap successfully',
      code: HttpStatus.OK,
    };
    try {
      //Check if the user is the owner
      const right = await this.privilegeService.getPrivilege(
        req.user.sub,
        rmId,
      );
      if (!right)
        return (res = {
          ...res,
          code: HttpStatus.NOT_FOUND,
          message: 'There was no roadmap found',
        });
      if (right.type !== Privilege[Privilege.OWNER])
        return (res = {
          ...res,
          code: HttpStatus.NOT_FOUND,
          message: 'There was no roadmap found',
        });
      return (res = {
        ...res,
        data: await this.roadmapService.remove(rmId),
      });
    } catch (err) {
      return (res = {
        ...res,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something wrong',
      });
    }
  }
}
