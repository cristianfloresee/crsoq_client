// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Routing
import { AdminRoutingModule } from './admin-routing.module';
// Modules
import { CoreModule } from '../../../core/core.module';
// Components
import { AdminComponent } from './admin.component';
import { SubjectComponent } from './subject/subject.component';
import { UserComponent } from './user/user.component';
import { CalendarComponent } from './calendar/calendar.component';
// ngx-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//ngx-sweetalert2
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

@NgModule({
   imports: [
      CommonModule,
      CoreModule,
      AdminRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      SweetAlert2Module
   ],
   declarations: [
      AdminComponent,
      SubjectComponent,
      UserComponent,
      CalendarComponent
   ],
   providers: [
      NgbActiveModal
   ]
})
export class AdminModule { }
