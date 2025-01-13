import {Component, OnInit} from '@angular/core';
import {RegisterRequest} from "../../../util/RegisterRequest";
import {AuthenticationService} from "../../../services/auth/authentication/authentication.service";
import {Router} from "@angular/router";
import {Occupation} from "../../../entity/enums/Occupation";
import {Role} from "../../../entity/enums/Role";
import {AlertService} from "../../../services/utils/alert/alert.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerRequest: RegisterRequest = new RegisterRequest();
  roles: { label: string; value: string }[] = [];
  occupations: { label: string; value: string }[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService,
    ) {
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadOccupations();
  }

  private loadRoles(): void {
    this.roles = Object.keys(Role)
      .filter(key => key !== "ADMIN")
      .map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value: Role[key as keyof typeof Role]
      }));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private loadOccupations(): void {
    this.occupations = Object.keys(Occupation).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: Occupation[key as keyof typeof Occupation]
    }));
  }

  registerUser(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append("firstname", this.registerRequest.firstname);
      formData.append("lastname", this.registerRequest.lastname);
      formData.append("phone", this.registerRequest.phone);
      formData.append("email", this.registerRequest.email);
      formData.append("password", this.registerRequest.password);
      formData.append("role", this.registerRequest.role);
      formData.append("occupation", this.registerRequest.occupation);
      formData.append("image", this.selectedFile, this.selectedFile.name);

      this.authenticationService.register(formData).subscribe({
        next: (response): void => {
          if (response.success) {
            this.alertService.success(response.message, response.title || "Succès");
            this.authenticationService.setUserInformation(response.data);
            switch (response.data.role) {
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
                break;
            }
          } else {
            this.alertService.warning(response.message, response.title || "Warning");
          }
        },
        error: (error): void => {
          this.alertService.error(
            "An error occurred during registration.",
            error.error?.title || "Warning"
          );
        },
        complete: (): void => console.log("Registration process completed."),
      });
    } else {
      this.alertService.warning(
        "Please upload an image to complete the registration.",
        "Warning"
      );
    }
  }


}
