import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication/authentication.service';

const DRIVER_ROUTE_TITLES: { [key: string]: string } = {
  '/driver/tasks': 'Available Tasks',
  '/driver/completed-tasks': 'Completed Tasks History',
  '/driver/profile': 'Profile',
  '/driver/history': 'History',
  '/driver/about': 'About',
  '/help': 'Help',
};

@Component({
  selector: 'app-driver-layout',
  templateUrl: './driver-layout.component.html',
  styleUrls: ['./driver-layout.component.css'],
})
export class DriverLayoutComponent implements OnInit {
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
    this.pageTitle = DRIVER_ROUTE_TITLES[url] || 'InnoCov';
  }

  logOutUser(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearLocalStorage();
        this.router.navigate(['/']);
      },
      error: () => {
        console.error('Error during logout');
      },
    });
  }
}
