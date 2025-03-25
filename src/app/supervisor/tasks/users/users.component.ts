import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { HistoryComponent } from '../history/history.component';
import { ResultComponent } from '../result/result.component';
import { MyHistoryComponent } from 'src/app/common/my-history/my-history.component';
import { ExameResultComponent } from '../exame-result/exame-result.component';
import { UserType } from 'src/app/login/user.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  users: any = [];
  level: number = -1
  status: string = ''
  constructor(
    public modalController: ModalController,
    public app: AppService
  ) { }
  async history(user: any) {
    switch (this.status) {
      case 'onProgress': {
        if (this.app.user?.type !== UserType.SUPERVISOR) {
          this.app.err("غير مسرح لك بذالك الان")
          return
        }
        await this.app.loading();
        let data = await firstValueFrom(this.app.get<any>(`history/current/${user.id}/${this.level}`));
        this.app.loadingController.dismiss();
        if (!data || (data.date.slice(0, 10) == (new Date()).toISOString().slice(0, 10)) || (data.result != 'F' && data.result != 'W')) {
          (await this.modalController.create({
            component: HistoryComponent,
            cssClass: 'fullModel',
            componentProps: {
              user,
              history: data ? data : {
                user: {
                  id: user.id
                },
                level: {
                  id: this.level
                },
                save: {},
                review: {},
              }
            },
          })).present()
        } else {
          (await this.modalController.create({
            component: ResultComponent,
            cssClass: 'fullModel',
            componentProps: {
              history: data,
            },
          })).present()
        }
        break;
      }
      case 'exame':
        if (this.app.user?.type !== UserType.EXAMER) {
          this.app.err("غير مسرح لك بذالك الان")
          return
        }
        await this.app.loading();
        let data = await firstValueFrom(this.app.get<any>(`exame/current/${user.id}/${this.level}`));
        this.app.loadingController.dismiss();
        (await this.modalController.create({
          component: ExameResultComponent,
          cssClass: 'fullModel',
          breakpoints: [0.0, 0.7, 0.9],
          initialBreakpoint: 0.7,
          componentProps: {
            exame: data ? data : {
              user: {
                id: user.id
              },
              level: {
                id: this.level
              }
            }
          },
        })).present();
        break;
      case 'completed':
        this.myHistory(user.id)
        break;
    }
  }
  async myHistory(id: string) {
    (await this.modalController.create({
      component: MyHistoryComponent,
      cssClass: 'fullModel',
      componentProps: {
        id,
        level: this.level
      },
    })).present();
  }
}
