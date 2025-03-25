import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

@Component({
  selector: 'app-result-tour-final',
  templateUrl: './result-tour-final.component.html',
  styleUrls: ['./result-tour-final.component.scss'],
})
export class ResultTourFinalComponent implements OnInit {
  id: string = '';
  levels: string[] = []
  score: any = []
  days: number = -1
  result: any = {
    'A': 'امتياز',
    'B': 'جيد جدا',
    'C': 'جيد',
    'D': 'مقبول',
    'F': 'اعادة',
    'W': 'جاري',
    'G': 'غائب',
  }
  options: any = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    locale: 'ar-EG',
  };

  examDates: string[] = [];

  constructor(
    public modalController: ModalController,
    public app: AppService,
  ) { }

  ngOnInit() {
    this.getData()
  }

  getScore(score: number) {
    return (score / this.days) * 100
  }

  date(date: string) {
    return new Intl.DateTimeFormat('ar-EG', this.options).format(
      new Date(date)
    );
  }

  getData() {
    this.app.loading().then(res => {
      this.app.get<any>(`level/result/${this.id}`, 'result-tour').subscribe({
        next: ({ score, days, status }) => {
          this.score = score;
          this.days = days;
          if (status == 'completed') {
            this.levels = ['المستوي الاول', 'المستوي الثاني', 'المستوي الثالث']
          }
          setTimeout(() => {
            new Swiper('.swiper', {
              modules: [Pagination],
              pagination: {
                el: ".swiper-pagination",
              }
            });
          }, 0);
          this.score.sort((a: any, b: any) => b.score - a.score)
          this.app.loadingController.dismiss();
          this.processData()
        },
        error: (err: HttpErrorResponse) => {
          this.app.err(err.error);
          this.app.loadingController.dismiss();
        }
      })
    })
  }

  processData(): void {
    this.score.forEach((student: any) => {
      student.exame.forEach((exam: any) => {
        if (!this.examDates.includes(exam.created_at.slice(0, 10))) {
          this.examDates.push(exam.created_at.slice(0, 10));
        }
      });
      student.history.forEach((history: any) => {
        if (!this.examDates.includes(history.date.slice(0, 10))) {
          this.examDates.push(history.date.slice(0, 10));
        }
      });
    });
    this.examDates.sort();
  }

  getGradeForDate(student: any, date: string): string {
    const exam = student.exame.find((e: any) => e.created_at.slice(0, 10) === date);
    const history = student.history.find((e: any) => e.date.slice(0, 10) === date);
    return exam ? exam.result : history ? history.result : 'G';
  }
}
