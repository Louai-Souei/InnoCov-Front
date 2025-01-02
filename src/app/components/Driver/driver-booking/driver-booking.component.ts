import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-driver-booking',
  templateUrl: './driver-booking.component.html',
  styleUrls: ['./driver-booking.component.css']
})
export class DriverBookingComponent implements OnInit {
  email: string = '';
  routes: any[] = [];
  selectedRoute: any = null;
  bookings: any[] = [];

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

  fetchBookingsByRoute(routeId: number) {
    const url = `http://localhost:8081/api/route-booking/by-route/${routeId}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        console.log(data);
        this.bookings = data;

      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
      },
    });
  }

  updateBookingStatus(bookingId: number, status: string) {
    const url = `http://localhost:8081/api/route-booking/${bookingId}/${status}`;
    this.http.put(url, {}).subscribe({
      next: () => {
        if (this.selectedRoute) {
          this.fetchBookingsByRoute(this.selectedRoute.id); // Refresh bookings for the selected route
        }
      },
      error: (err) => {
        console.error(`Error updating booking status to ${status}:`, err);
      },
    });
  }

  acceptBooking(bookingId: number) {
    this.updateBookingStatus(bookingId, 'accept');
  }

  rejectBooking(bookingId: number) {
    this.updateBookingStatus(bookingId, 'reject');
  }

  selectRoute(route: any) {
    this.selectedRoute = route;
    this.fetchBookingsByRoute(route.id);
  }
}
