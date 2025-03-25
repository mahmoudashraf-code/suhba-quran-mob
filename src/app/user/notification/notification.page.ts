import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  data: any = [];
  constructor(
    public app: AppService,
    public modalController: ModalController
  ) { }
  ngOnInit() {
    this.app.loading().then(res => {
      this.getData();
    })
  }
  getData(event?: { target: { complete: () => void } }) {
    this.app.post<any[]>("users/mobile", {
      where: {
        id: this.app.user?.id
      },
      select: {
        id: true,
        notification: true
      },
      relations: {
        notification: true
      }
    }, 'user-notification').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.data = res[0].notification;
        }
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
  async notePage(note: any) {
    (await this.modalController.create({
      component: NotificationComponent,
      breakpoints: [.0, .7, .9],
      initialBreakpoint: .7,
      componentProps: {
        note
      }
    })).present()
  }
}
