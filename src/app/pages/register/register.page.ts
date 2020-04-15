import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingController, MenuController, NavController} from '@ionic/angular';
import {ApiService} from 'src/app/service/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  constructor(
      public navCtrl: NavController, public menuCtrl: MenuController,
      public loadingCtrl: LoadingController, private formBuilder: FormBuilder,
      private api: ApiService) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      fullName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  async signUp() {
    const loader = await this.loadingCtrl.create({duration: 5000});
    loader.present();

    let fullName = this.onRegisterForm.value.fullName;
    let email = this.onRegisterForm.value.email;
    let password = this.onRegisterForm.value.password;

    this.api.signup(email, password, fullName)
        .subscribe(
            data => {
              console.log(data);
              this.api.me().subscribe(
                  data => {
                    console.log(data);
                    this.goToHome();
                  },
                  err => {
                    console.log(err);
                    this.showError();
                  });
            },
            err => {
              console.warn(err);
              this.showError();
            },
            () => loader.dismiss());
  }

  // // //

  async showError() {
    const loading = await this.loadingCtrl.create(
        {spinner: null, duration: 2000, message: 'Ops!', translucent: true});
    await loading.present();
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home-results');
  }
}
