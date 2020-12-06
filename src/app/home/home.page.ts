import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInfoService } from './../services/app-info.service';
import { MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  admin = false;
  postPriv = false;
  program = []; // program infos if program manager. Empty if not program
  edit = false;

  posts = [];

  // tslint:disable-next-line:variable-name
  validation_form: FormGroup;
  annouceOrPts = [];


  constructor(
      private info: AppInfoService,
      private menuCtrl: MenuController,
      private router: Router
  ) { }

  async ngOnInit() {
    this.menuCtrl.enable(true);
    const priv = await this.info.getPriv();
    if (Array.isArray(priv)) {
      this.program = priv;
      this.postPriv = true;
    } else if (priv === 2) {
      this.admin = true;
      this.postPriv = true;
    }
    // else reg user
    this.posts = await this.info.getPosts();
    for (let i in this.posts) {
      const d = await this.info.getProgramByID(this.posts[i].e_programID);
      if (d) {
        this.posts[i].pr_name =  d.pr_name;
      }
    }
    console.log(this.posts);
  }

  // logOut() {
  //   this.info.logout();
  // }

  createPost() {
    if (this.postPriv) {
      this.edit = !this.edit;
    }
  }

  navigate(page) {
    this.router.navigate(['/tabs/' + page])
  }

}
