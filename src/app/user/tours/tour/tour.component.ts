import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
})
export class TourComponent {
  item: any = {};
  options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    locale: 'ar-EG',
  };
  constructor(
    public modalController: ModalController
  ) { }
  date(date: string) {
    return new Intl.DateTimeFormat('ar-EG', this.options).format(
      new Date(date)
    );
  }
}
