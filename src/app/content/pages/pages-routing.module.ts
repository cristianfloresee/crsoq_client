// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
// Components
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './header/profile/profile.component';
// Guards
import { LoginGuard } from '../../core/services/guards/login.guard';
import { IsLoggedInGuard } from 'src/app/core/services/guards/is-logged-in.guard';
import { AdminGuard } from '../../core/services/guards/role-admin.guard';
import { TeacherGuard } from '../../core/services/guards/role-teacher.guard';
import { StudentGuard } from 'src/app/core/services/guards/role-student.guard';

const PAGES_ROUTES: Routes = [
   {
      path: '',
      component: PagesComponent,
      canActivate: [LoginGuard],
      children: [
         {
            path: 'admin', canLoad: [AdminGuard], loadChildren: './admin/admin.module#AdminModule', data: { breadcrumb: 'Admin' }
         },
         {
            path: 'teacher', canLoad: [TeacherGuard], loadChildren: './teacher/teacher.module#TeacherModule', data: { breadcrumb: 'Profe' }
         },
         {
            path: 'student', canLoad: [StudentGuard], loadChildren: './student/student.module#StudentModule', data: { breadcrumb: 'Estu' }
         },
         { path: '', redirectTo: 'admin', pathMatch: 'full' },
         // {
         // 	path: '',
         // 	loadChildren: './dashboard/dashboard.module#DashboardModule'
         // },
         {
            path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Perfil' }
         }
      ]
   },
   {
      path: 'login',
      loadChildren: './auth/auth.module#AuthModule',
      canActivate: [IsLoggedInGuard]
   },
   /*{
      path: 'error',
      //component: ErrorPageComponent
   },*/
];

@NgModule({
   imports: [RouterModule.forChild(PAGES_ROUTES)],
   exports: [RouterModule]
})
export class PagesRoutingModule { }
