import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToursPage } from './tours.page';
import { RouterModule } from '@angular/router';
import { TourComponent } from './tour/tour.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ToursPage
      }
    ])
  ],
  declarations: [ToursPage, TourComponent]
})
export class ToursPageModule { }
