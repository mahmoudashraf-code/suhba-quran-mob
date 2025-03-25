import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import isCenterAlignedPage from './pageUtils';
import groupBy from 'lodash/groupBy';
import { AppService } from 'src/app/app.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TafsirComponent } from './tafsir/tafsir.component';
import { iVoice } from '../audio/audio.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, OnDestroy {
  @Output() openAudio: EventEmitter<iVoice> = new EventEmitter();
  @Output() saveHighlight: EventEmitter<string[]> = new EventEmitter();
  @Output() closeEvent: EventEmitter<null> = new EventEmitter();
  juz_number: number = -1;
  chapter_id: number = -1;
  hizb_number: number = -1;
  isSave: boolean = false;
  size: number = 6.2;
  @Input() selectPage: number = 1;
  @Input() highlight: number[] = [];
  @Input() highlightKeywords: string[] = [];
  @Input() surah: number = -1;
  page: any = [];
  constructor(
    public app: AppService,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) { }

  getPageClass(): string {
    return `_${this.selectPage}`
  }

  isCenterAlignedPage(page: number, line: number = -1) {
    return isCenterAlignedPage(page, line)
  }

  shouldShowChapterHeader(line: any) {
    let arr = line.location.split(":")
    return arr[1] == '1' && arr[2] == '1'
  }

  isHighlight(verse_key: any) {
    if (this.surah == -1) return false
    let arr = verse_key.split(":");
    if (arr[0] != this.surah) return false
    else if (arr[1] >= this.highlight[0] && arr[1] <= this.highlight[1]) {
      return true
    }
    return false
  }

  isSelectKeywords(location: any) {
    return this.highlightKeywords.includes(location)
  }

  async ngOnInit() {
    this.size = this.app.setting.size;
    if (!this.highlightKeywords) {
      this.highlightKeywords = []
      this.isSave = true;
    }
    this.getFont();
    this.getPage(this.selectPage)
  }

  ngOnDestroy(): void {
    if (this.isSave)
      this.saveHighlight.emit(this.highlightKeywords)
  }

  getFont() {
    const font = new FontFace(`p${this.selectPage}-v1`, `url(assets/fonts/quran/p${this.selectPage}.woff2) format("woff2")`);
    font.load().then(loadedFont => {
      document.fonts.add(loadedFont);
      console.log('Font added successfully.');
    }).catch(error => {
      console.error('Failed to load font:', error);
    });
  }

  getPage(page: number) {
    this.app.http.get(`/assets/quran/${page}.json`).subscribe({
      next: (res: any) => {
        this.page = Object.values(this.groupLinesByVerses(res.verses))
        this.hizb_number = res.verses[0].hizb_number;
        this.chapter_id = res.verses[0].chapter_id;
        this.juz_number = res.verses[0].juz_number;
      },
    })
  }

  groupLinesByVerses(verses: any) {
    let words: any[] = [];
    verses.forEach((verse: any) => {
      words = [...words, ...this.getVerseWords(verse, true)];
    });
    const lines = groupBy(words, (word: any) => `Page${word.page_number}-Line${word.line_number}`);
    return lines;
  }

  getVerseWords(verse: any, isReadingView = false) {
    const words: any[] = [];
    verse.words.forEach((word: any) => {
      const wordVerse = { ...verse };
      words.push({
        ...word,
        hizbNumber: verse.hizbNumber,
        ...(isReadingView && { verse: wordVerse }),
      });
    });
    return words;
  };

  surahAudio(surah: string) {
    this.openAudio.emit({ e: 'surah', data: surah })
  }

  async openToolbar(e: Event, word: any) {
    e.stopPropagation()
    const popover = await this.popoverController.create({
      component: ToolbarComponent,
      event: e,
      alignment: "center",
      mode: "ios",
      side: "top"
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (!data) return;
    switch (data) {
      case 'play':
        if (word.audio_url)
          this.openAudio.emit({ e: 'location', data: `https://verses.quran.com/${word.audio_url}` })
        else {
          if (word.char_type_name == 'end') {
            this.openAudio.emit({ e: 'aya', data: word.verse_id })
          }
        }
        break;
      case 'tafsir':
        if (!this.app.connectionConnect) {
          this.app.toast("لا يوحد اتصال بالانترنت")
          return
        }
        (await this.modalController.create({
          component: TafsirComponent,
          backdropBreakpoint: .5,
          cssClass: "dialogPage",
          componentProps: {
            word
          },
        })).present()
        break;
      case 'color':
        setTimeout(() => {
          let i = this.highlightKeywords.indexOf(word.location)
          if (i > -1) this.highlightKeywords.splice(i, 1)
          else this.highlightKeywords.push(word.location)
        }, 0);
        break;
    }
  }
}