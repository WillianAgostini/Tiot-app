import {DatePipe, formatDate} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Chart} from 'chart.js';
import {Packet} from 'src/app/models/packet';
import {ApiService} from 'src/app/service/api.service';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {
  @ViewChild('lineCanvas') lineCanvas: ElementRef;
  lineChart: Chart;

  firstDate: Date;
  lastDate: Date;

  name: any;
  packetList = new Array<Packet>();

  isLoading = false;

  constructor(
      private route: ActivatedRoute, private api: ApiService,
      public router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
      if (!this.name) this.router.navigate(['home-results']);

      this.update('24h');
    });
  }

  drawChart() {
    let pipe = new DatePipe('en-US');  // Use your own locale
    let labels =
        this.packetList.map(x => pipe.transform(x.createDate, 'dd/MM HH:mm'));
    let data = this.packetList.map(x => x.payload);
    this.firstDate = this.packetList[0].createDate;
    this.lastDate = this.packetList[this.packetList.length - 1].createDate;

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperaturas',
          data: data,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            display: false  // this will remove all the x-axis grid lines
          }]
        },
        legend: {display: false},
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        }
      }
    });

    this.isLoading = false;
  }


  update(days) {
    this.isLoading = true;
    this.lineChart = [];
    let dateParam;

    dateParam = this.getParamDays(days);


    let url = 'packet/' + this.name + '/' + dateParam;

    this.api.get(url).subscribe(packets => {
      this.packetList = packets.body as Array<Packet>;
      // this.packetList = this.packetList.reverse();
      console.log(this.packetList);
      this.drawChart();
    }, err => console.log(err))
  }

  getParamDays(days) {
    let now = new Date();

    switch (days) {
      case '24h':
        return 0;

      case '7d':
        now.setDate(now.getDate() - 7)
        return now.toISOString();

      case '1m':
        now.setMonth(now.getMonth() - 1)
        return now.toISOString();

      case '3m':
        now.setMonth(now.getMonth() - 3)
        return now.toISOString();

      case '6m':
        now.setMonth(now.getMonth() - 6)
        return now.toISOString();

      default:
        return 0;
    }
  }
}
