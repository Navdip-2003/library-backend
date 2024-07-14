import { Injectable, Logger, BadRequestException, InternalServerErrorException, HttpStatus, NotFoundException } from '@nestjs/common';
import { BookDto } from './book.dto';


@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor() {}

  private async isIsbnExist(isbn: string): Promise<boolean> {
    const db = fb.firestore();
    const querySnapshot = await db.collection('books').where('isbn', '==', isbn).get();
    return !querySnapshot.empty;
  }

  async addBook(bookDto: BookDto) {
    try {
      const isDuplicateBook = await this.isIsbnExist(bookDto.isbn);

      if (isDuplicateBook) {
        throw new BadRequestException('Duplicate book ISBN');
      } else {
        const db = fb.firestore();
        bookDto.created_at = new Date();
        const bookRef = await db.collection('books').add(JSON.parse(JSON.stringify(bookDto)));
        return { success: true, status: HttpStatus.OK, data: { id: bookRef.id } };
      }
    } catch (error) {
      this.handleException(error);
    }
  }

  async getBookById(id: string) {
    try {
      const db = fb.firestore();
      const bookRef = await db.collection('books').doc(id).get();

      if (!bookRef.exists) {
        throw new NotFoundException('Book not found');
      }

      return { success: true, status: HttpStatus.OK, data: bookRef.data() };
    } catch (error) {
      this.handleException(error);
    }
  }

  async updateBook(id: string, bookDto: Partial<BookDto>) {
    try {
      const db = fb.firestore();
      const bookRef = db.collection('books').doc(id);
      const bookSnapshot = await bookRef.get();

      if (!bookSnapshot.exists) {
        throw new NotFoundException('Book not found');
      }

      bookDto.updated_at = new Date();
      await bookRef.update(JSON.parse(JSON.stringify(bookDto)));
      return { success: true, status: HttpStatus.OK, message: 'Book updated successfully' };
    } catch (error) {
      this.handleException(error);
    }
  }

  async deleteBook(id: string) {
    try {
      const db = fb.firestore();
      const bookRef = db.collection('books').doc(id);
      const bookSnapshot = await bookRef.get();

      if (!bookSnapshot.exists) {
        throw new NotFoundException('Book not found');
      }

      await bookRef.delete();
      return { success: true, status: HttpStatus.OK, message: 'Book deleted successfully' };
    } catch (error) {
      this.handleException(error);
    }
  }

  async getBooksByStatus(status: string) {
    try {
      const db = fb.firestore();
      const querySnapshot = await db.collection('books').where('status', '==', status).get();
      const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return { success: true, status: HttpStatus.OK, data: books };
    } catch (error) {
      this.handleException(error);
    }
  }

  async getArrivingBooksWithDaysLeft() {
    try {
      const db = fb.firestore();
      const querySnapshot = await db.collection('books').where('status', '==', 'arriving').get();
      const books = querySnapshot.docs.map(doc => {
        const bookData = doc.data();
        const arrivalDate = bookData.arrivalDate ? bookData.arrivalDate.toDate() : null;
        const daysLeft = arrivalDate ? Math.ceil((arrivalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
        return { id: doc.id, ...bookData, daysLeft };
      });

      return { success: true, status: HttpStatus.OK, data: books };
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any) {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      this.logger.error(error.message);
      throw error;
    } else {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
