import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import tafsirs from './tafsirs.json'
import { AppService } from 'src/app/app.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-tafsir',
  templateUrl: './tafsir.component.html',
  styleUrls: ['./tafsir.component.scss'],
})
export class TafsirComponent implements OnInit {
  tafsirs = tafsirs;
  word: any = {}
  text: any = ''
  slug: string = 'ar-tafseer-al-saddi';
  constructor(
    public modalController: ModalController,
    private app: AppService
  ) { }
  ngOnInit() {
    this.slug = this.app.setting.tafsir;
    this.getData()
  }
  changeVal() {
    this.app.setting.tafsir = this.slug;
    this.getData()
    this.app.saveSetting()
  }
  getData() {
    this.app.loading().then((res) => {
      this.app.http.get(`https://api.qurancdn.com/api/qdc/tafsirs/${this.slug}/by_ayah/${this.word.verse_key}?locale=ar`).subscribe({
        next: (value: any) => {
          if (value.tafsir && value.tafsir.text) {
            this.text = value.tafsir.text
          }
          this.app.loadingController.dismiss()
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
          this.app.loadingController.dismiss();
        },
      })
    })
  }
}
