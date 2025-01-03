import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication/authentication.service';

const ADMIN_ROUTE_TITLES: { [key: string]: string } = {
  '/admin/available-tasks': 'Available Tasks',
  '/admin/completed-tasks': 'Completed Tasks History',
  '/admin/profile': 'Profile',
  '/admin/history': 'History',
  '/admin/about': 'About',
  '/help': 'Help',
};

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent implements OnInit {
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
    this.pageTitle = ADMIN_ROUTE_TITLES[url] || 'Admin Portal';
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
