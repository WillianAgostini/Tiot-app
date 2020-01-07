import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private iab: InAppBrowser
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.api.hasUser().then(value => {
      if (value) this.goToHome();
    });
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.onLoginForm.setValue({ email: 'eu@gmail.com', password: '123456' });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // // //

  async login() {
    const loading = await this.loadingCtrl.create({
      duration: 5000,
      translucent: true
    });
    await loading.present();

    let email = this.onLoginForm.value.email;
    let password = this.onLoginForm.value.password;

    this.api.login(email, password).subscribe(
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
          }
        );
      },
      err => {
        console.warn(err);
        this.showError();
      },
      () => loading.dismiss()
    );
  }

  loginFB() {
    // const browser = this.iab.create("https://ionicframework.com/", "_system");
    // browser.on("loadstart").subscribe(event => {
    //   console.log(event.url);
    // });
  }

  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home-results');
  }

  async showError(message?) {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 2000,
      message: message ? message : 'Ops!',
      translucent: true
    });
    await loading.present();
  }
}
