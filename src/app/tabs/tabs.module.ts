import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { HomePageModule } from './../home/home.module';
import { StorePageModule } from './../store/store.module';
import { MapPageModule } from './../map/map.module';
import { ForumPageModule } from './../forum/forum.module';
import { NotificationsPageModule } from './../notifications/notifications.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    StorePageModule,
    MapPageModule,
    ForumPageModule,
    NotificationsPageModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
