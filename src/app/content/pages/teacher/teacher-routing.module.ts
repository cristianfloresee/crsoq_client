import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeacherComponent } from './teacher.component';
import { ConfigComponent } from './courses/config/config.component';
import { ActivitiesComponent } from './courses/activities/activities.component';
import { LessonsComponent } from './courses/lessons/lessons.component';
import { StatisticsComponent } from './courses/statistics/statistics.component';
import { QuestionsComponent } from './courses/questions/questions.component';
import { QuestionLibraryComponent } from './subjects/question-library/question-library.component';
import { SubjectConfigComponent } from './subjects/subject-config/subject-config.component';
import { LessonDetailComponent } from './courses/lessons/lesson-detail/lesson-detail.component';



const routes: Routes = [
   {
      path: '',
      component: TeacherComponent,
   },
   {
      path: 'subject/:idSubject/library',
      component: QuestionLibraryComponent
   },
   {
      path: 'subject/:idSubject/config',
      component: SubjectConfigComponent
   },
   {
      path: 'subject/:idSubject/course/:idCourse/lesson',
      children: [
         {
            path: '',
            component: LessonsComponent
         },
         {
            path: ':idLesson',
            component: LessonDetailComponent
         }
      ]
   },
   {
      path: 'subject/:idSubject/course/:idCourse/config',
      component: ConfigComponent
   },
   {
      path: 'subject/:idSubject/course/:idCourse/activities',
      component: ActivitiesComponent
   },
   {
      path: 'subject/:idSubject/course/:idCourse/questions',
      component: QuestionsComponent
   },
   {
      path: 'subject/:idSubject/course/:idCourse/statistics',
      component: StatisticsComponent
   },
   /*{
      path: '**',
      redirectTo: 'course',
      pathMatch: 'full'
      //component: ErrorPageComponent
   },*/
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TeacherRoutingModule { }
