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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PrivilegeService } from '../privilege/privilege.service';
import { Privilege } from '../../utils/enums/privilege';
import { AiApiService } from '../ai-api/ai-api.service';

@Controller('api/roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService,
    private readonly privilegeService: PrivilegeService,
    private readonly aiService: AiApiService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createRoadmapDto: CreateRoadmapDto, @Request() req: any) {
    return this.roadmapService.create(req.user.sub, createRoadmapDto);
  }

  @Get()
  findAllPublicWithoutContent() {
    return this.roadmapService.findAllPublicWithoutContent();
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async findManyOfUser(@Request() req: any) {
    return this.privilegeService.getAllPrivilege(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') rmId: string, @Request() req: any) {
    try {
      // Get the roadmap details with content
      const rm = await this.roadmapService.findOne(rmId);
      // Get the right of user to roadmap
      const right = (
        await this.privilegeService.getPrivilege(req.user.sub, rmId)
      ).type;
      // Check if the user have right to access
      if (!right)
        throw new HttpException(
          'You dont have access right',
          HttpStatus.FORBIDDEN,
        );
      // Check if the roadmap dont exists
      if (!rm) {
        throw new HttpException(
          'there was no roadmap found',
          HttpStatus.NOT_FOUND,
        );
      }
      // Check if roadmap is private and the user is not the owner
      if (!rm.isPublic && right !== Privilege[Privilege.OWNER])
        throw new HttpException(
          'there was no roadmap found',
          HttpStatus.NOT_FOUND,
        );
      return rm;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') rmId: string,
    @Request() req: any,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    try {
      console.log(updateRoadmapDto);
      //Check if the user is the owner
      const right = await this.privilegeService.getPrivilege(
        req.user.sub,
        rmId,
      );
      if (!right) throw new HttpException('there was no roadmap found', 404);
      if (right.type !== Privilege[Privilege.OWNER])
        throw new HttpException(
          'there was no roadmap found',
          HttpStatus.NOT_FOUND,
        );
      return this.roadmapService.update(rmId, updateRoadmapDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') rmId: string, @Request() req: any) {
    try {
      //Check if the user is the owner
      const right = await this.privilegeService.getPrivilege(
        req.user.sub,
        rmId,
      );
      if (!right) throw new HttpException('there was no roadmap found', 404);

      if (right.type !== Privilege[Privilege.OWNER])
        throw new HttpException(
          'there was no roadmap found',
          HttpStatus.NOT_FOUND,
        );
      return this.roadmapService.remove(rmId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
