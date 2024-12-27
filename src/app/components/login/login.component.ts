import { Component } from '@angular/core';
import {AuthenticationRequest} from "../../util/AuthenticationRequest";
import {AuthenticationService} from "../../services/auth/authentification-service/authentication.service";
import { Router} from "@angular/router";
import {AuthenticationResponse} from "../../util/AuthenticationResponse";

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


  loginUser() : void {
    this.authenticationService.login(this.loginRequest).subscribe({
      next: (data : AuthenticationResponse) => {
        this.authenticationService.setToken(data.access_token)
        this.router.navigate(['tasks'])
      },
      error: () => console.log("error Login"),
      complete: () => console.log("complete")
    })
  }

}
