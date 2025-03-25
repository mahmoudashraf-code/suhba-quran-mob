import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersPage } from './users.page';
import { RouterModule } from '@angular/router';
import { EditUsersComponent } from './edit-users/edit-users.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsersPage
      }
    ])
  ],
  declarations: [UsersPage, EditUsersComponent]
})
export class UsersPageModule { }
