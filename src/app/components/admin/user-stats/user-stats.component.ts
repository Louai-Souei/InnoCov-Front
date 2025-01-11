import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ApiResponse} from "../../../services/utils/models/ApiResponse";
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  public userStats: any;
  Highcharts: typeof Highcharts = Highcharts;
  columnChartOptions: Highcharts.Options = {};
  pieChartOptions: Highcharts.Options = {};

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUserStatsForLast4Weeks();
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
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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

}
