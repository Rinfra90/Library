import { Component } from '@angular/core';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  login(email: string) {
    this.bookService.login(email);
  }
}
