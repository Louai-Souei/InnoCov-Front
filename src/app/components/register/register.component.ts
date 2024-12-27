import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from "../../util/RegisterRequest";
import { AuthenticationService } from "../../services/auth/authentification-service/authentication.service";
import { Router } from "@angular/router";
import { AuthenticationResponse } from "../../util/AuthenticationResponse";
import { UserRole } from "../../entity/enums/UserRole";
import { Role } from "../../entity/enums/Role";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerRequest: RegisterRequest = new RegisterRequest();
  userRoles: { label: string; value: string }[] = [];
  roles: { label: string; value: string }[] = [];

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadUserRoles();
    this.loadRoles();
  }

  private loadUserRoles(): void {
    this.userRoles = Object.keys(UserRole).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: UserRole[key as keyof typeof UserRole]
    }));
  }

  private loadRoles(): void {
    this.roles = Object.keys(Role).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: Role[key as keyof typeof Role]
    }));
  }

  registerUser(): void {
    this.authenticationService.register(this.registerRequest).subscribe({
      next: (data: AuthenticationResponse) => {
        this.authenticationService.setToken(data.access_token);
        this.router.navigate(['user/tasks']);
      },
      error: () => console.log("error Login"),
      complete: () => console.log("complete")
    });
  }
}
