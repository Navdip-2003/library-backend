import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsIn, IsDate } from 'class-validator';

export class BookDto {
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsString()
  @IsNotEmpty()
<<<<<<< Updated upstream
  publisher?: string;
=======
  image: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;
>>>>>>> Stashed changes

  @IsNumber()
  @IsNotEmpty()
  year?: number;

  @IsString()
  @IsNotEmpty()
  genre?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity?: number;

  @IsBoolean()
  @IsOptional()
  availabilityStatus?: boolean;

  @IsString()
  @IsOptional()
  created_by?: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsString()
  @IsIn(['trending', 'arriving' , 'book'])
  status: string;

  @IsOptional()
  @IsDate()
  arrivalDate?: Date;
}
