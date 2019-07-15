// Ver si se puede cambiar el nombre de los componentes
// + Classes2 => Classes
// + Activities2 => Activities
// + Question2 => Question

// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { StudentComponent } from './student.component';
import { Questions2Component } from './questions2/questions2.component';
import { Activities2Component } from './activities2/activities2.component';
import { Classes2Component } from './classes2/classes2.component';

const routes: Routes = [
   {
      path: '',
      component: StudentComponent,
   },
   {
      path: 'course/:idCourse',
      children: [
         {
            // path: 'subject/:idSubject/course/:idCourse/activities',
            path: 'classes',
            component: Classes2Component
         },
         {
            // path: 'subject/:idSubject/course/:idCourse/activities',
            path: 'activities',
            component: Activities2Component
         },
         {
            // path: 'subject/:idSubject/course/:idCourse/questions',
            path: 'questions',
            component: Questions2Component
         }
      ]
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class StudentRoutingModule { }
