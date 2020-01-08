import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.page.html',
  styleUrls: ['./add-device.page.scss']
})
export class AddDevicePage implements OnInit {
  name: string;

  constructor(
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public api: ApiService
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async createDevice() {
    const loading = await this.loadingCtrl.create({
      duration: 5000,
      translucent: true
    });

    await loading.present();

    this.api.post('devices', { name: this.name }).subscribe(
      async success => {
        console.log(success);
        await this.showMessage('Dispositivo Criado');
        this.closeModal();
      },
      err => {
        console.log(err);
        this.showMessage(err);
      },
      () => {
        loading.dismiss();
      }
    );
  }

  async showMessage(message?) {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 2000,
      message: message ? message : 'Ops!',
      translucent: true
    });
    await loading.present();
  }
}
