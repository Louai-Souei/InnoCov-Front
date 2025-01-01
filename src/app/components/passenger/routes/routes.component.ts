import {Component, OnInit} from '@angular/core';
import {RoutesService} from "../../../services/routes/routes.service";
import {Route} from "../../../entity/Route";
import {Table} from 'primeng/table';
import {AlertService} from "../../../services/utils/alert/alert.service";
import {RouteBookingService} from "../../../services/route-booking/route-booking.service";

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  routes: Route[] = [];
  selectedRoute!: Route | null;
  visible: boolean = false;
  loading: boolean = true;

  constructor(
    private routesService: RoutesService,
    private alertService: AlertService,
    private routeBookingService: RouteBookingService
  ) {
  }

  ngOnInit() {
    this.routesService.getAvailableRoutes().subscribe({
      next: (routes) => {
        this.routes = routes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.routeBookingService.getUserBookedRoutes().subscribe({
      next: (data) => {
        console.log("----------------------", data)
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

  filterRemainingSeats(selectedSeats: number | null) {
    if (selectedSeats !== null) {
      this.routes = this.routes.filter(route => route.remainingSeats === selectedSeats);
    } else {
      this.routesService.getAvailableRoutes().subscribe({
        next: (routes) => {
          this.routes = routes;
        },
        error: () => {
        }
      });
    }
  }

  reserveRoute(route: any) {
    this.alertService.success('Doctor Data Edited Successfully', 'Done !');


  }
}
