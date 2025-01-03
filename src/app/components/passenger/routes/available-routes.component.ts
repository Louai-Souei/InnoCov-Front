import { Component, OnInit } from '@angular/core';
import { RoutesService } from "../../../services/routes/routes.service";
import { Route } from "../../../entity/Route";
import { AlertService } from "../../../services/utils/alert/alert.service";
import { ApiResponse } from "../../../services/utils/models/ApiResponse";
import {RouteBookingService} from "../../../services/route-booking/route-booking.service";

@Component({
  selector: 'app-routes',
  templateUrl: './available-routes.component.html',
  styleUrls: ['./available-routes.component.css']
})
export class AvailableRoutesComponent implements OnInit {

  routes: Route[] = [];
  selectedRoute!: Route | null;
  visible: boolean = false;
  loading: boolean = true;
  selectedDate: Date | null = null;

  constructor(
    private routesService: RoutesService,
    private alertService: AlertService,
    private routeBookingService: RouteBookingService
  ) {}

  ngOnInit() {
    this.loadAvailableRoutes();
  }

  loadAvailableRoutes() {
    this.routesService.getAvailableRoutes(this.selectedDate).subscribe({
      next: (routes) => {
        this.routes = routes;
        this.routes.forEach((route) => {
          route.driverName = `${route.driver.firstname} ${route.driver.lastname}`.toLowerCase();
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewDetails(route: Route) {
    this.selectedRoute = route;
    this.visible = true;
  }

  reserveRoute(route: Route) {
    if (route) {
      this.routeBookingService.addBooking(route.id).subscribe({
        next: (response: ApiResponse<string>) => {
          if (response.success) {
            this.alertService.success('Booking successfully added!');
            this.loadAvailableRoutes();
          } else {
            this.alertService.error('Booking failed! Please try again.');
          }
        },
        error: () => {
          this.alertService.error('An error occurred while making the booking!');
        }
      });
    }
  }

  onFilterDateChange($event: any) {
    this.selectedDate = $event;
    this.loadAvailableRoutes();
  }

  clearDate() {
    this.selectedDate = null;
    this.onFilterDateChange(null);
  }
}
