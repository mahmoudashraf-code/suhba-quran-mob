import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
})
export class TourComponent implements OnInit {
  banner: string[] = [];
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }
  ngOnInit(): void {
    new Swiper('.swiper', {
      modules: [Pagination],
      pagination: {
        el: '.swiper-pagination',
      },
    });
    this.app
      .get<string[]>(`../plugins/database?path=${['quran-suhba', 'banner.json'].join(',')}`)
      .subscribe({
        next: (res: string[]) => {
          this.banner = res;
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
        },
      });
  }
}
