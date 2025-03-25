import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { ModalController } from '@ionic/angular';
import { AudioComponent } from './audio/audio.component';
import { StatusBar } from '@capacitor/status-bar';
import { KeepAwake } from '@capacitor-community/keep-awake';

@Component({
  selector: 'app-quran',
  templateUrl: './quran.component.html',
  styleUrls: ['./quran.component.scss'],
})
export class QuranComponent implements OnInit, OnDestroy {
  @ViewChild('swiperEl', { static: true }) swiperEl!: ElementRef<HTMLElement>;
  @ViewChild('voice') audio!: AudioComponent;
  start: number = 1;
  end: number = 604;
  surah: number = -1;
  highlight = [];
  pages: number[] = []
  stopAt: number = 1
  highlightKeywords: {
    [key: string]: string[]
  } = {}
  constructor(
    public modalController: ModalController
  ) { }
  dismiss() {
    this.audio.audioFuns().stopAudio();
    this.modalController.dismiss({
      highlightKeywords: this.highlightKeywords,
      stopAt: this.stopAt
    })
  }
  async ngOnDestroy() {
    StatusBar.setBackgroundColor({ color: '#ffffff' });
    await KeepAwake.allowSleep();
  }
  async ngOnInit() {
    this.pages = Array.from({ length: (this.end - this.start) + 1 }, (_, i) => i + this.start)
    new Swiper(this.swiperEl.nativeElement, {
      spaceBetween: 60,
      initialSlide: this.stopAt > 1 ? this.stopAt - 1 : 0,
      on: {
        slideNextTransitionStart: (swiper) => {
          if (swiper.realIndex <= this.pages.length) {
            this.stopAt = swiper.realIndex + 1;
          }
        },
        slidePrevTransitionStart: (swiper) => {
          this.stopAt = swiper.realIndex + 1;
        },
      }
    });
    try {
      StatusBar.setBackgroundColor({ color: '#f6f3e9' });
      if (await this.isSupported()) {
        await KeepAwake.keepAwake();
      }
    } catch (err) { }
  }

  async isSupported() {
    const result = await KeepAwake.isSupported();
    return result.isSupported;
  };

  saveHighlight(page: number, e: string[]) {
    if (e.length == 0) {
      delete this.highlightKeywords[page]
      return
    }
    this.highlightKeywords[page] = e
  }
}
