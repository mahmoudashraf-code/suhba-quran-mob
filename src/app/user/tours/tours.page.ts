import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { MyHistoryComponent } from 'src/app/common/my-history/my-history.component';
import { TourComponent } from './tour/tour.component';
import { ResultTourFinalComponent } from 'src/app/common/result-tour-final/result-tour-final.component';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.page.html',
  styleUrls: ['./tours.page.scss'],
})
export class ToursPage implements OnInit {
  data: any;
  status: any = {
    completed: 'انتهث',
    onProgress: 'جاري',
    exame: 'الامتحان',
  };
  options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    locale: 'ar-EG',
  };
  constructor(
    private app: AppService,
    public modalController: ModalController
  ) { }
  ngOnInit() {
    this.app.loading().then((res) => {
      this.getData();
    });
  }
  date(date: string) {
    return new Intl.DateTimeFormat('ar-EG', this.options).format(
      new Date(date)
    );
  }
  getData(event?: { target: { complete: () => void } }) {
    this.app.post('level/mobile', {
      order: {
        tour: {
          start: 'DESC',
        }
      },
      relations: {
        tour: true,
      },
      where: {
        users: {
          id: this.app.user?.id
        }
      }
    }, 'user-levels').subscribe({
      next: (res) => {
        this.data = res;
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
    });
  }
  async openTour(item: any) {
    (await this.modalController.create({
      component: TourComponent,
      breakpoints: [0.0, 0.7, 0.9],
      initialBreakpoint: 0.7,
      componentProps: {
        item,
      },
    })).present();
  }
  async result(item: any) {
    (await this.modalController.create({
      component: ResultTourFinalComponent,
      mode: "ios",
      cssClass: 'fullModel',
      componentProps: {
        id: item.id,
      },
    })).present();
  }
  async myHistory(id: any) {
    (await this.modalController.create({
      component: MyHistoryComponent,
      cssClass: 'fullModel',
      componentProps: {
        id: this.app.user?.id,
        level: id
      },
    })).present();
  }
}

