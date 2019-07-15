// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Routing
import { TeacherRoutingModule } from './teacher-routing.module';
// Core Module
import { CoreModule } from 'src/app/core/core.module';
// ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// ngx-echarts
import { NgxEchartsModule } from 'ngx-echarts';
// ngx-sweetaert2
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
// Components
import { TeacherComponent } from './teacher.component';

// Courses Components
import { ActivitiesComponent } from './courses/activities/activities.component';
import { LessonsComponent } from './courses/lessons/lessons.component';
import { QuestionsComponent } from './courses/questions/questions.component';
import { StatisticsComponent } from './courses/statistics/statistics.component';
// Config Courses Components
import { ConfigComponent } from './courses/config/config.component';
import { GeneralComponent } from './courses/config/general/general.component';
import { ModulesComponent } from './courses/config/modules/modules.component';
import { StudentsComponent } from './courses/config/students/students.component';

// Subject Components
import { QuestionLibraryComponent } from './subjects/question-library/question-library.component';
// Config Subjects Components
import { SubjectConfigComponent } from './subjects/subject-config/subject-config.component';
import { CategoriesComponent } from './subjects/subject-config/categories/categories.component';
import { SubcategoriesComponent } from './subjects/subject-config/subcategories/subcategories.component';
import { LessonDetailComponent } from './courses/lessons/lesson-detail/lesson-detail.component';
import { Courses2Component } from './subjects/subject-config/courses2/courses2.component';

@NgModule({
   imports: [
      NgxEchartsModule,
      NgbModule,
      CommonModule,
      CoreModule,
      TeacherRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      SweetAlert2Module
   ],
   declarations: [
      TeacherComponent,
      ConfigComponent,
      ModulesComponent,
      StudentsComponent,
      GeneralComponent,
      ActivitiesComponent,
      QuestionsComponent,
      StatisticsComponent,
      LessonsComponent,
      QuestionLibraryComponent,
      SubjectConfigComponent,
      CategoriesComponent,
      SubcategoriesComponent,
      LessonDetailComponent,
      Courses2Component,
   ]
})
export class TeacherModule { }
