import { Subscription } from "rxjs";

export class Device {
  _id: number;
  createDate: string;
  name: string;
  subscription: Subscription;
  message: string;
}
