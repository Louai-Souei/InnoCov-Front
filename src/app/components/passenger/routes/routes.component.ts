import { Component, OnInit, ViewChild } from '@angular/core';
import { RoutesService } from "../../../services/routes/routes.service";
import { Route } from "../../../entity/Route";
import { Table } from 'primeng/table';

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

  // Options for remaining seats
  remainingSeatsOptions: any[] = [
    { label: '1 Seat', value: 1 },
    { label: '2 Seats', value: 2 },
    { label: '3 Seats', value: 3 },
    { label: '4 Seats', value: 4 }
  ];

  // Selected value for remaining seats filter
  selectedSeats: number | null = null;

  constructor(private routesService: RoutesService) {}

  ngOnInit() {
    this.routesService.getAvailableRoutes().subscribe({
      next: (routes) => {
        this.routes = routes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Handle error
      }
    });
  }

  // Function to determine severity for tags
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

  // Clear the table filter
  clear(table: Table) {
    table.clear();
  }

  // View details for a specific route
  viewDetails(route: Route) {
    this.selectedRoute = route; // Set the selected route to show details
    this.visible = true; // Show the dialog
  }

  // Handle filtering for remaining seats
  filterRemainingSeats(selectedSeats: number | null) {
    if (selectedSeats !== null) {
      this.routes = this.routes.filter(route => route.remainingSeats === selectedSeats);
    } else {
      // If no value is selected, reload the routes (or keep the initial set)
      this.routesService.getAvailableRoutes().subscribe({
        next: (routes) => {
          this.routes = routes;
        },
        error: () => {
          // Handle error
        }
      });
    }
  }

  reserveRoute(route: any) {
    
  }
}
