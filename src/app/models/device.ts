import {Subscription} from 'rxjs';

export class Device {
  _id: number;
  createDate: string;
  name: string;
  subscription: Subscription;
  minSub: Subscription;
  maxSub: Subscription;
  statusSub: Subscription;
  message: string;
  min: string;
  max: string;
  status: boolean;
  newMin: string;
  newMax: string;
  ip: string;
}
