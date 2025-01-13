import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {AlertService} from "../../../services/utils/alert/alert.service";

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
  displayBookingConfirmedDialog: boolean = false;
  selectedRouteBookingsRequests: any;
  selectedRouteBookingsConfirmed: any;

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
        this.routes = data.map(route => {
          this.fetchBookingsByRoute(route.id);
          route.bookingCount = route.passengers ? route.passengers.length : 0;
          return route;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching routes:', err);
        this.loading = false;
        this.alertService.error('Failed to fetch routes.');
      },
    });
  }

  getBookingCountForRoute(routeId: number): number {
    const bookingsForRoute = this.bookings;
    return bookingsForRoute.length;
  }

  fetchBookingsByRoute(routeId: number) {
    const url = `http://localhost:8081/api/route-booking/by-route/${routeId}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.selectedRouteBookingsRequests = data.filter(booking => booking.status === 'default' && booking.route.id === routeId);
        this.selectedRouteBookingsConfirmed = data.filter(booking => booking.status === 'accepted' && booking.route.id === routeId);
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.alertService.error('Failed to fetch bookings.');
      },
    });
  }

  updateBookingStatus(bookingId: any, status: string) {
    const url = `http://localhost:8081/api/route-booking/${bookingId.id}/${status}`;
    this.http.put<any>(url, {}).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.success(response.message || `Booking status updated to ${status}.`);
          if (bookingId) {
            this.fetchBookingsByRoute(bookingId.route.id);
          }
          this.fetchRoutes();
        } else {
          this.alertService.warning(response.message || 'Failed to update booking status.');
        }
      },
      error: (err) => {
        console.error(`Error updating booking status to ${status}:`, err);
        this.alertService.error(`An error occurred while updating booking status to ${status}.`);
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
    await this.fetchBookingsByRoute(route.id);
    this.displayBookingDialog = true;
  }

  async viewBookingsConfirmed(route: any) {
    await this.fetchBookingsByRoute(route.id);
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
