import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowingDto } from './borrow.dto';

@Injectable()
export class BorrowingService {
    addBook(borrowDto: CreateBorrowingDto) {
        return { success: true, status: HttpStatus.OK, data: {  } };
    }
    getAllBorrow() {
        return { success: true, status: HttpStatus.OK, data: {  } };

    }
    getBorrowById(id: string) {
        return { success: true, status: HttpStatus.OK, data: {  } };

    }
    updateBorrow(id: string, borrowDto: CreateBorrowingDto) {
        return { success: true, status: HttpStatus.OK, data: {  } };

    }
    remove(id: string) {
        return { success: true, status: HttpStatus.OK, data: {  } };

    }

}
