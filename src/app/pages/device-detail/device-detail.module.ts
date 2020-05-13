import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';

import {DeviceDetailComponent} from './device-detail.component';

const routes: Routes = [{path: '', component: DeviceDetailComponent}];

@NgModule({
  imports:
      [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [DeviceDetailComponent]
})
export class DeviceDetailModule {
}
