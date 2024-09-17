import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({
    message: 'название обязательно',
  })
  title: string;
}
