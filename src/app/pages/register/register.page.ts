import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NavController,
  MenuController,
  LoadingController
} from "@ionic/angular";
import { ApiService } from "src/app/service/api.service";
import { load } from "@angular/core/src/render3";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) {}

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
    const loader = await this.loadingCtrl.create({
      duration: 5000
    });
    loader.present();

    let fullName = this.onRegisterForm.value.fullName;
    let email = this.onRegisterForm.value.email;
    let password = this.onRegisterForm.value.password;

    this.api.strapi
      .register(fullName, email, password)
      .then(success => {
        console.log(success);
        this.navCtrl.navigateRoot("/home-results");
      })
      .catch(err => {
        console.log(err);
        this.showError();
      })
      .finally(() => {
        loader.dismiss();
      });
  }

  // // //

  async showError() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 2000,
      message: "Ops!",
      translucent: true
    });
    await loading.present();
  }

  goToLogin() {
    this.navCtrl.navigateRoot("/");
  }
}
