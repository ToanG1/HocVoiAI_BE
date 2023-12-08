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
  UseInterceptors,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PrivilegeService } from '../privilege/privilege.service';
import { Privilege } from '../../utils/enums/privilege';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptors';

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
    return await this.roadmapService.create(req.user.sub, createRoadmapDto);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAllPublicWithoutContent(@Param('roadmapId') rmId: string) {
    if (!rmId) return await this.roadmapService.findAllPublicWithoutContent();
    else return await this.roadmapService.findRelativeRoadmap(rmId);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async findManyOfUser(@Request() req: any) {
    return await this.privilegeService.getAllPrivilege(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') rmId: string, @Request() req: any) {
    // Get the roadmap details with content
    const rm = await this.roadmapService.findOne(rmId);
    // Get the right of user to roadmap
    const right = await this.privilegeService.getPrivilege(req.user.sub, rmId);
    // Check if the user have right to access
    if (!right) throw new ForbiddenException();

    // Check if the roadmap dont exists
    if (!rm) throw new NotFoundException();

    // Check if roadmap is private and the user is not the owner
    if (!rm.isPublic && right.type !== Privilege[Privilege.OWNER])
      throw new NotFoundException();
    return rm;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') rmId: string,
    @Request() req: any,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    //Check if the user is the owner
    const right = await this.privilegeService.getPrivilege(req.user.sub, rmId);
    if (!right) throw new NotFoundException();
    if (right.type !== Privilege[Privilege.OWNER])
      throw new NotFoundException();
    return await this.roadmapService.update(rmId, updateRoadmapDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') rmId: string, @Request() req: any) {
    //Check if the user is the owner
    const right = await this.privilegeService.getPrivilege(req.user.sub, rmId);
    if (!right) throw new ForbiddenException();
    if (right.type !== Privilege[Privilege.OWNER])
      throw new ForbiddenException();
    return await this.roadmapService.remove(rmId);
  }
}
