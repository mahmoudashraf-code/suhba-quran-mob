import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { IUser, UserType } from './login/user.interface';
import { Preferences } from '@capacitor/preferences';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  user: IUser | undefined;
  token: string = '';
  connectionConnect: boolean = false
  setting = {
    recitations: 12,
    size: 6.2,
    tafsir: 'ar-tafseer-al-saddi'
  }
  private httpOptions = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
  };
  initHeaders() {
    this.httpOptions = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
    };
  }
  constructor(
    public router: Router,
    public http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    public loadingController: LoadingController
  ) { }
  get<T>(url: string, key: string = '') {
    if (this.connectionConnect == false) {
      return new Observable<T>((observer) => {
        this.toast("لا يوحد اتصال بالانترنت")
        if (key == '') {
          observer.error({});
        } else {
          Preferences.get({ key }).then(res => {
            if (res.value) {
              observer.next(JSON.parse(res.value))
            } else observer.error({});
          })
        }
      })
    }
    return new Observable<T>(observer => {
      this.http.get<T>(`${environment.url}/${url}`, this.httpOptions).subscribe({
        next: (res) => {
          observer.next(res);
          if (key) {
            Preferences.set({
              key,
              value: JSON.stringify(res)
            })
          }
        },
        error: (err) => {
          observer.error(err);
        }
      })
    })
  }
  post<T>(url: string, data: any, key: string = '') {
    if (this.connectionConnect == false) {
      return new Observable<T>((observer) => {
        this.toast("لا يوحد اتصال بالانترنت")
        if (key == '') {
          observer.error({});
        } else {
          Preferences.get({ key }).then(res => {
            if (res.value) {
              observer.next(JSON.parse(res.value))
            } else observer.error({});
          })
        }
      })
    }
    return new Observable<T>(observer => {
      this.http.post<T>(`${environment.url}/${url}`, data, this.httpOptions).subscribe({
        next: (res) => {
          observer.next(res);
          if (key) {
            Preferences.set({
              key,
              value: JSON.stringify(res)
            })
          }
        },
        error: (err) => {
          observer.error(err);
        }
      })
    })
  }
  delete(url: string) {
    return this.http.delete(`${environment.url}/${url}`, this.httpOptions);
  }
  put(url: string, data: any) {
    return this.http.put(
      `${environment.url}/${url}`,
      data,
      this.httpOptions
    );
  }
  logout(navTo: string = 'login') {
    localStorage.clear();
    this.token = '';
    this.user = undefined;
    this.router.navigate([navTo]);
  }
  initDashboard() {
    if (this.user) {
      switch (this.user.type) {
        case UserType.USER:
          this.router.navigate(['user']);
          break;
        case UserType.EXAMER:
          this.router.navigate(['examer']);
          break;
        case UserType.SUPERVISOR:
          this.router.navigate(['supervisor']);
          break;
        case UserType.ADMIN:
          this.router.navigate(['admin']);
          break;
      }
    }
  }
  async err(m: string) {
    if (!m) return
    const alert = await this.alertController.create({
      header: 'تنبيه',
      message: m,
      buttons: ['تمام'],
    });
    await alert.present();
  }
  async toast(m: string) {
    (await this.toastController.create({
      message: m,
      duration: 1500,
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        },
      ],
      position: 'bottom'
    })).present();
  }
  async loading() {
    return (
      await this.loadingController.create({
        message: 'من فضلك انتظر!',
      })
    ).present();
  }
  img(path: string) {
    return `${environment.url}/../file/assets?path=${path}`
  }
  formatToArabicNumeral(number: number) {
    const arabicNumeralFormatter = new Intl.NumberFormat('ar-EG', { useGrouping: false });
    return arabicNumeralFormatter.format(number);
  }
  call(number: string) {
    window.open(`tel:${number}`);
  }
  saveSetting() {
    Preferences.set({ key: "setting", value: JSON.stringify(this.setting) });
  }
}
