import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {User} from "../../../entity/User";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  activeUser!: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadActiveUser();
  }

  loadActiveUser(): void {
    this.userService.getActiveUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.activeUser = response.data;
        } else {
          console.error(response.message);
        }
      },
      error: (err) => console.error('Error fetching active user:', err)
    });
  }

  updateProfile(updatedUser: User): void {
    this.userService.updateUserProfile(updatedUser).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Profile updated successfully:', response.message);
        } else {
          console.error('Failed to update profile:', response.message);
        }
      },
      error: (err) => console.error('Error updating profile:', err)
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
