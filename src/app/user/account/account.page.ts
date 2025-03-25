import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { IUser } from 'src/app/login/user.interface';
import { StartPage } from 'src/app/start/start.page';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {
  user: IUser | undefined;
  constructor(
    public app: AppService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {
    this.user = {
      ...(app.user as IUser),
    };
  }
  async logOut() {
    const alert = await this.alertController.create({
      header: 'تاكيد!',
      message: 'هل انت متاكد من تسجيل الخروج',
      buttons: [
        {
          text: 'لا',
          role: 'cancel',
        },
        {
          text: 'نعم',
          handler: () => {
            this.app.logout();
          },
        },
      ],
    });
    await alert.present();
  }
  async settings() {
    let model = await this.modalController.create({
      component: StartPage,
      cssClass: 'fullModel',
      mode: 'ios',
    });
    model.onDidDismiss().then(async () => {
      await Preferences.set({ key: 'start-done', value: 'true' });
    });
    model.present();
  }
  save() {
    this.app.loading().then((res) => {
      this.app.post(`users`, this.user).subscribe({
        next: (res) => {
          this.app.user = this.user;
          this.app.loadingController.dismiss();
          this.app.err('تم الخفظ بنجاح');
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
          this.app.loadingController.dismiss();
        },
      });
    });
  }
}
