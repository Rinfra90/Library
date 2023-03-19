import { Component, Input } from '@angular/core';
import { Book } from '../books';
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common';
import { BookService } from '../book.service';
import { UserBooks } from '../userbooks';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})

export class BookDetailComponent {

  constructor (
    private route: ActivatedRoute, // holds information about the route to this instance. Need to extract parameter from url
    private location: Location, // help to navigate
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.getBook();
  }

  @Input() book?: Book;

  getBook(): void {
    const isbn = this.route.snapshot.paramMap.get('isbn'); // Get isbn from url
    this.bookService.getBook(isbn)
      .subscribe(book => this.book = book)
  }

  goBack(): void {
    this.location.back();
  }

  addToLibrary(isbn: string): void {
    this.bookService.addToLibrary(isbn)
      .subscribe();
  }
}
