import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import chapters from 'src/app/quran/chapters/chapters.json'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  save: number[] = [];
  review: number[] = [];
  history: any = {
    save: {},
    review: {},
  }
  chapters = chapters;
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }
  ngOnInit(): void {
    if (this.history.save.surah)
      this.init('save', this.history.save.surah)
    if (this.history.review.surah)
      this.init('save', this.history.review.surah)
  }
  saveFun() {
    this.app.loading().then((res) => {
      this.app.post('history', {
        ...this.history,
        result: 'F',
        date: new Date(),
      }).subscribe({
        next: (res) => {
          this.app.loadingController.dismiss();
          this.modalController.dismiss()
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
          this.app.loadingController.dismiss();
        },
      });
    });
  }
  init(key: string, index: number) {
    if (key == 'save')
      this.save = Array.from({ length: this.chapters[index - 1].verses_count }, (_, i) => i + 1)
    else
      this.review = Array.from({ length: this.chapters[index - 1].verses_count }, (_, i) => i + 1)
  }
}
