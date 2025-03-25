import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { QuranComponent } from 'src/app/quran/quran.component';

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.scss'],
})
export class MyHistoryComponent implements OnInit {
  id: string = '';
  level: string = '';
  history: any = [];
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }
  result: any = {
    'A': ['امتياز', 'primary'],
    'B': ['جيد جدا', 'success'],
    'C': ['جيد', 'warning'],
    'D': ['مقبول', 'dark'],
    'F': ['اعادة', 'danger'],
    'W': ['جاري', 'secondary'],
  }
  options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    locale: 'ar-EG',
  };
  ngOnInit(): void {
    this.app.loading().then((res) => {
      this.app.post('history/mobile', {
        order: {
          date: 'DESC'
        },
        where: {
          user: {
            id: this.id,
          },
          level: {
            id: this.level
          }
        }
      }, this.app.user?.id == this.id ? 'my-history' : '').subscribe({
        next: (value) => {
          this.history = value;
          this.app.loadingController.dismiss();
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
          this.app.loadingController.dismiss();
        },
      })
    });
  }
  date(date: string) {
    return new Intl.DateTimeFormat('ar-EG', this.options).format(
      new Date(date)
    );
  }
  open(item: any) {
    this.app.loading().then((res) => {
      this.app.http.get<any>(`https://api.quran.com/api/v4/verses/by_key/${item.surah}:${item.from}`).subscribe({
        next: async ({ verse: verse1 }) => {
          this.app.http.get<any>(`https://api.quran.com/api/v4/verses/by_key/${item.surah}:${item.to}`).subscribe({
            next: async ({ verse }) => {
              this.app.loadingController.dismiss();
              (await this.modalController.create({
                component: QuranComponent,
                cssClass: 'fullModel',
                componentProps: {
                  highlightKeywords: item.extra ? item.extra : {},
                  start: verse1.page_number,
                  end: verse.page_number,
                  surah: parseInt(item.surah),
                  highlight: [item.from, item.to]
                }
              })).present();
            }
          });
        }
      });
    });
  }
}
