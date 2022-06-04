import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexNonAxisChartSeries, ApexPlotOptions, ApexChart, ChartComponent, ApexFill, ApexDataLabels } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: any[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  dataLabels: ApexDataLabels
};

@Component({
  selector: 'app-win-rate',
  templateUrl: './win-rate.component.html',
  styleUrls: ['./win-rate.component.css']
})
export class WinRateComponent implements OnInit {

  public chartOptions: Partial<ChartOptions>;
  @ViewChild('chart') chart?: ChartComponent;

  constructor() {
    this.chartOptions = {
      series: [0],
      chart: {
        height: 200,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: '24px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.87)',
              offsetY: -8,
            },
            value: {
              show: false
            }
          }
        }
      },
      labels: [['0', 'played']],
      fill: {
        colors: ['#F44336', '#E91E63']
      }
    };
  }

  ngOnInit(): void {
  }

}
