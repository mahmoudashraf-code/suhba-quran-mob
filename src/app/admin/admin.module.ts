import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminPage } from './admin.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminPage,
        children: [
          {
            path: 'account',
            loadChildren: () => import('./../user/account/account.module').then(m => m.AccountPageModule)
          },
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'home',
            loadChildren: () => import('./../user/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'notification',
            loadChildren: () => import('./../user/notification/notification.module').then(m => m.NotificationPageModule)
          },
          {
            path: 'users',
            loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule)
          },
          {
            path: 'organization',
            loadChildren: () => import('./../user/organization/organization.module').then(m => m.OrganizationPageModule)
          },
          {
            path: 'tours',
            loadChildren: () => import('./tours/tours.module').then( m => m.ToursPageModule)
          }
        ]
      }
    ])
  ],
  declarations: [AdminPage]
})
export class AdminPageModule { }
