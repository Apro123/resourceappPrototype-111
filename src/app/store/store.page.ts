import { Component, OnInit } from '@angular/core';
import { AppInfoService } from './../services/app-info.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  items = [];
  program = [];
  admin = false;

  constructor(
      private info: AppInfoService
  ) { }

  async ngOnInit() {
    const priv = await this.info.getPriv();
    console.log(priv);
    if (Array.isArray(priv)) {
      this.program = priv;
    } else if (priv === 2) {
      this.admin = true;
    }

    this.items = await this.info.getItems();
    console.log(this.items);
    console.log(this.program);
  }

  changeQuantity(i, num) {
    this.items[i].i_quantity += num;
    this.info.updateQuanity(this.items[i].i_id, this.items[i].i_quantity);
  }

  // sendData() {
  //   this.info.updateQuantit
  // }
}
