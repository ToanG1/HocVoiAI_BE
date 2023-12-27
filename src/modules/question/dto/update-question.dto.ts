import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsBoolean } from 'class-validator';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
    @IsBoolean()
    isActivated: boolean;
    
}
