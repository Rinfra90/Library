import { Injectable } from '@angular/core';
import { BOOKS } from './mock-books';
import { Book } from './books';
import { User } from './users';
import { UserBooks } from './userbooks';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
// of is used to simulate Observable data
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private booksUrl = 'http://localhost:3000/api/books/'; // URL to API
  private userUrl = 'http://localhost:3000/api/user/';
  private userId = '';

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private router: Router
  ) { }

  private log(message: string) {
    this.messageService.add(`BookService: ${message}`)
  }

  // Need to handle error in wrong data from http requests
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // Need as parameter of http requests
  httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' })
  };

  // Used to give access to userID
  getUser(): string {
    return this.userId;
  }

  // post request to /api/user through id
  getUserData(): Observable<any> {
    return this.http.post<any>(this.userUrl, { id: this.getUser() }, this.httpOptions).pipe(
      tap(result => {
        if (result.id) {
          this.router.navigate(['/home']);
        } else {
          this.log(result.error)
          this.userId = 'error';
        }
      }),
      catchError(this.handleError<User>('getUserData'))
    )
  }

  // post request to /api/user through id
  login(loginEmail: string) {
    return this.http.post<any>(this.userUrl, { email: loginEmail }, this.httpOptions).pipe(
      tap(result => {
        if (result.id) {
          this.userId = result.id;
          this.booksUrl += this.userId;
          this.log('Logged in');
          this.router.navigate(['/home']);
        } else {
          this.log(result.error)
          this.userId = 'error';
        }
      }),
      catchError(this.handleError<User>('getUserData'))
    ).subscribe(user => this.userId = user.id)
  }

  // get request to /api/books/:id
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.booksUrl)
      .pipe(
        tap(_ => this.log('Books loaded')),
        catchError(this.handleError<Book[]>('getBooks', []))
      );
  }

  // get request to /api/books/:id/:isbn
  getBook(isbn: string | null): Observable<Book> {
    return this.http.get<Book>(this.booksUrl + '/' + isbn)
      .pipe(
        tap(_ => this.log(`Book ${isbn} loaded`)),
        catchError(this.handleError<Book>('getBook'))
      )
  }

  // get request to /api/books/:id/userbooks
  getUserBooks(): Observable<UserBooks[]> {
    return this.http.get<UserBooks[]>(this.booksUrl + '/userbooks')
      .pipe(
        tap(_ => this.log("User's books loaded")),
        catchError(this.handleError<UserBooks[]>('getUserBooks', []))
      );
  }

  // put request to /api/books/:id/addread/:isbn
  addBookReadCount(isbn: string): Observable<any> {
    return this.http.put<any>(this.booksUrl + `/addread/` + isbn, null, this.httpOptions).pipe(
      tap(result => {
        if (result.error) {
          this.log(result.error)
        } else {
          this.log('Book read count updated')
        }
      }),
      catchError(this.handleError<any>('addBookReadCount'))
    )
  }

  // put request to /api/books/:id/removeread/:isbn
  removeBookReadCount(isbn: string): Observable<any> {
    return this.http.put<any>(this.booksUrl + `/removeread/` + isbn, null, this.httpOptions).pipe(
      tap(result => {
        if (result.error) {
          this.log(result.error)
        } else {
          this.log('Book read count updated')
        }
      }),
      catchError(this.handleError<any>('addBookReadCount'))
    )
  }

  // post request to /api/books/:id
  addToLibrary(isbn: string): Observable<any> {
    const book: UserBooks = {
      user_id: this.getUser(),
      book_isbn: isbn,
      read_count: '0'
    }
    return this.http.post<any>(this.booksUrl, book, this.httpOptions).pipe(
      tap(result => {
        if (result.error) {
          this.log(result.error)
        } else {
          this.log('Book added to personal library')
        }
      }),
      catchError(this.handleError<any>('addToLibrary'))
    )
  }

  // delete request to /api/books/:id/:isbn
  removeFromLibrary(isbn: string): Observable<any> {
    return this.http.delete<any>(this.booksUrl + '/' + isbn, this.httpOptions).pipe(
      tap(result => {
        if (result.error) {
          this.log(result.error)
        } else {
          this.log('Book removed from library');
        }
      }),
      catchError(this.handleError<any>('removeFromLibrary'))
    )
  };
}
