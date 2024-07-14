import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateBorrowingDto {
  @IsString()
  userId: string;

  @IsString()
  bookId: string;

  @IsDateString()
  borrowDate: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsNumber()
  lateFees?: number;
}
