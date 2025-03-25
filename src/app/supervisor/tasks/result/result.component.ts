import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { iVoice } from 'src/app/quran/audio/audio.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  history: any;
  result = [
    {
      id: 'A',
      name: 'امتياز'
    },
    {
      id: 'B',
      name: 'جيد جدا'
    },
    {
      id: 'C',
      name: 'جيد'
    },
    {
      id: 'D',
      name: 'مقبول'
    },
    {
      id: 'F',
      name: 'اعادة'
    }
  ]
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }
  save(data: iVoice) {
    this.history[data.e].extra = data.data;
  }
  saveFun() {
    this.app.loading().then((res) => {
      this.app.post('history', {
        id: this.history.id,
        save: {
          ...this.history.save,
          extra: this.history.save.extra,
        },
        review: {
          ...this.history.review,
          extra: this.history.review.extra,
        },
        result: this.history.result
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
}
