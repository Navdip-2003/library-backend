import { Controller, Post, Get, Put, Delete, Body, Req, Res, Param, Logger, UseGuards } from '@nestjs/common';
import { BookDto } from './book.dto';
import { BookService } from './book.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('book')
export class BookController {
  private readonly logger = new Logger(BookController.name);

  constructor(private bookService: BookService) {}

  @Post('add')
  async addBook(@Req() request, @Res() res, @Body() bookDto: BookDto) {
    // bookDto.created_by = request.user.email;
    const result = await this.bookService.addBook(bookDto);
    return res.status(result.status).send(result);
  }

  @Get(':id')
  async getBookById(@Res() res, @Param('id') id: string) {
    const result = await this.bookService.getBookById(id);
    return res.status(result.status).send(result);
  }

  @Put('update/:id')
  async updateBook(@Req() request, @Res() res, @Param('id') id: string, @Body() bookDto: Partial<BookDto>) {
    const result = await this.bookService.updateBook(id, bookDto);
    return res.status(result.status).send(result);
  }

  @Delete('delete/:id')
  async deleteBook(@Res() res, @Param('id') id: string) {
    const result = await this.bookService.deleteBook(id);
    return res.status(result.status).send(result);
  }

  @Get('status/:status')
  async getBooksByStatus(@Res() res, @Param('status') status: string) {
    const result = await this.bookService.getBooksByStatus(status);
    return res.status(result.status).send(result);
  }

  

  @Get('all')
  async getAllBookDetails(@Res() res) {
      const result = await this.bookService.getAllBookDetails();
      return res.status(result.status).send(result);
  }
}
