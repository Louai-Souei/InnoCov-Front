import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-driver-booking',
  templateUrl: './driver-booking.component.html',
  styleUrls: ['./driver-booking.component.css']
})
export class DriverBookingComponent implements OnInit {
  email: string = '';
  selectedRoute: any = null;
  bookings: any[] = [];
  visible: boolean = false;
  private dt2: any;
  routes: any = null;
  loading: boolean = true;
  displayBookingDialog = false;
  displayBookingConfirmedDialog: boolean =false
  selectedRouteBookingsRequests :any;
  selectedRouteBookingsConfirmed :any;

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
        // Add a booking count to each route
        this.routes = data.map( route => {
          // Count the number of pending bookings for each route
          this.fetchBookingsByRoute(route.id);
          route.bookingCount = route.passengers ? route.passengers.length : 0;
          console.log(route)
          return route;

        });
        console.log(this.routes);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching routes:', err);
        this.loading = false;
      },
    });
  }

// Method to get the number of pending bookings for a specific route

  getBookingCountForRoute(routeId: number): number {
    const bookingsForRoute = this.bookings;
    console.log(bookingsForRoute.length);
    return bookingsForRoute.length;
  }

  fetchBookingsByRoute(routeId: number) {
    const url = `http://localhost:8081/api/route-booking/by-route/${routeId}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Filter bookings with status 'pending' and route.id == routeId
        this.selectedRouteBookingsRequests = data.filter(booking => booking.status === 'default' && booking.route.id === routeId);
        this.selectedRouteBookingsConfirmed = data.filter(booking => booking.status === 'accepted' && booking.route.id === routeId);
        console.log(this.bookings);

      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
      },
    });
  }


  updateBookingStatus(bookingId: any, status: string) {
    const url = `http://localhost:8081/api/route-booking/${bookingId.id}/${status}`;
    this.http.put(url, {}).subscribe({
      next: () => {
        // Refresh the bookings for the selected route
        if (bookingId) {
          this.fetchBookingsByRoute(bookingId.route.id); // Refresh bookings
        }
        this.fetchRoutes()
      },
      error: (err) => {
        console.error(`Error updating booking status to ${status}:`, err);
      },
    });
  }

  acceptBooking(bookingId: any) {
    this.updateBookingStatus(bookingId, 'accept');
  }

  rejectBooking(bookingId: any) {
    this.updateBookingStatus(bookingId, 'reject');

  }



  async viewBookings(route: any) {
    // Fetch bookings for the selected route
    await this.fetchBookingsByRoute(route.id);

    console.log(this.selectedRouteBookingsRequests);
    this.displayBookingDialog = true;
  }
  async viewBookingsConfirmed(route: any) {
    // Fetch bookings for the selected route
    await this.fetchBookingsByRoute(route.id);

    console.log(this.selectedRouteBookingsRequests);
    this.displayBookingConfirmedDialog = true;
  }

  closeDialog() {
    this.displayBookingDialog = false;
  }
  closeDialogConfirmed() {
    this.displayBookingConfirmedDialog = false;
  }

  onFilterDateChange($event: any) {
    this.routes = $event;
    this.fetchRoutes();
  }

  clearDate() {
    this.routes = null;
    this.onFilterDateChange(null);
  }
}
