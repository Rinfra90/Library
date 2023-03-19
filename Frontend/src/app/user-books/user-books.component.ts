import { Component } from '@angular/core'
import { BookService } from '../book.service';
import { UserBooks } from '../userbooks';
import { Book } from '../books';

@Component({
  selector: 'app-user-books',
  templateUrl: './user-books.component.html',
  styleUrls: ['./user-books.component.css']
})
export class UserBooksComponent {
  constructor(private bookService: BookService) { }

  userBooks: UserBooks[] = []; // Data structure array of {id, isbn, read_count}
  personalBooks: Book[] = []; // Data structure array of books (isbn, title, etc.)

  getUserBooks(): void {
    this.bookService.getUserBooks()
      .subscribe(books => {
        this.userBooks = books
        this.getUserBooksData();
      }); // Get asynchronous data
  }

  getUserBooksData() {
    for (let i = 0; i < this.userBooks.length; i++) {
      this.bookService.getBook(this.userBooks[i].book_isbn).subscribe(book => {
        this.personalBooks.push(book);
        this.personalBooks.sort((a, b) => Number(a.title) - Number(b.title));
      })
    }
  }

  ngOnInit(): void {
    this.getUserBooks();
  }

  addCount(isbn: string): void {
    this.bookService.addBookReadCount(isbn).subscribe(_ => {
      const index = this.userBooks.findIndex(book => book.book_isbn === isbn);
      this.userBooks[index].read_count = String(Number(this.userBooks[index].read_count) + 1);
    })
  }

  removeCount(isbn: string): void {
    this.bookService.removeBookReadCount(isbn).subscribe(_ => {
      const index = this.userBooks.findIndex(book => book.book_isbn === isbn);
      if (Number(this.userBooks[index].read_count) > 0) { this.userBooks[index].read_count = String(Number(this.userBooks[index].read_count) - 1) };
    })
  }

  delete(isbn: string): void {
    this.bookService.removeFromLibrary(isbn).subscribe(_ => {
      const index = this.personalBooks.findIndex(book => book.isbn === isbn);
      this.personalBooks.splice(index, 1);
    });
  }
}
