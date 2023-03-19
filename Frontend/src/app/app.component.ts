import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Library';

  showButtons = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      // Boolean variable to remove nav buttons from login page
      if (event instanceof NavigationEnd) {
        // Verify actual url to see if in login page
        if (event.url === '/login') {
          this.showButtons = false;
        } else {
          this.showButtons = true;
        }
      }
    });
  }
}
