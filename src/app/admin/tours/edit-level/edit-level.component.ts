import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-edit-level',
  templateUrl: './edit-level.component.html',
  styleUrls: ['./edit-level.component.scss'],
})
export class EditLevelComponent implements OnInit {
  level: any;
  users: any = []
  supervisor: any = []
  examer: any = []
  constructor(
    public modalController: ModalController,
    private app: AppService
  ) { }
  ngOnInit(): void {
    if (this.level.id) {
      this.level.users = this.level.users.map((ele: any) => ele.id)
      this.level.supervisor = this.level.supervisor.map((ele: any) => ele.id)
      this.level.examer = this.level.examer?.id;
    }
    this.getUsers();
    this.getSupervisor();
    this.getExamer()
  }
  getUsers() {
    this.app.post('users/mobile', {
      where: {
        organization: {
          id: this.app.user?.organization.id
        },
        type: 'user'
      }
    }).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
      },
    })
  }
  getSupervisor() {
    this.app.post('users/mobile', {
      where: {
        organization: {
          id: this.app.user?.organization.id
        },
        type: 'supervisor'
      }
    }).subscribe({
      next: (res) => {
        this.supervisor = res;
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
      },
    })
  }
  getExamer() {
    this.app.post('users/mobile', {
      where: {
        organization: {
          id: this.app.user?.organization.id
        },
        type: 'examer'
      }
    }).subscribe({
      next: (res) => {
        this.examer = res;
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
      },
    })
  }
  hasRequiredKeys(object: any, requiredKeys: string[]) {
    return (
      Object.keys(object).filter((key) => requiredKeys.includes(key)).length ===
      requiredKeys.length
    );
  }
  save() {
    if (
      this.hasRequiredKeys(this.level, [
        'name',
        'users',
        'description',
      ]) == false
    ) {
      this.app.err('اكمل الحقول');
      return;
    }
    this.app.loading().then((res) => {
      let temp: any = [];
      this.level.users.forEach((element: any) => {
        temp.push({
          id: element,
        });
      });
      this.app.post(`level`, {
        ...this.level,
        users: this.level.users.map((ele: any) => ({ id: ele })),
        supervisor: this.level.supervisor.map((ele: any) => ({ id: ele })),
      }).subscribe({
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
}
