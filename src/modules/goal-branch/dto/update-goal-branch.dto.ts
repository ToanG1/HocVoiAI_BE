import { PartialType } from '@nestjs/swagger';
import { CreateGoalBranchDto } from './create-goal-branch.dto';

export class UpdateGoalBranchDto extends PartialType(CreateGoalBranchDto) {}
