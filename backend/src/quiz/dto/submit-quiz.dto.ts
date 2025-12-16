import { IsObject, IsNotEmpty } from 'class-validator';

export class SubmitQuizDto {
  @IsObject()
  @IsNotEmpty()
  answers: { [questionId: number]: number };
}
