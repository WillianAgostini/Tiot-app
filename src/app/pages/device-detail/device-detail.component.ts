import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Packet} from 'src/app/models/packet';
import {ApiService} from 'src/app/service/api.service';


@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {
  name: any;
  packetList = new Array<any>();

  interval = 60;

  constructor(
      private route: ActivatedRoute, private api: ApiService,
      public router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
      if (!this.name) this.router.navigate(['home-results']);

      this.getPackets();
    });
  }

  getPackets() {
    let url = 'packet/' + this.name
    if (this.interval) url += '/' + this.interval;

    this.api.get(url).subscribe(packets => {
      this.packetList = packets.body as Array<Packet>;
      console.log(this.packetList);
    }, err => console.log(err))
  }

  setLimit(value) {
    this.interval = value;
  }
}
