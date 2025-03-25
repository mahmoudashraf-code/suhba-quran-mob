import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuranComponent } from './quran.component';
import { IonicModule } from '@ionic/angular';
import { PageComponent } from './page/page.component';
import { FormsModule } from '@angular/forms';
import { ChaptersComponent } from './chapters/chapters.component';
import { JuzsComponent } from './juzs/juzs.component';
import { ToolbarComponent } from './page/toolbar/toolbar.component';
import { TafsirComponent } from './page/tafsir/tafsir.component';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { AudioComponent } from './audio/audio.component';

@NgModule({
  declarations: [QuranComponent, PageComponent, ChaptersComponent, JuzsComponent, ToolbarComponent, TafsirComponent, AudioComponent, SearchComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: QuranComponent
      }
    ])
  ],
  exports: []
})
export class QuranModule { }
