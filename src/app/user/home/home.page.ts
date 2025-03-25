import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserType } from 'src/app/login/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  history: any
  constructor(
    public app: AppService
  ) { }
  ngOnInit() {
    if (this.app.user?.type == UserType.ADMIN) return
    this.app.loading().then(res => {
      this.getData();
    })
  }
  getData() {
    this.app.post<any[]>("users/mobile", {
      where: {
        id: this.app.user?.id
      },
      order: {
        history: {
          date: 'DESC',
        }
      },
      select: {
        id: true,
        history: true
      },
      relations: {
        history: true
      }
    },'user-home').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0 && res[0].history.length > 0) {
          this.history = res[0].history[0];
        }
        this.app.loadingController.dismiss();
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
        this.app.loadingController.dismiss();
      }
    })
  }
}
