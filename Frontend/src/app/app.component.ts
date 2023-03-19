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
      if (event instanceof NavigationEnd) {
        // Verifica la URL attuale e imposta showButtons a false se necessario
        if (event.url === '/login') {
          this.showButtons = false;
        } else {
          this.showButtons = true;
        }
      }
    });
  }
}
