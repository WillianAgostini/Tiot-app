import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
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
    private api: ApiService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.api.hasUser().then(value => {
      this.goToHome();
    });
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: "Forgot Password?",
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "Email"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Confirm",
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: "Email was sended successfully.",
                duration: 3000,
                position: "bottom"
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
    let email = this.onLoginForm.value.email;
    let password = this.onLoginForm.value.password;

    this.api.strapi.login(email, password).then(
      async res => {
        console.log(res);
        this.api.setLocalUser(res.user);
        this.goToHome();
      },
      err => {
        console.log(err);
        this.showError();
      }
    );
  }

  goToRegister() {
    this.navCtrl.navigateRoot("/register");
  }

  goToHome() {
    this.navCtrl.navigateRoot("/home-results");
  }

  async showError() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 2000,
      message: "Ops!",
      translucent: true
    });
    await loading.present();
  }
}
