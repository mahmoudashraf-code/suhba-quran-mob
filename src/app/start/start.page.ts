import { Component, OnInit } from '@angular/core';
import page from './page.json'
import { ModalController } from '@ionic/angular';
import { AppService } from '../app.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  page: any = page;
  size: number = 6.2
  constructor(
    public modalController: ModalController,
    private app: AppService
  ) { }
  ngOnInit() {
    this.size = this.app.setting.size;
    this.getFont()
  }
  getFont(selectPage = 3) {
    const font = new FontFace(`p${selectPage}-v1`, `url(assets/fonts/quran/p${selectPage}.woff2) format("woff2")`);
    font.load().then(loadedFont => {
      document.fonts.add(loadedFont);
      console.log('Font added successfully.');
    }).catch(error => {
      console.error('Failed to load font:', error);
    });
  }
  next() {
    this.app.setting.size = this.size;
    this.app.saveSetting();
    this.modalController.dismiss();
  }
}
