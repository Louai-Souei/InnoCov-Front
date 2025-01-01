import {Component, OnInit} from '@angular/core';
import {RoutesService} from "../../../services/routes/routes.service";
import {Route} from "../../../entity/Route";
import {Table} from 'primeng/table';
import {AlertService} from "../../../services/utils/alert/alert.service";
import {RouteBookingService} from "../../../services/route-booking/route-booking.service";
import {ApiResponse} from "../../../services/utils/models/ApiResponse";

@Component({
  selector: 'app-booked-routes',
  templateUrl: './booked-routes.component.html',
  styleUrl: './booked-routes.component.css'
})
export class BookedRoutesComponent implements OnInit {

  bookedRoutes: Route[] = [];
  selectedRoute!: Route | null;
  visible: boolean = false;
  loading: boolean = true;

  constructor(
    private routesService: RoutesService,
    private alertService: AlertService,
    private routeBookingService: RouteBookingService
  ) {
  }

  ngOnInit(): void {
    this.routeBookingService.getUserBookedRoutes().subscribe({
      next: (response: ApiResponse<Route[]>) => {
        this.bookedRoutes = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });


  }

  getSeverity(status: string) {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      default:
        return undefined; // Return undefined instead of null
    }
  }

  clear(table: Table) {
    table.clear();
  }

  viewDetails(route: Route) {
    this.selectedRoute = route;
    this.visible = true;
  }

  reserveRoute(route: any) {
    this.alertService.success('Doctor Data Edited Successfully', 'Done !');


  }

  addComplaint(passenger: { id: number; firstname: string; lastname: string }) {
    
  }

  fileComplaint(passenger: { id: number; firstname: string; lastname: string }) {
    
  }
}
