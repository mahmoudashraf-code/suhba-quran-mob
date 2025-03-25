import { Component, ViewChild } from '@angular/core';
import recitations from './recitations.json'
import { IonSelect } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent {
  recitations = recitations;
  @ViewChild('mySelect', { static: false }) selectRef: IonSelect | undefined;
  show: boolean = false;
  play: boolean = false;
  ele?: HTMLAudioElement;
  data?: iVoice;
  progress = 0;
  constructor(
    public app: AppService
  ) { }
  audioFuns() {
    return {
      increase: () => {
        if (this.ele)
          this.ele.currentTime += 10;
      },
      decrease: () => {
        if (this.ele)
          this.ele.currentTime -= 10;
      },
      pausePlayAudio: (key: 'play' | 'pause') => {
        this.ele?.[key]();
      },
      stopAudio: (e?: Event) => {
        if (e)
          e.stopPropagation();
        this.ele?.pause();
        this.show = false
      }
    }
  }
  runAudio(data: iVoice) {
    if (!this.app.connectionConnect) {
      this.app.toast("لا يوحد اتصال بالانترنت")
      return
    }
    this.data = data;
    switch (data.e) {
      case 'aya':
        this.app.http.get<any>(`https://api.quran.com/api/v4/recitations/${this.app.setting.recitations}/by_ayah/${data.data}`).subscribe({
          next: (value: any) => {
            if (value.audio_files.length > 0) {
              let url: string = value.audio_files[0].url
              this.open(url.startsWith('//') ? url : `https://verses.quran.com/${url}`)
            }
          },
          error: () => {
            this.app.err("غير موجود")
          }
        })
        break;
      case 'location':
        this.open(data.data)
        break;
      case 'surah':
        this.app.http.get<any>(`https://api.quran.com/api/v4/chapter_recitations/${this.app.setting.recitations}/${data.data}`).subscribe({
          next: (value: any) => {
            if (value.audio_file && value.audio_file.audio_url) {
              this.open(value.audio_file.audio_url)
            }
          },
          error: () => {
            this.app.err("غير موجود")
          }
        })
        break;
    }
  }
  open(url: string) {
    this.show = true;
    if (!this.ele) {
      this.ele = new Audio(url)
      this.ele.ontimeupdate = (ev) => {
        let ele: any = this.ele
        this.progress = ele.currentTime / ele.duration;
      }
      this.ele.onplay = () => {
        this.play = true;
      }
      this.ele.onpause = () => {
        this.play = false;
      }
    } else this.ele.src = url;
    this.ele.play()
  }
  changeVoice(){
    this.app.saveSetting();
    if(this.data)
      this.runAudio(this.data)
  }
}

export interface iVoice {
  e: string;
  data: string
}
