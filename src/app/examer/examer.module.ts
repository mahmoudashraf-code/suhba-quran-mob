import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExamerPage } from './examer.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExamerPage,
        children: [
          {
            path: 'account',
            loadChildren: () => import('./../user/account/account.module').then(m => m.AccountPageModule)
          },
          {
            path: 'tours',
            loadChildren: () => import('./../user/tours/tours.module').then(m => m.ToursPageModule)
          },
          {
            path: 'home',
            loadChildren: () => import('./../user/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'organization',
            loadChildren: () => import('./../user/organization/organization.module').then(m => m.OrganizationPageModule)
          },
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'tasks',
            loadChildren: () => import('./../supervisor/tasks/tasks.module').then( m => m.TasksPageModule)
          },
          {
            path: 'notification',
            loadChildren: () => import('./../user/notification/notification.module').then(m => m.NotificationPageModule)
          }
        ]
      }
    ])
  ],
  declarations: [ExamerPage]
})
export class ExamerPageModule { }
