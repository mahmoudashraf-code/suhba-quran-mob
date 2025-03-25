import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Network } from '@capacitor/network';
import { StatusBar } from '@capacitor/status-bar';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { StartPage } from './start/start.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private app: AppService,
    public modalController: ModalController
  ) {}
  async ngOnInit() {
    Preferences.get({ key: 'start-done' }).then(async (res) => {
      if (!res.value) {
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
    });
    try {
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    } catch (err) {}
    Preferences.get({ key: 'setting' }).then((res) => {
      if (res.value) {
        this.app.setting = JSON.parse(res.value);
      }
    });
    this.app.connectionConnect = (await Network.getStatus()).connected;
    Network.addListener('networkStatusChange', (status) => {
      this.app.connectionConnect = status.connected;
    });
  }
}
