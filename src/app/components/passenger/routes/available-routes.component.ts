import {Component, OnInit} from '@angular/core';
import {RoutesService} from "../../../services/routes/routes.service";
import {Route} from "../../../entity/Route";
import {AlertService} from "../../../services/utils/alert/alert.service";

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
  ) {
  }

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

  reserveRoute(route: any) {
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
