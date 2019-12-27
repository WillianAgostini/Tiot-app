import { Component } from "@angular/core";

import { Platform, NavController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Pages } from "./interfaces/pages";
import { ApiService } from "./service/api.service";
import { Cordova } from "@ionic-native/core";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public appPages: Array<Pages>;

  User = {
    username: ""
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public api: ApiService
  ) {
    this.appPages = [
      {
        title: "Home",
        url: "/home-results",
        direct: "root",
        icon: "home"
      },
      {
        title: "About",
        url: "/about",
        direct: "forward",
        icon: "information-circle-outline"
      },

      {
        title: "App Settings",
        url: "/settings",
        direct: "forward",
        icon: "cog"
      }
    ];

    this.initializeApp();
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        if (Cordova) {
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        }
      })
      .catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward("edit-profile");
  }

  async logout() {
    await this.api.storage.clear();
    this.navCtrl.navigateRoot("/");
  }

  ionMenuClick() {
    this.api.getLocalUser().then(user => {
      this.User = user;
      console.log(user);
    });
  }
}
