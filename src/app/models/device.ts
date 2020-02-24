import { Subscription } from "rxjs";

export class Device {
  id: number;
  createDate: string;
  name: string;
  subscription: Subscription;
  message: string;
}
