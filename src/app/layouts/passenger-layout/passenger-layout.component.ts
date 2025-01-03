import {Component, OnInit} from '@angular/core';
import {Router, Scroll} from '@angular/router';
import {AuthenticationService} from '../../services/auth/authentication/authentication.service';

const ROUTE_TITLES: { [key: string]: string } = {
  '/passenger/available-routes': 'Available Routes',
  '/passenger/booked-routes': 'Booked Routes History',
  '/passenger/profile': 'Profile',
  '/passenger/history': 'History',
  '/passenger/about': 'About',
  '/help': 'Help',
};

@Component({
  selector: 'app-passenger-layout',
  templateUrl: './passenger-layout.component.html',
  styleUrls: ['./passenger-layout.component.css'],
})
export class PassengerLayoutComponent implements OnInit {
  pageTitle: string = '';

  constructor(private router: Router, private authService: AuthenticationService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof Scroll) {
        this.updatePageTitle(event.routerEvent.url);
      }
    });
  }
  updatePageTitle(url: string): void {
    this.pageTitle = ROUTE_TITLES[url] || 'InnoCov';
  }

  logOutUser(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearLocalStorage();
        this.router.navigate(['/']);
      },
      error: () => {
        console.error('Erreur lors de la déconnexion');
      },
    });
  }
}
