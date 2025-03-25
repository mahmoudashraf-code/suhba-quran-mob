import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.page.html',
  styleUrls: ['./organization.page.scss'],
})
export class OrganizationPage implements OnInit {
  data: any;
  constructor(
    public app: AppService
  ) { }
  ngOnInit() {
    this.app.loading().then(res => {
      this.getData();
    })
  }
  getData() {
    this.app.get<any[]>(`organization/${this.app.user?.organization.id}`, 'user-organization').subscribe({
      next: (res: any[]) => {
        if (res) {
          this.data = res
        }
        this.app.loadingController.dismiss();
      },
      error: (err: HttpErrorResponse) => {
        this.app.err(err.error);
        this.app.loadingController.dismiss();
      }
    })
  }
  save() {
    this.app.loading().then((res) => {
      this.app.post(`organization`, this.data).subscribe({
        next: (res) => {
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
