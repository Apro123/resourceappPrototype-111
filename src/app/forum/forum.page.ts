import { Component, OnInit } from '@angular/core';
import { AppInfoService } from './../services/app-info.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {

  programs = [];

  constructor(
      private info: AppInfoService
  ) { }

  async ngOnInit() {
    this.programs = await this.info.getPrograms();
    console.log(this.programs);
  }

}
