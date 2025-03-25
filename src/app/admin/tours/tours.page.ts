import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { EditTourComponent } from './edit-tour/edit-tour.component';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.page.html',
  styleUrls: ['./tours.page.scss'],
})
export class ToursPage implements OnInit {
  data: any = [];
  status: any = {
    completed: 'انتهث',
    onProgress: 'جاري',
    exame: 'الامتحان',
  };
  constructor(
    public app: AppService,
    public modalController: ModalController,
    public alertController: AlertController
  ) { }
  options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  date(date: string) {
    return new Intl.DateTimeFormat('ar-EG', this.options).format(
      new Date(date)
    );
  }
  ngOnInit() {
    this.app.loading().then(res => {
      this.getData();
    })
  }
  getData(event?: { target: { complete: () => void } }) {
    this.app.post<any[]>("tour/mobile", {
      order: {
        start: 'DESC'
      },
      where: {
        organization: this.app.user?.organization
      },
      relations: {
        levels: {
          supervisor: true,
          examer: true,
          users: true
        }
      }
    }, 'admin-tours').subscribe({
      next: (res: any[]) => {
        this.data = res;
        if (event) {
          event.target.complete();
        } else
          this.app.loadingController.dismiss();
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
        if (event) {
          event.target.complete();
        } else
          this.app.loadingController.dismiss();
      }
    })
  }
  async openTour(tour: any = { organization: this.app.user?.organization, status: 'onProgress', start: new Date().toISOString(), end: new Date().toISOString() }) {
    let model = await this.modalController.create({
      component: EditTourComponent,
      componentProps: {
        tour,
      },
    });
    model.onDidDismiss().then(({ data }) => {
      if (data == 'done') {
        this.ngOnInit()
      }
    });
    model.present();
  }
  async deleteTour(user: any) {
    const alert = await this.alertController.create({
      header: 'تاكيد!',
      message: 'هل انت متاكد من حذف الجولة',
      buttons: [
        {
          text: 'لا',
          role: 'cancel',
        },
        {
          text: 'نعم',
          handler: () => {
            this.app.loading().then((res) => {
              this.app.delete(`tour/${user.id}`).subscribe({
                next: (res) => {
                  this.app.loadingController.dismiss();
                  this.ngOnInit()
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
