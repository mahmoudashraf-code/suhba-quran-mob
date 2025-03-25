import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { UsersComponent } from './users/users.component';
import { TourComponent } from 'src/app/user/tours/tour/tour.component';
import { ResultTourFinalComponent } from 'src/app/common/result-tour-final/result-tour-final.component';
import { UserType } from 'src/app/login/user.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  data: any;
  status: any = {
    completed: 'انتهث',
    onProgress: 'جاري',
    exame: 'الامتحان',
  };
  options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    locale: 'ar-EG',
  };
  constructor(
    private app: AppService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.app.loading().then((res) => {
      this.getData();
    });
  }
  date(date: string) {
    return new Intl.DateTimeFormat('ar-EG', this.options).format(
      new Date(date)
    );
  }
  getData(event?: { target: { complete: () => void } }) {
    let where = {}
    switch (this.app.user?.type) {
      case UserType.SUPERVISOR:
        where = {
          supervisor: {
            id: this.app.user?.id,
            organization: this.app.user?.organization
          },
        }
        break;
      case UserType.EXAMER:
        where = {
          examer: {
            id: this.app.user?.id,
            organization: this.app.user?.organization
          },
        }
        break;
    }
    this.app.post('level/mobile', {
      order: {
        tour: {
          start: 'DESC',
        },
      },
      select: {
        users: {
          id: true,
          name: true,
          phone: true
        }
      },
      relations: {
        tour: true,
        users: true
      },
      where: where
    }, 'supervisor-tasks').subscribe({
      next: (res) => {
        this.data = res;
        if (event) {
          event.target.complete();
        } else this.app.loadingController.dismiss();
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
        if (event) {
          event.target.complete();
        } else this.app.loadingController.dismiss();
      },
    });
  }
  async openTour(item: any) {
    (await this.modalController.create({
      component: TourComponent,
      breakpoints: [0.0, 0.7, 0.9],
      initialBreakpoint: 0.7,
      componentProps: {
        item,
      },
    })).present();
  }
  async users(item: any) {
    (await this.modalController.create({
      component: UsersComponent,
      breakpoints: [0.0, 0.7, 0.9],
      initialBreakpoint: 0.9,
      componentProps: {
        users: item.users,
        level: item.id,
        status: item.tour.status
      },
    })).present()
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
}
