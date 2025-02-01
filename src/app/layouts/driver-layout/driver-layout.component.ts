import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication/authentication.service';
import {UserService} from "../../services/user/user.service";
import {User} from "../../entity/User";
import {WebSocketService} from "../../services/web-socket/web-socket.service";

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
  activeUser: User | undefined;

  constructor(private router: Router,
              private authService: AuthenticationService,
              private userService: UserService,
              private webSocketService: WebSocketService) {}

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
    if (this.authService.getToken()) {
      // Connexion WebSocket via le service
      this.webSocketService.connect();
    }
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
