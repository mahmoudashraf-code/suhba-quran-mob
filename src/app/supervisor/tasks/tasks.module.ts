import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TasksPage } from './tasks.page';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { HistoryComponent } from './history/history.component';
import { ResultComponent } from './result/result.component';
import { CommonModule as myCommonModule } from 'src/app/common/common.module';
import { ExameResultComponent } from './exame-result/exame-result.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    myCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TasksPage
      }
    ])
  ],
  declarations: [TasksPage, UsersComponent, HistoryComponent, ResultComponent, ExameResultComponent]
})
export class TasksPageModule { }
