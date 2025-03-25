import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { iVoice } from 'src/app/quran/audio/audio.component';
import { QuranComponent } from 'src/app/quran/quran.component';

@Component({
  selector: 'app-save-and-review',
  templateUrl: './save-and-review.component.html',
  styleUrls: ['./save-and-review.component.scss'],
})
export class SaveAndReviewComponent {
  @Output() save: EventEmitter<iVoice> = new EventEmitter();
  @Input() history: any;
  options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    locale: 'ar-EG',
  };
  date(date: string) {
    return new Intl.DateTimeFormat('ar-EG', this.options).format(
      new Date(date)
    );
  }
  constructor(
    public app: AppService,
    public modalController: ModalController
  ) { }
  open(item: any, key = 'save') {
    this.app.loading().then((res) => {
      this.app.http.get<any>(`https://api.quran.com/api/v4/verses/by_key/${item.surah}:${item.from}`).subscribe({
        next: async ({ verse: verse1 }) => {
          this.app.http.get<any>(`https://api.quran.com/api/v4/verses/by_key/${item.surah}:${item.to}`).subscribe({
            next: async ({ verse }) => {
              this.app.loadingController.dismiss();
              let model = await this.modalController.create({
                component: QuranComponent,
                cssClass: 'fullModel',
                componentProps: {
                  highlightKeywords: item.extra ? item.extra : {},
                  start: verse1.page_number,
                  end: verse.page_number,
                  surah: parseInt(item.surah),
                  highlight: [item.from, item.to]
                }
              });
              model.onDidDismiss().then(async ({ data }) => {
                this.save.emit({
                  e: key,
                  data: data.highlightKeywords
                })
              });
              model.present();
            }
          });
        }
      });
    });
  }
}
