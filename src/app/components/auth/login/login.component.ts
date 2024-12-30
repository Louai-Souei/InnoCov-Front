import {Component} from '@angular/core';
import {AuthenticationRequest} from "../../../util/AuthenticationRequest";
import {AuthenticationService} from "../../../services/auth/authentification-service/authentication.service";
import {Router} from "@angular/router";
import {AuthenticationResponse} from "../../../util/AuthenticationResponse";
import {Role} from "../../../entity/enums/Role";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginRequest: AuthenticationRequest = new AuthenticationRequest();

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }


  loginUser(): void {
    this.authenticationService.login(this.loginRequest).subscribe({
      next: (data: AuthenticationResponse) => {
        this.authenticationService.setUserInformations(data)
        if (data.role == Role.DRIVER)
          this.router.navigate(['driver/tasks'])
        if (data.role == Role.PASSENGER)
          this.router.navigate(['passenger/tasks'])
        if (data.role == Role.ADMIN)
          this.router.navigate(['admin/tasks'])
      },
      error: () => console.log("error Login"),
      complete: () => console.log("complete")
    })
  }

}
