//ANGULAR
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
// COMPONENTES
import { AdminComponent } from './admin.component';
import { SubjectComponent } from './subject/subject.component';
import { UserComponent } from './user/user.component';
import { CalendarComponent } from './calendar/calendar.component';
//GUARDS

const routes: Routes = [
   { path: '', component: AdminComponent },
   { path: 'subject', component: SubjectComponent, data: { breadcrumb: 'Asignaturas' } },
   { path: 'user', component: UserComponent, data: { breadcrumb: 'Usuarios' } },
   { path: 'calendar', component: CalendarComponent, data: { breadcrumb: 'Calendario' } }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class AdminRoutingModule { }
