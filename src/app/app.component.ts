import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppInfoService } from './services/app-info.service';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  pages = [
    {
      title: 'Home',
      url: '/tabs/home',
      icon: 'home'
    },
    {
      title: 'Items',
      url: '/items',
      icon: 'cart'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    },
    {
      title: 'Sign Out',
      url: '/logout',
      icon: 'exit'
    }
  ];

  userData = {
    u_firstname: '',
    u_lastname: '',
    u_pictureURL: ''
  };
  name: string;
  email: string;
  img: string;

  constructor(
    private platform: Platform,
    private info: AppInfoService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.info.autoLogin();
    this.platform.ready().then( async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.router.events.subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this.pages.map(p => {
            return p['active'] = (event.url === p.url);
          });
        }
      });

      this.info.authSt.subscribe(async (state) => {
        if (state) {
          this.userData = await this.info.getData('user');
          this.name = this.userData.u_firstname + ' ' + this.userData.u_lastname;
          this.img = this.userData.u_pictureURL;
          this.router.navigate(['/tabs/home']);
        } else {
          this.router.navigate(['/login']);
        }
      });
    });
  }
}
