import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

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

  saveRoute() {
    if (this.isEditMode) {
      this.updateRoute();
    } else {
      this.addRoute();
    }
    this.visible = false;
  }

  addRoute() {
    const url = `http://localhost:8081/api/route/new-route`;
    this.http.post(url, this.currentRoute).subscribe({
      next: (data) => {
        this.fetchRoutes();
      },
      error: (err) => {
        console.error('Error adding route:', err);
      },
    });
  }

  updateRoute() {
    const url = `http://localhost:8081/api/route/updateRoute/${this.currentRoute.id}`;
    console.log(this.currentRoute)
    this.http.put(url, this.currentRoute).subscribe({
      next: (data) => {
        this.fetchRoutes();
      },
      error: (err) => {
        console.error('Error updating route:', err);
      },
    });
  }
  deleteRoute(routeId: number) {
    const url = `http://localhost:8081/api/route/${routeId}`;
    this.http.delete(url).subscribe({
      next: (data) => {
        this.fetchRoutes();  // Rafraîchir la liste des routes après suppression
      },
      error: (err) => {
        console.error('Error deleting route:', err);
      },
    });
  }
}
