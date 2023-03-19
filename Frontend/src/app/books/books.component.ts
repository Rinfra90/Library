import { Component } from '@angular/core';
import { Book } from '../books';
import { BookService } from '../book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})


export class BooksComponent {
  constructor(private bookService: BookService) {}

  books : Book[] = [];

  getBooks(): void {
    this.bookService.getBooks()
      .subscribe(books => this.books = books); // Get asynchronous data
  }

  ngOnInit(): void {
    this.getBooks();
  }
}
