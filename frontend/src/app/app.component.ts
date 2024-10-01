import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/partials/loading/loading.component';
//

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    LoadingComponent,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  // Code just to remove header when on the specific url
  showHeader = true;

  private router = inject(Router);

  // ngOnInit(): void {
  //   this.router.events
  //     .pipe(
  //       filter(
  //         (event): event is NavigationEnd => event instanceof NavigationEnd
  //       )
  //     )
  //     .subscribe((event: NavigationEnd) => {
  //       this.showHeader =
  //         event.url !== '/donate' &&
  //         event.url !== '/signup' &&
  //         event.url !== '/login' &&
  //         event.url !== '/about';
  //     });
  // }
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        // List of routes where the header should be hidden
        const hiddenHeaderRoutes = ['/donate', '/signup', '/login', '/about'];

        // Check if the current route is one of those
        this.showHeader = !hiddenHeaderRoutes.some((route) =>
          event.url.includes(route)
        );
      });
  }
}
