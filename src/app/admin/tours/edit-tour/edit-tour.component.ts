import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { EditLevelComponent } from '../edit-level/edit-level.component';
import { ResultTourFinalComponent } from 'src/app/common/result-tour-final/result-tour-final.component';

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrls: ['./edit-tour.component.scss'],
})
export class EditTourComponent {
  tour: any;
  status = [
    {
      id: 'completed',
      val: 'انتهث'
    },
    {
      id: 'onProgress',
      val: 'جاري'
    },
    {
      id: 'exame',
      val: 'الامتحان'
    }
  ];
  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    private app: AppService
  ) { }
  hasRequiredKeys(object: any, requiredKeys: string[]) {
    return (
      Object.keys(object).filter((key) => requiredKeys.includes(key)).length ===
      requiredKeys.length
    );
  }
  save() {
    if (
      this.hasRequiredKeys(this.tour, [
        'name',
        'start',
        'end',
        'description',
      ]) == false
    ) {
      this.app.err('اكمل الحقول');
      return;
    }
    this.app.loading().then((res) => {
      this.app.post(`tour`, this.tour).subscribe({
        next: (res) => {
          this.app.loadingController.dismiss();
          this.modalController.dismiss("done")
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
          this.app.loadingController.dismiss();
        },
      });
    });
  }
  async openLevel(level: any = { tour: { id: this.tour.id } }) {
    let model = await this.modalController.create({
      component: EditLevelComponent,
      componentProps: {
        level,
      },
    });
    model.onDidDismiss().then(({ data }) => {
      if (data == 'done') {
        this.modalController.dismiss("done")
      }
    });
    model.present();
  }
  async result(item: any) {
    (await this.modalController.create({
      component: ResultTourFinalComponent,
      mode: "ios",
      cssClass: 'fullModel',
      componentProps: {
        id: item.id,
      },
    })).present();
  }
  async deleteLevel(level: any) {
    const alert = await this.alertController.create({
      header: 'تاكيد!',
      message: 'هل انت متاكد من حذف المستوي',
      buttons: [
        {
          text: 'لا',
          role: 'cancel',
        },
        {
          text: 'نعم',
          handler: () => {
            this.app.loading().then((res) => {
              this.app.delete(`level/${level.id}`).subscribe({
                next: (res) => {
                  this.app.loadingController.dismiss();
                  this.modalController.dismiss("done")
                },
                error: (err: HttpErrorResponse) => {
                  this.app.err(err.error);
                  this.app.loadingController.dismiss();
                },
              });
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
