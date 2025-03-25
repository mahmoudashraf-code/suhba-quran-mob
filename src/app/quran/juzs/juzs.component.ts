import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { QuranComponent } from '../quran.component';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-juzs',
  templateUrl: './juzs.component.html',
  styleUrls: ['./juzs.component.scss'],
})
export class JuzsComponent implements OnInit {
  juzs: number[] = []
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }
  ngOnInit(): void {
    this.juzs = Array.from({ length: 30 }, (_, i) => i + 1)
  }
  getPgaes(juz: number) {
    switch (juz) {
      case 1:
        return [1, 21]
      case 30:
        return [582, 604]
      default:
        let end = juz * 20 + 1
        return [end - 19, end]
    }
  }
  async open(juz: number) {
    let temp = this.getPgaes(juz);
    await this.modalController.dismiss();
    let { value: highlightKeywords } = await Preferences.get({ key: 'highlightKeywords' })
    let model = await this.modalController.create({
      component: QuranComponent,
      cssClass: 'fullModel',
      componentProps: {
        highlightKeywords: highlightKeywords ? JSON.parse(highlightKeywords) : {},
        start: temp[0],
        end: temp[1],
      }
    });
    model.onDidDismiss().then(async ({ data }) => {
      await Preferences.set({ key: 'highlightKeywords', value: JSON.stringify(data.highlightKeywords) })
    });
    model.present();
  }
}
