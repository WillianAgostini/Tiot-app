import {Component} from '@angular/core';
import {Cordova} from '@ionic-native/core';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NavController, Platform} from '@ionic/angular';

import {Pages} from './interfaces/pages';
import {ApiService} from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public appPages: Array<Pages>;

  fullName = '';

  constructor(
      private platform: Platform, private splashScreen: SplashScreen,
      private statusBar: StatusBar, public navCtrl: NavController,
      public api: ApiService) {
    this.appPages = [
      {title: 'Home', url: '/home-results', direct: 'root', icon: 'home'},
      // {
      //   title: 'App Settings',
      //   url: '/settings',
      //   direct: 'forward',
      //   icon: 'cog'
      // },
      {title: 'Devices', url: '/devices', direct: 'forward', icon: 'beer'},
      // {
      //   title: 'About',
      //   url: '/about',
      //   direct: 'forward',
      //   icon: 'information-circle-outline'
      // }
    ];

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready()
        .then(() => {
          if (Cordova) {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
          }
        })
        .catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  async logout() {
    await this.api.storage.clear();

    this.navCtrl.navigateRoot('/');
  }

  ionMenuClick() {
    this.api.getLocalUser().then(user => {
      this.fullName = user.fullName;
    });
  }
}
