import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import {IMqttMessage, IMqttServiceOptions, MqttModule} from 'ngx-mqtt';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
// Components
import {NotificationsComponent} from './components/notifications/notifications.component';
import {AddDevicePageModule} from './pages/add-device/add-device.module';
import {DeviceDetailModule} from './pages/device-detail/device-detail.module';
import {DevicesPageModule} from './pages/devices/devices.module';
// Modal Pages
import {ImagePageModule} from './pages/modal/image/image.module';
import {SearchFilterPageModule} from './pages/modal/search-filter/search-filter.module';
import {ApiService} from './service/api.service';

// export const MQTT_SERVICE_OPTIONS = {
//   hostname: '191.52.140.35',
//   port: 3001,
//   path: '',
// };

export const MQTT_SERVICE_OPTIONS = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '',
};


@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS), IonicModule.forRoot(),
    IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule,
    ImagePageModule, SearchFilterPageModule, DevicesPageModule,
    DeviceDetailModule, AddDevicePageModule
  ],
  entryComponents: [NotificationsComponent],
  providers: [
    StatusBar, SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, InAppBrowser,
    {provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
