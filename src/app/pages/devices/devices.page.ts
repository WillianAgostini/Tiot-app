import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ApiService} from 'src/app/service/api.service';

import {AddDevicePage} from '../add-device/add-device.page';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss']
})
export class DevicesPage implements OnInit {
  devices = [];

  constructor(public api: ApiService, public modalCtrl: ModalController) {}

  ngOnInit() {
    this.GetDevices();
  }

  GetDevices() {
    this.api.get('devices').subscribe(devices => {
      this.devices = devices.body as any;
      console.log(devices);
    }, err => {});
  }

  deleteDevice(id) {
    console.log(id);
    this.api.delete('devices/' + id)
        .subscribe(
            (s) => {
              console.log(s);
            },
            err => {
              console.log(err);
            },
            () => this.GetDevices());
  }

  async newDevice() {
    const modal = await this.modalCtrl.create({component: AddDevicePage});
    await modal.present();
    await modal.onWillDismiss();
    this.ngOnInit();
  }

  ionModalWillDismiss() {
    console.log('exit');
  }
}
