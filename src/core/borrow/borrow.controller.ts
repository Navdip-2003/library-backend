import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { CreateBorrowingDto } from "./borrow.dto";
import { BorrowingService } from "./borrow.service";

@Controller('borrowings')
export class BorrowingController {
    constructor(private readonly borrowingService: BorrowingService) {}
  
    @Post('add')
    async addBook(@Res() res, @Body() borrowDto: CreateBorrowingDto) {
        const result = await this.borrowingService.addBook(borrowDto);
        return res.status(result.status).send(result);
    }
  
    @Get('all')
    async getAllBorrow(@Res() res) {
        const result = await this.borrowingService.getAllBorrow();
        return res.status(result.status).send(result);
    }
  
    @Get('all')
    async getBorrowById(@Res() res,@Param('id') id: string) {
        const result = await this.borrowingService.getBorrowById(id);
        return res.status(result.status).send(result);
    }
  
    @Put(':id')
    async updateBorrow(@Res() res,@Param('id') id: string, @Body() borrowDto: CreateBorrowingDto){
        const result = await this.borrowingService.updateBorrow(id,borrowDto);
        return res.status(result.status).send(result);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.borrowingService.remove(id);
    }
  }