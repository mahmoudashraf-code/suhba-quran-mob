import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-exame-result',
  templateUrl: './exame-result.component.html',
  styleUrls: ['./exame-result.component.scss'],
})
export class ExameResultComponent {
  exame: any;
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
  ]
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }
  saveFun() {
    this.app.loading().then((res) => {
      this.app.post('exame', {
        ...this.exame,
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
