import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsString({
    message: 'Название обязательно',
  })
  @IsNotEmpty({
    message: 'Название не может быть пустым',
  })
  title: string;

  @IsString({
    message: 'Описание обязательно',
  })
  @IsNotEmpty({
    message: 'Описание не может быть пустым',
  })
  description: string;

  @IsNumber(
    {},
    {
      message: 'Цена должна быть числом',
    },
  )
  @IsNotEmpty({
    message: 'Цена не может быть пустым',
  })
  price: number;

  @IsString({
    message: 'Укажите хотя бы одну картинку',
    each: true,
  })
  @ArrayMinSize(1, { message: 'Должна быть хотя бы одна картинка' })
  @IsNotEmpty({
    message: 'Путь к картинке не может быть пустым',
  })
  images: string[];

  @IsString({
    message: 'Категория обязательно',
  })
  @IsNotEmpty({
    message: 'ID rатегории не может быть пустым',
  })
  categoryId: string;

  @IsString({
    message: 'Цвет обязательно',
  })
  @IsNotEmpty({
    message: 'ID цвета не может быть пустым',
  })
  colorId: string;
}
