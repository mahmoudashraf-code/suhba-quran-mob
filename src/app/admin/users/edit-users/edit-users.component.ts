import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss'],
})
export class EditUsersComponent {
  user: any;
  types = [
    {
      name: 'مسئول',
      id: 'admin'
    },
    {
      name: 'مشرف',
      id: 'supervisor'
    },
    {
      name: 'الممتحن',
      id: 'examer'
    },
    {
      name: 'مستخدم',
      id: 'user'
    }
  ];
  constructor(
    public modalController: ModalController,
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
      this.hasRequiredKeys(this.user, [
        'name',
        'email',
        'password',
        'phone',
        'type',
      ]) == false
    ) {
      this.app.err('اكمل الحقول');
      return;
    }
    this.app.loading().then((res) => {
      this.app.post(`users`, this.user).subscribe({
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
