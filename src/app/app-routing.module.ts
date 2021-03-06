import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './pages/login/login.module#LoginPageModule'}, {
    path: 'register',
    loadChildren: './pages/register/register.module#RegisterPageModule'
  },
  {path: 'about', loadChildren: './pages/about/about.module#AboutPageModule'}, {
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsPageModule'
  },
  {
    path: 'edit-profile',
    loadChildren:
        './pages/edit-profile/edit-profile.module#EditProfilePageModule'
  },
  {
    path: 'home-results',
    loadChildren:
        './pages/home-results/home-results.module#HomeResultsPageModule'
  },
  {
    path: 'devices',
    loadChildren: './pages/devices/devices.module#DevicesPageModule'
  },
  {
    path: 'add-device',
    loadChildren: './pages/add-device/add-device.module#AddDevicePageModule'
  },
  {
    path: 'device-detail',
    loadChildren:
        './pages/device-detail/device-detail.module#DeviceDetailModule'
  },
  {
    path: '**',
    loadChildren:
        './pages/home-results/home-results.module#HomeResultsPageModule'
  }
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})

export class AppRoutingModule {
}
