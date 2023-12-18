import { IsNumber, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsNumber()
  goalBranchId: number;
}
