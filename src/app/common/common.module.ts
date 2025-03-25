import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule as CommonModuleNative } from '@angular/common';
import { QuranCardComponent } from './quran-card/quran-card.component';
import { SaveAndReviewComponent } from './save-and-review/save-and-review.component';
import { MyHistoryComponent } from './my-history/my-history.component';
import { ResultTourFinalComponent } from './result-tour-final/result-tour-final.component';

@NgModule({
  declarations: [
    QuranCardComponent,
    MyHistoryComponent,
    SaveAndReviewComponent,
    ResultTourFinalComponent,
  ],
  imports: [
    CommonModuleNative,
    IonicModule,
    FormsModule,
  ],
  exports: [QuranCardComponent, SaveAndReviewComponent]
})
export class CommonModule { }
