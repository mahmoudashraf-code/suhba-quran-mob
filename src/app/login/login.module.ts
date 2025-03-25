import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { RouterModule } from '@angular/router';
import { CommonModule as myCommonModule } from './../common/common.module';
import { TourComponent } from './tour/tour.component';

@NgModule({
  imports: [
    CommonModule,
    myCommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginPage,
      },
    ]),
  ],
  declarations: [LoginPage, TourComponent],
})
export class LoginPageModule {}
