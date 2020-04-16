import {Query} from '@angular/compiler/src/core';
import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AlertController, LoadingController, MenuController, ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {Chart} from 'chart.js';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {Subscription} from 'rxjs';
import {Device} from 'src/app/models/device';
import {Packet} from 'src/app/models/packet';
import {ApiService} from 'src/app/service/api.service';

// Modals
import {SearchFilterPage} from '../../pages/modal/search-filter/search-filter.page';

// Call notifications test by Popover and Custom Component.
import {NotificationsComponent} from './../../components/notifications/notifications.component';
import {ImagePage} from './../modal/image/image.page';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage implements OnInit {
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';
  min = 0;
  max = 0;

  public message: string;
  public ListDevices = new Array<Device>();
  @ViewChildren('barChart') barChart: QueryList<ElementRef>;
  bars: any;
  colorArray: any;

  constructor(
      public navCtrl: NavController, public menuCtrl: MenuController,
      public popoverCtrl: PopoverController, public alertCtrl: AlertController,
      public modalCtrl: ModalController, public toastCtrl: ToastController,
      private api: ApiService, public _mqttService: MqttService,
      public loadingCtrl: LoadingController) {
    // this.api.delete("packet").subscribe(s => console.log(s), s =>
    // console.log(s))
  }

  ngOnInit() {}

  Save(device: Device) {
    console.log(device.name + '/action');
    let interval = {min: 5, max: 10};
    this._mqttService.publish(device.name + '/action', JSON.stringify(interval))
        .subscribe();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.barChart.changes.subscribe(() => this.createBarChart());

    this.api.get('devices').subscribe(devices => {
      this.ListDevices = devices.body as Array<Device>;
      console.log(this.ListDevices);
      this.StartWebSocket(this.ListDevices);
    }, err => {});
  }

  createBarChart() {
    let elements = this.barChart.toArray();
    if (elements.length == 0) return;

    elements.forEach((element, index) => {
      let device = this.ListDevices[index];
      this.api.get('packet/' + device.name + '/12').subscribe(packet => {
        let list = packet.body as Array<Packet>;
        console.log(list);

        var label =
            list.map(x => new Date(x.createDate).getMinutes().toString());
        var data = list.map(x => x.payload);
        this.DrawChart(element, label, data);
      }, err => {});
    });
  }


  private DrawChart(element: ElementRef<any>, label: string[], data: string[]) {
    this.bars = new Chart(element.nativeElement, {
      type: 'line',
      data: {
        labels: label,
        datasets: [{
          label: 'Viewers in millions',
          data: data,
        }]
      }
    });
  }

  StartWebSocket(devices: Array<Device>) {
    devices.forEach(element => {
      element.subscription =
          this._mqttService.observe(element.name)
              .subscribe((message: IMqttMessage) => {
                element.message = message.payload.toString();
                console.log(message.topic, message.payload.toString());
              });
      element.minSub =
          this._mqttService.observe(element.name + '/min')
              .subscribe((message: IMqttMessage) => {
                element.min = message.payload.toString();
                console.log(message.topic, message.payload.toString());
              });

      element.maxSub =
          this._mqttService.observe(element.name + '/max')
              .subscribe((message: IMqttMessage) => {
                element.max = message.payload.toString();
                console.log(message.topic, message.payload.toString());
              });
    })
  };

  ionViewWillLeave() {
    this.ListDevices.forEach(element => {
      element.subscription.unsubscribe();
    });
  }

  settings() {
    this.navCtrl.navigateForward('settings');
  }

  // async alertLocation() {
  //   const changeLocation = await this.alertCtrl.create({
  //     header: "Change Location",
  //     message: "Type your Address.",
  //     inputs: [
  //       {
  //         name: "location",
  //         placeholder: "Enter your new Location",
  //         type: "text"
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: "Cancel",
  //         handler: data => {
  //           console.log("Cancel clicked");
  //         }
  //       },
  //       {
  //         text: "Change",
  //         handler: async data => {
  //           console.log("Change clicked", data);
  //           this.yourLocation = data.location;
  //           const toast = await this.toastCtrl.create({
  //             message: "Location was change successfully",
  //             duration: 3000,
  //             position: "top",
  //             closeButtonText: "OK",
  //             showCloseButton: true
  //           });

  //           toast.present();
  //         }
  //       }
  //     ]
  //   });
  //   changeLocation.present();
  // }

  async searchFilter() {
    const modal = await this.modalCtrl.create({component: SearchFilterPage});
    return await modal.present();
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create(
        {component: ImagePage, componentProps: {value: image}});
    return await modal.present();
  }

  async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  async showMessage(message?: string) {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 2000,
      message: message ? message : 'Salvo!',
      translucent: true
    });
    await loading.present();
  }
}
