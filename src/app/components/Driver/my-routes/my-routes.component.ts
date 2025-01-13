import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertService } from "../../../services/utils/alert/alert.service";

@Component({
  selector: 'app-my-routes',
  templateUrl: './my-routes.component.html',
  styleUrls: ['./my-routes.component.css'],
})
export class MyRoutesComponent implements OnInit {
  visible: boolean = false;
  routes: any[] = [];
  email: string = '';
  isEditMode: boolean = false;
  currentRoute: any = {
    id: null,
    departure: '',
    arrival: '',
    departureDate: '',
    numberOfPassengers: null,
  };

  constructor(private http: HttpClient, private alertService: AlertService) {}

  ngOnInit(): void {
    this.initializeEmail();
    this.fetchRoutes();
  }

  initializeEmail() {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.email = storedEmail;
    } else {
      console.warn('No email found in localStorage. Using default value.');
      this.email = 'default@example.com';
    }
  }

  fetchRoutes() {
    const url = `http://localhost:8081/api/route/driver-routes/${this.email}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.routes = data;
      },
      error: (err) => {
        console.error('Error fetching routes:', err);
        this.alertService.error('Error fetching routes');
      },
    });
  }

  showDialog(mode: 'add' | 'edit', route: any = null) {
    this.isEditMode = mode === 'edit';
    if (this.isEditMode && route) {
      this.currentRoute = { ...route };
    } else {
      this.currentRoute = {
        id: null,
        departure: '',
        arrival: '',
        departureDate: '',
        numberOfPassengers: null,
      };
    }
    this.visible = true;
  }

  addRoute() {
    const url = `http://localhost:8081/api/route/new-route`;
    this.http.post(url, this.currentRoute).subscribe({
      next: (data) => {
        this.fetchRoutes();
        this.alertService.success('Route added successfully');
      },
      error: (err) => {
        console.error('Error adding route:', err);
        this.alertService.error('Error adding route');
      },
    });
  }

  updateRoute() {
    const url = `http://localhost:8081/api/route/updateRoute/${this.currentRoute.id}`;
    console.log(this.currentRoute);
    this.http.put(url, this.currentRoute).subscribe({
      next: (data) => {
        this.fetchRoutes();
        this.alertService.success('Route updated successfully');
      },
      error: (err) => {
        console.error('Error updating route:', err);
        this.alertService.error('Error updating route');
      },
    });
  }

  deleteRoute(routeId: number) {
    // Show confirmation alert with SweetAlert2
    Swal.fire({
      title: 'Are you sure you want to remove this route?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms deletion
        const url = `http://localhost:8081/api/route/${routeId}`;
        this.http.delete(url).subscribe({
          next: (data) => {
            this.fetchRoutes(); // Refresh route list after deletion
            this.alertService.success('Route deleted successfully'); // Show success alert
          },
          error: (err) => {
            console.error('Error deleting route:', err);
            this.alertService.error('Error deleting route'); // Show error alert
          },
        });
      } else {
        // If user cancels
        this.alertService.info('Route deletion cancelled'); // Show info alert
      }
    });
  }

  formSubmitted: boolean = false;
  dateError: string = '';

  validateDateTime() {
    const selectedDate = new Date(this.currentRoute.departureDate);
    const now = new Date();

    if (selectedDate <= now) {
      this.dateError = 'Departure date and time must be in the future.';
    } else {
      this.dateError = '';
    }
  }

  isFormValid(): boolean {
    return (
      this.currentRoute.departure &&
      this.currentRoute.arrival &&
      this.currentRoute.departureDate &&
      this.currentRoute.numberOfPassengers >= 1 &&
      !this.dateError
    );
  }

  saveRoute() {
    this.formSubmitted = true;
    this.validateDateTime();

    if (this.isFormValid()) {
      if (this.isEditMode) {
        this.updateRoute();
      } else {
        this.addRoute();
      }
      this.visible = false;
    }
  }
}
