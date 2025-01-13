import { Component } from '@angular/core';
import { AuthenticationRequest } from "../../../util/AuthenticationRequest";
import { AuthenticationService } from "../../../services/auth/authentication/authentication.service";
import { Router } from "@angular/router";
import { AlertService } from "../../../services/utils/alert/alert.service";
import { ApiResponse } from "../../../services/utils/models/ApiResponse";
import { AuthenticationResponse } from "../../../util/AuthenticationResponse";
import { Role } from "../../../entity/enums/Role";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginRequest: AuthenticationRequest = new AuthenticationRequest();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService
  ) {}

  loginUser(): void {
    this.authenticationService.login(this.loginRequest).subscribe({
      next: (response: ApiResponse<AuthenticationResponse>) => {
        if (response.success) {
          this.authenticationService.setUserInformation(response.data!);

          switch (response.data!.role) {
            case Role.DRIVER:
              this.router.navigate(['driver/MyRoutes']);
              break;
            case Role.PASSENGER:
              this.router.navigate(['passenger/available-routes']);
              break;
            case Role.ADMIN:
              this.router.navigate(['admin/dashboard']);
              break;
            default:
              this.alertService.error('Non Recognized Role.', 'ERROR');
          }
        } else {
          if (response.title === "Compte bloqué") {
            this.alertService.error(response.message, "Blocked Account !");
          }
          if (response.title === "Login Failed") {
            this.alertService.error(response.message, "Failed to Connect !");
          }
          else {
            this.alertService.error(response.message, "Failed To Connect");
          }
        }
      },
      error: () => {
        this.alertService.error("Une erreur s'est produite lors de la tentative de connexion.", "Erreur");
      },
      complete: () => console.log("Connexion terminée"),
    });
  }
}
