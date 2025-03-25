import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotificationPage } from './notification.page';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: NotificationPage
      }
    ])
  ],
  declarations: [NotificationPage, NotificationComponent]
})
export class NotificationPageModule { }
