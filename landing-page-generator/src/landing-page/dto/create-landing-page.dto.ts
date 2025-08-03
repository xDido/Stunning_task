import { IsString } from 'class-validator';

export class CreateLandingPageDto {
  @IsString()
  idea: string;
}
