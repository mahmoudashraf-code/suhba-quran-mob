import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserPage } from './user.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserPage,
        children: [
          {
            path: 'tours',
            loadChildren: () => import('./tours/tours.module').then( m => m.ToursPageModule)
          },
          {
            path: 'home',
            loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
          },
          {
            path: 'organization',
            loadChildren: () => import('./organization/organization.module').then( m => m.OrganizationPageModule)
          },
          {
            path: 'account',
            loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
          },
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'notification',
            loadChildren: () => import('./notification/notification.module').then(m => m.NotificationPageModule)
          }
        ],
      }
    ])
  ],
  declarations: [UserPage]
})
export class UserPageModule { }
