import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChaptersComponent } from 'src/app/quran/chapters/chapters.component';
import { JuzsComponent } from 'src/app/quran/juzs/juzs.component';
import { QuranComponent } from 'src/app/quran/quran.component';
import { SearchComponent } from 'src/app/quran/search/search.component';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-quran-card',
  templateUrl: './quran-card.component.html',
  styleUrls: ['./quran-card.component.scss'],
})
export class QuranCardComponent {
  constructor(
    public modalController: ModalController
  ) { }
  async chapters() {
    (await this.modalController.create({
      component: ChaptersComponent,
    })).present();
  }
  async juzs() {
    (await this.modalController.create({
      component: JuzsComponent,
    })).present();
  }
  async search() {
    (await this.modalController.create({
      component: SearchComponent,
    })).present();
  }
  async quran() {
    let { value: stopAt } = await Preferences.get({ key: 'stopAt' })
    let { value: highlightKeywords } = await Preferences.get({ key: 'highlightKeywords' })
    let model = await this.modalController.create({
      component: QuranComponent,
      showBackdrop: false,
      cssClass: 'fullModel',
      componentProps: {
        stopAt: stopAt ? stopAt : 1,
        highlightKeywords: highlightKeywords ? JSON.parse(highlightKeywords) : {},
        start: 1,
        end: 604,
      }
    });
    model.onDidDismiss().then(async ({ data }) => {
      await Preferences.set({ key: 'stopAt', value: data.stopAt.toString() })
      await Preferences.set({ key: 'highlightKeywords', value: JSON.stringify(data.highlightKeywords) })
    });
    model.present();
  }
}
