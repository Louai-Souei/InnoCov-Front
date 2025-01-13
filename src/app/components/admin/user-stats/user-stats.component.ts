import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ApiResponse } from "../../../services/utils/models/ApiResponse";
import { UserService } from "../../../services/user/user.service";

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  public userStats: Map<string, number> = new Map();
  public activeUserStats: Map<string, number> = new Map();
  Highcharts: typeof Highcharts = Highcharts;
  columnChartOptions: Highcharts.Options = {};
  pieChartOptions: Highcharts.Options = {};
  activeUsersBarChartOptions: Highcharts.Options = {}; // Nouveau graphique

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserStatsForLast4Weeks();
    this.getActiveUsersStatsForLast4Weeks(); // Appel de la méthode pour le 3e graphique
  }

  getUserStatsForLast4Weeks(): void {
    this.userService.getUserCreationStatsForLast4Weeks().subscribe((response: ApiResponse<Map<string, number>>) => {
      if (response.success) {
        this.userStats = response.data;
        this.initializeColumnChart();
        this.initializePieChart();
      } else {
        console.error('Error fetching user stats:', response.message);
      }
    });
  }

  getActiveUsersStatsForLast4Weeks(): void {
    this.userService.getActiveUsersStatsForLast4Weeks().subscribe((response: ApiResponse<Map<string, number>>) => {
      if (response.success) {
        this.activeUserStats = response.data;
        this.initializeActiveUsersBarChart(); // Initialisation avec le nouveau graphique
      } else {
        console.error('Error fetching active user stats:', response.message);
      }
    });
  }


  initializeColumnChart(): void {
    const categories: string[] = Object.keys(this.userStats);
    const data: number[] = Object.values(this.userStats);

    this.columnChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'User Creation Stats (Column Chart)'
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
          text: 'Number of Users'
        }
      },
      series: [{
        name: 'New Users',
        data: data
      }] as Highcharts.SeriesOptionsType[],
      credits: {
        enabled: false
      }
    };
  }

  initializePieChart(): void {
    const categories: string[] = Object.keys(this.userStats);
    const data: number[] = Object.values(this.userStats);

    this.pieChartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'User Creation Stats (Pie Chart)'
      },
      tooltip: {
        pointFormatter: function () {
          const point = this as Highcharts.Point;
          const recordNumber = this.series.data.indexOf(this) + 1;
          return `Week ${recordNumber}: ${point.y} New Users (${point.percentage!.toFixed(1)}%)`;
        }
      },
      series: [{
        name: 'New Users',
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

  initializeActiveUsersBarChart(): void {
    const categories: string[] = Object.keys(this.activeUserStats);
    const data: number[] = Object.values(this.activeUserStats);
    const threshold = 5; // Définir la valeur limite

    this.activeUsersBarChartOptions = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Active Users Stats (Bar Chart)'
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
          text: 'Active Users Count'
        },
        plotLines: [ // Ligne de limite
          {
            value: threshold,
            color: 'blue',
            width: 2,
            dashStyle: 'Dash',
            label: {
              text: `Limit: ${threshold}`,
              align: 'center',
              style: {
                color: 'blue'
              }
            }
          }
        ]
      },
      series: [{
        name: 'Active Users',
        data: data,
        zones: [ // Définir les couleurs selon la limite
          {
            value: threshold, // Valeurs inférieures à la limite
            color: 'red'
          },
          {
            color: 'green' // Valeurs supérieures ou égales à la limite
          }
        ]
      }] as Highcharts.SeriesOptionsType[],
      credits: {
        enabled: false
      }
    };
  }


}
