import { Component, OnInit } from '@angular/core';
import { RoutesService } from "../../../services/routes/routes.service";
import { ApiResponse } from "../../../services/utils/models/ApiResponse";
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-driver-stats',
  templateUrl: './driver-stats.component.html',
  styleUrl: './driver-stats.component.css'
})
export class DriverStatsComponent implements OnInit {
  public driversStats: Map<string, number> = new Map();
  public routesStats: Map<string, number> = new Map();
  Highcharts: typeof Highcharts = Highcharts;
  columnChartOptions: Highcharts.Options = {};
  pieChartOptions: Highcharts.Options = {};

  constructor(private routesService: RoutesService) {}

  ngOnInit(): void {
    this.getDriverStatsForLast4Weeks();
    this.getRouteStatsForLast4Weeks();
  }

  getDriverStatsForLast4Weeks(): void {
    this.routesService.getDriverCreatedRoutesStatsForLast4Weeks().subscribe((response: ApiResponse<Map<string, number>>) => {
      if (response.success) {
        this.driversStats = response.data;
        console.log('Driver Stats:', this.driversStats);
        this.initializeColumnChart();
      } else {
        console.error('Error fetching driver stats:', response.message);
      }
    });
  }

  getRouteStatsForLast4Weeks(): void {
    this.routesService.getRouteCreationStatsForLast4Weeks().subscribe((response: ApiResponse<Map<string, number>>) => {
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
    const categories: string[] = Object.keys(this.driversStats);
    const data: number[] = Object.values(this.driversStats);

    this.columnChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Driver Creation Stats (Column Chart)'
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
          text: 'Number of Drivers'
        }
      },
      series: [{
        name: 'Drivers',
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
          return  point.y + ' routes (' + point.percentage!.toFixed(1) + '%)';
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
