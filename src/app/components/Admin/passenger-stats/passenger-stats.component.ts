import {Component, OnInit} from '@angular/core';
import {ApiResponse} from "../../../services/utils/models/ApiResponse";
import * as Highcharts from 'highcharts';
import {RouteBookingService} from "../../../services/route-booking/route-booking.service";

@Component({
  selector: 'app-passenger-stats',
  templateUrl: './passenger-stats.component.html',
  styleUrl: './passenger-stats.component.css'
})
export class PassengerStatsComponent implements OnInit {
  public passengersStats: Map<string, number> = new Map();
  public routesStats: Map<string, number> = new Map();
  Highcharts: typeof Highcharts = Highcharts;
  columnChartOptions: Highcharts.Options = {};
  pieChartOptions: Highcharts.Options = {};

  constructor(private routeBookingService: RouteBookingService) {}

  ngOnInit(): void {
    this.getPassengerStatsForLast4Weeks();
    this.getRouteStatsForLast4Weeks();
  }

  getPassengerStatsForLast4Weeks(): void {
    this.routeBookingService.getPassengersReservedRoutesStatsForLast4Weeks().subscribe((response: ApiResponse<Map<string, number>>) => {
      if (response.success) {
        this.passengersStats = response.data;
        console.log('passenger Stats:', this.passengersStats);
        this.initializeColumnChart();
      } else {
        console.error('Error fetching passenger stats:', response.message);
      }
    });
  }

  getRouteStatsForLast4Weeks(): void {
    this.routeBookingService.getRouteBookingsCreationStatsForLast4Weeks().subscribe((response: ApiResponse<Map<string, number>>) => {
      if (response.success) {
        this.routesStats = response.data;
        console.log('Route Stats:', this.routesStats);
        this.initializePieChart();
      } else {
        console.error('Error fetching route stats:', response.message);
      }
    });
  }

  initializeColumnChart(): void {
    const categories: string[] = Object.keys(this.passengersStats);
    const data: number[] = Object.values(this.passengersStats);

    this.columnChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'passenger Creation Stats (Column Chart)'
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Weeks'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of passengers'
        }
      },
      series: [{
        name: 'passengers',
        data: data
      }] as Highcharts.SeriesOptionsType[],
      credits: {
        enabled: false
      }
    };
  }

  initializePieChart(): void {
    const categories: string[] = Object.keys(this.routesStats);
    const data: number[] = Object.values(this.routesStats);

    this.pieChartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Route Creation Stats (Pie Chart)'
      },
      tooltip: {
        pointFormatter: function () {
          const point = this as Highcharts.Point;
          const recordNumber = this.series.data.indexOf(this) + 1;
          return `Week ${recordNumber}: ${point.y} routes (${point.percentage!.toFixed(1)}%)`;
        }
      },
      series: [{
        name: 'Routes',
        data: categories.map((category: string, index: number) => ({
          name: category,
          y: data[index]
        }))
      }] as Highcharts.SeriesOptionsType[],
      credits: {
        enabled: false
      }
    };
  }

}
