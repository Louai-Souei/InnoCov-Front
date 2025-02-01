import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication/authentication.service';
import { UserService } from "../../services/user/user.service";
import { User } from "../../entity/User";
import {WebSocketService} from "../../services/web-socket/web-socket.service";

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
  activeUser: User | undefined;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private webSocketService: WebSocketService
  ) {}

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
    this.pageTitle = ROUTE_TITLES[url] || 'InnoCov';
  }

  logOutUser(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearLocalStorage();
        this.router.navigate(['/']).then(r => true);
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
