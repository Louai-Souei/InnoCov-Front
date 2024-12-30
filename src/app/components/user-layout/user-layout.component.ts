import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentification-service/authentication.service';
import { WebSocketService } from '../../services/WebSocket/web-socket.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      // Connexion WebSocket via le service
      this.webSocketService.connect();
    }
  }

  logOutUser(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearLocalStorage();
        this.router.navigate(['/']);
      },
      error: () => {
        console.error("Erreur lors de la déconnexion");
      },
    });
  }
}
