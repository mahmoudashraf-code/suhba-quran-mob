import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { QuranComponent } from '../quran.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  data: any = []
  current_page: number = 0;
  total_pages: number = -1;
  search: string = ''
  constructor(
    public modalController: ModalController,
    private app: AppService
  ) { }
  ionChange() {
    if (this.search == '') {
      this.data = []
      return;
    }
    this.app.loading().then((res) => {
      this.getData();
    });
  }
  getData(init: boolean = true, event?: InfiniteScrollCustomEvent) {
    if (init) this.data = [];
    this.app.http.get<{ [key: string]: any }>(`https://api.quran.com/api/v4/search?q=${this.search}&page=${this.current_page + 1}`).subscribe({
      next: ({ search }) => {
        for (let i = 0; i < search.results.length; i++) {
          this.data.push(search.results[i]);
        }
        this.current_page = search.current_page
        this.total_pages = search.total_pages
        if (event) {
          event.target.complete();
        } else this.app.loadingController.dismiss();
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
        if (event) {
          event.target.complete();
        } else this.app.loadingController.dismiss();
      },
    })
  }
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if (this.current_page == this.total_pages) {
      ev.target.complete();
      return;
    }
    this.getData(false, ev);
    ev.target.complete();
  }
  openQuran(key: string) {
    this.app.loading().then((res) => {
      this.app.http.get<any>(`https://api.quran.com/api/v4/verses/by_key/${key}`).subscribe({
        next: async ({ verse }) => {
          this.app.loadingController.dismiss();
          let arr = key.split(":");
          (await this.modalController.create({
            component: QuranComponent,
            cssClass: 'fullModel',
            componentProps: {
              highlight: [arr[1],arr[1]],
              start: verse.page_number,
              end: verse.page_number,
              surah: parseInt(arr[0])
            }
          })).present();
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
          this.app.loadingController.dismiss();
        },
      });
    });
  }
}
