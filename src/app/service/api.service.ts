import { Injectable } from "@angular/core";
import Strapi from "strapi-sdk-javascript";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  public strapi = new Strapi("http://localhost:1337");

  constructor() {}
}
