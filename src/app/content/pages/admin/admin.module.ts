//ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//ROUTING
import { AdminRoutingModule } from './admin-routing.module';
//MODULOS
import { CoreModule } from '../../../core/core.module';
//COMPONENTES
import { AdminComponent } from './admin.component';
import { SubjectComponent } from './subject/subject.component';
import { UserComponent } from './user/user.component';
import { CalendarComponent } from './calendar/calendar.component';
//NGX-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
