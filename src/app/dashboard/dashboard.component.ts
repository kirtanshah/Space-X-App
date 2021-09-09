import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { forkJoin } from '../../../node_modules/rxjs';
import * as Highcharts from 'highcharts/';
import { DatePipe } from '../../../node_modules/@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  highChartsObj: typeof Highcharts;
  barChartOptions: Highcharts.Options;
  upcomingCount: number;
  pastCount: number;
  allLaunchData: any;
  utcDate= [];

  constructor(private readonly apiService: ApiService, private readonly datePipe: DatePipe) {
    this.highChartsObj = Highcharts;
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  private setUpChartData() {
    const xdata = Object.keys(this.allLaunchData);
    const ydata = Object.values(this.allLaunchData);
    console.log(xdata);
    this.barChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Launch over time'
      },
      xAxis: {
        categories: xdata,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">Year - {point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
          '<td style="padding:0"><b>{point.y} - launch</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
          showInLegend: false,
        }
      },
      series: [{
        type: 'column',
        data: ydata,
        pointWidth: 20,
        pointPlacement: -0.15
      }],
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    };
  }

  private loadDashboardData() {
    forkJoin([
      this.apiService.getUpcomingCount(),
      this.apiService.getPastCount(),
      this.apiService.getAllLaunchesCount()
    ]
    ).subscribe(([upcomingLaunch, pastLaunch, allLaunchData]: any) => {
      this.upcomingCount = upcomingLaunch.length;
      this.pastCount = pastLaunch.filter(item => item.launch_success).length;
      const data = allLaunchData.map(item => item.launch_year);
      this.allLaunchData = data.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
      this.utcDate = allLaunchData.map(element => {
        return this.datePipe.transform(element.launch_date_utc, 'MMMM d, y');  
      });
      this.setUpChartData();
    })
  }
}
