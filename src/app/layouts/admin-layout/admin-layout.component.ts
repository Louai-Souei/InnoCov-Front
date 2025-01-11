import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication/authentication.service';
import {UserService} from "../../services/user/user.service";
import {User} from "../../entity/User";

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
  activeUser: User | undefined;

  constructor(private router: Router,
              private authService: AuthenticationService,
              private userService: UserService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof Scroll) {
        this.updatePageTitle(event.routerEvent.url);
      }
    });
    this.userService.getActiveUser().subscribe({
      next: (activeUser) => {
        this.activeUser = activeUser.data;
      },
      error: (err) => {
        console.error('Error fetching active user', err);
      },
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
  getUserImageSrc(base64Image: string): string {
    if (!base64Image) {
      return '';
    }
    if (base64Image.startsWith('/9j/')) {
      return 'data:image/jpeg;base64,' + base64Image;
    } else if (base64Image.startsWith('iVBORw0KGgo=')) {
      return 'data:image/png;base64,' + base64Image;
    } else if (base64Image.startsWith('R0lGODlh')) {
      return 'data:image/gif;base64,' + base64Image;
    } else {
      return 'data:image/jpeg;base64,' + base64Image;
    }
  }
}
