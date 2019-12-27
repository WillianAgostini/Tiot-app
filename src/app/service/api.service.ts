import { Injectable } from "@angular/core";
import Strapi from "strapi-sdk-javascript";
import { Storage } from "@ionic/storage";
import { isObject } from "util";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  public strapi = new Strapi("http://localhost:1337");

  constructor(private storage: Storage) {}

  setLocalUser(user) {
    this.storage.set("user", JSON.stringify(user)).then(
      () => console.log("Stored item!"),
      error => console.error("Error storing item", error)
    );
  }
  async getLocalUser() {
    try {
      let data = await this.storage.get("user");
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async hasUser() {
    let x = await this.getLocalUser();
    return x != null;
  }
}
