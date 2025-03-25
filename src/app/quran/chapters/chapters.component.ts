import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import chapters from './chapters.json'
import { QuranComponent } from 'src/app/quran/quran.component';
import { AppService } from 'src/app/app.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
})
export class ChaptersComponent {
  chapters = chapters
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }

  async open(chapter: any) {
    await this.modalController.dismiss();
    let { value: highlightKeywords } = await Preferences.get({ key: 'highlightKeywords' })
    let model = await this.modalController.create({
      component: QuranComponent,
      cssClass: 'fullModel',
      componentProps: {
        highlightKeywords: highlightKeywords ? JSON.parse(highlightKeywords) : {},
        start: chapter.pages[0],
        end: chapter.pages[1],
        surah: chapter.id
      }
    });
    model.onDidDismiss().then(async ({ data }) => {
      await Preferences.set({ key: 'highlightKeywords', value: JSON.stringify(data.highlightKeywords) })
    });
    model.present();
  }
}
