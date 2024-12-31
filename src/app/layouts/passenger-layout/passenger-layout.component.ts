import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/auth/authentication/authentication.service";

@Component({
  selector: 'app-passenger-layout',
  templateUrl: './passenger-layout.component.html',
  styleUrl: './passenger-layout.component.css'
})
export class PassengerLayoutComponent {
  constructor(private router: Router, private authService: AuthenticationService) {}



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
