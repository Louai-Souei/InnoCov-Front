import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {User} from "../../../entity/User";
import {AlertService} from "../../../services/utils/alert/alert.service";
import {UserSharedService} from "../../../services/user/user-shared.service";
import {AuthenticationService} from "../../../services/auth/authentication/authentication.service";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  activeUser!: User;
  updatedUser!:User;
  update:boolean  = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private userSharedService: UserSharedService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.loadActiveUser();
  }

  loadActiveUser(): void {
    this.userService.getActiveUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.activeUser = response.data;
          // Créer une copie indépendante de activeUser
          this.updatedUser = { ...response.data };
          this.updatedUser.password = ''// Spread operator pour copier
        } else {
          console.error(response.message);
        }
      },
      error: (err) => console.error('Error fetching active user:', err)
    });
  }


  updateProfile(updatedUser: User): void {
    const formData = new FormData();
    formData.append('id', updatedUser.id.toString());
    formData.append('firstname', updatedUser.firstname);
    formData.append('lastname', updatedUser.lastname);
    formData.append('phone', updatedUser.phone || '');
    formData.append('email', updatedUser.email);
    if (updatedUser.password !== '')
      formData.append('password', updatedUser.password);
    else
      formData.append('password','');
    formData.append('role', updatedUser.role);
    formData.append('occupation', updatedUser.occupation || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateUserProfile(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.success('Profile successfully updated!');
          this.loadActiveUser();
          // this.userSharedService.updateActiveUser(updatedUser);
          console.log('Profile updated successfully:', response.message);
        } else {
          this.alertService.error('Profile update Failed! Please try again.');
          console.error('Failed to update profile:', response.message);
        }
      },
      error: (err) => console.error('Error updating profile:', err)
    });
    this.update = false;
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

}
