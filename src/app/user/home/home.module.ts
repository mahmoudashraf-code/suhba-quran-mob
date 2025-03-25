import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { RouterModule } from '@angular/router';
import { TourComponent } from './tour/tour.component';
import { CommonModule as myCommonModule } from 'src/app/common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    myCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, TourComponent]
})
export class HomePageModule { }
