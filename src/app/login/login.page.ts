import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { IUser } from './user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { goToDashboard } from '../goToDashboard';
import { ModalController } from '@ionic/angular';
import { TourComponent } from './tour/tour.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginData: FormGroup;
  constructor(
    private app: AppService,
    public modalController: ModalController
  ) {
    this.loginData = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    goToDashboard(this.app).then((res) => {
      if (res) {
        this.app.initDashboard();
      }
    });
  }
  onSubmit() {
    if (this.loginData.valid == false) {
      this.app.err('البيانات مفقودة');
      return;
    } else {
      this.app.loading().then((res) => {
        this.app
          .post<{ token: string; user: IUser }>(
            'auth/login',
            this.loginData.value,
            'loginData'
          )
          .subscribe({
            next: (res) => {
              localStorage.setItem('suhba', res.token);
              this.app.token = res.token;
              this.app.user = res.user;
              this.loginData.reset();
              this.app.initHeaders();
              this.app.initDashboard();
              this.app.loadingController.dismiss();
            },
            error: (err: HttpErrorResponse) => {
              this.app.loadingController.dismiss();
              this.app.err(err.error);
            },
          });
      });
    }
  }
  async tour() {
    (await this.modalController.create({
      component: TourComponent,
      cssClass: 'fullModel',
      mode: "ios"
    })).present();
  }
}
