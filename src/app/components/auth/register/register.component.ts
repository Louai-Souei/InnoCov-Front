import {Component, OnInit} from '@angular/core';
import {RegisterRequest} from "../../../util/RegisterRequest";
import {AuthenticationService} from "../../../services/auth/authentication/authentication.service";
import {Router} from "@angular/router";
import {AuthenticationResponse} from "../../../util/AuthenticationResponse";
import {Occupation} from "../../../entity/enums/Occupation";
import {Role} from "../../../entity/enums/Role";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerRequest: RegisterRequest = new RegisterRequest();
  roles: { label: string; value: string }[] = [];
  occupations: { label: string; value: string }[] = [];

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadOccupations();
  }

  private loadRoles(): void {
    this.roles = Object.keys(Role).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: Role[key as keyof typeof Role]
    }));
  }

  private loadOccupations(): void {
    this.occupations = Object.keys(Occupation).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: Occupation[key as keyof typeof Occupation]
    }));
  }

  registerUser(): void {
    this.authenticationService.register(this.registerRequest).subscribe({
      next: (data: AuthenticationResponse) => {
        this.authenticationService.setUserInformation(data)
        if (data.role == Role.DRIVER)
          this.router.navigate(['driver/tasks'])
        if (data.role == Role.PASSENGER)
          this.router.navigate(['passenger/tasks'])
        else
          this.router.navigate(['admin/tasks'])
      },
      error: () => console.log("error Login"),
      complete: () => console.log("complete")
    });
  }
}
