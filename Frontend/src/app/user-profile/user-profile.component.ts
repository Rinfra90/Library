import { Component } from '@angular/core';
import { User } from '../users';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  currentUser: User = {
    id: '',
    name: '',
    surname: '',
    email: ''
  };

  ngOnInit() {
    if (this.bookService.getUser() === '' || this.bookService.getUser() === 'error') {
      this.router.navigate(['/login']);
    } else {
      this.bookService.getUserData().subscribe(user => this.currentUser = user);
    }
  }
}
