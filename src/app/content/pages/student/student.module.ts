// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Components

import { CoreModule } from '../../../core/core.module';
// Routing
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { Activities2Component } from './activities2/activities2.component';
import { Classes2Component } from './classes2/classes2.component';
import { Questions2Component } from './questions2/questions2.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
   imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      CoreModule,
      StudentRoutingModule,
   ],
   declarations: [
      StudentComponent,
      Activities2Component,
      Classes2Component,
      Questions2Component,

   ]
})
export class StudentModule { }

