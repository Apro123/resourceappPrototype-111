import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AppInfoService {

  constructor() { }

  async login(userInfo) {
    await Storage.set({
      key: "user",
      value: JSON.stringify(userInfo)
    });
  }

  async logout() {
    await Storage.remove({
      key: "user"
    });
  }

  // async get
}
