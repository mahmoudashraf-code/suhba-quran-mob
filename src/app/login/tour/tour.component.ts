import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swiper from 'swiper';
import { Pagination, } from 'swiper/modules';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
})
export class TourComponent implements OnInit {
  constructor(
    public modalController: ModalController
  ) { }
  ngOnInit(): void {
    new Swiper('.swiper', {
      modules: [Pagination],
      pagination: {
        el: ".swiper-pagination",
      }
    });
  }
}
