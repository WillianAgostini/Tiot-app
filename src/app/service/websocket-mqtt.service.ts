import {Injectable} from '@angular/core';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {Device} from 'src/app/models/device';

@Injectable({providedIn: 'root'})
export class WebsocketMqttService {
  public ListDevices = new Array<Device>();

  constructor(public _mqttService: MqttService) {}

  setDevices(devices: Array<Device>) {
    if (this.ListDevices.length != devices.length) {
      this.ListDevices = devices;
      this.StartWebSocket();
      return this.ListDevices;
    }

    for (let index = 0; index < devices.length; index++) {
      if (devices[index].name != this.ListDevices[index].name) {
        this.ListDevices = devices;
        this.StartWebSocket();
        return this.ListDevices;
      }
    }

    return this.ListDevices;
  }

  StartWebSocket() {
    this.ListDevices.forEach(element => {
      element.subscription =
          this._mqttService.observe(element.name + '/packet')
              .subscribe((message: IMqttMessage) => {
                element.message = message.payload.toString().split('/')[0];
                element.status = message.payload.toString().split('/')[1] == '1'
                console.log(message.topic, element);
              });
      element.minSub = this._mqttService.observe(element.name + '/min')
                           .subscribe((message: IMqttMessage) => {
                             element.min = message.payload.toString();
                             // console.log(message.topic,
                             // message.payload.toString());
                           });

      element.maxSub = this._mqttService.observe(element.name + '/max')
                           .subscribe((message: IMqttMessage) => {
                             element.max = message.payload.toString();
                             // console.log(message.topic,
                             // message.payload.toString());
                           });
    })
  };
}
