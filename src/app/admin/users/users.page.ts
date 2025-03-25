import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, model } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { EditUsersComponent } from './edit-users/edit-users.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  data: any = [];
  constructor(
    public app: AppService,
    public modalController: ModalController,
    public alertController: AlertController
  ) { }
  ngOnInit() {
    this.app.loading().then(res => {
      this.getData();
    })
  }
  getData(event?: { target: { complete: () => void } }) {
    this.app.post<any[]>("users/mobile", {
      where: {
        organization: this.app.user?.organization
      },
    }, 'admin-users').subscribe({
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
  async openUser(user: any = { organization: this.app.user?.organization, type: 'user' }) {
    let model = await this.modalController.create({
      component: EditUsersComponent,
      componentProps: {
        user,
      },
    });
    model.onDidDismiss().then(({ data }) => {
      if (data == 'done') {
        this.ngOnInit()
      }
    });
    model.present();
  }
  async deleteUser(user: any) {
    const alert = await this.alertController.create({
      header: 'تاكيد!',
      message: 'هل انت متاكد من حذف المستخدم',
      buttons: [
        {
          text: 'لا',
          role: 'cancel',
        },
        {
          text: 'نعم',
          handler: () => {
            this.app.loading().then((res) => {
              this.app.delete(`users/${user.id}`).subscribe({
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
