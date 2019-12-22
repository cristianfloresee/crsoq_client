// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Angular router
import { AppRoutingModule } from './app-routing.module';
// Main component
import { AppComponent } from './app.component';
// Angular material
import 'hammerjs';
import { GestureConfig, MatProgressSpinnerModule } from '@angular/material';
// Modules
import { LayoutModule } from './content/layout/layout.module';
import { PartialsModule } from './content/partials/partials.module';
import { CoreModule } from './core/core.module';
import { AuthenticationModule } from './core/authentication/authentication.module';
// ngx-socket-io
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// ngx-echarts
import { NgxEchartsModule } from 'ngx-echarts';
// ngx-toastr
import { ToastrModule } from 'ngx-toastr';
// ngx-sweetalert2
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
// ?
import { LightboxModule } from 'ngx-lightbox';
// ng2-file-upload
import { FileSelectDirective, FileUploadModule } from 'ng2-file-upload';
// ngx-perfect-scrollbar
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
   // suppressScrollX: true
};
// Environment
import { environment } from 'src/environments/environment';
// API Service
import { UserService } from './core/services/API/user.service';
import { CourseService } from './core/services/API/course.service';
import { CalendarService } from './core/services/API/calendar.service';
import { UserQuestionClassService } from './core/services/API/user_question_class.service';
import { StatisticsService } from './core/services/API/statistics.service';
import { SubjectService } from './core/services/API/subject.service';
import { WorkspaceService } from './core/services/API/workspace.service';
import { CategoryService } from './core/services/API/category.service';
import { SubcategoryService } from './core/services/API/subcategory';
import { QuestionService } from './core/services/API/question.service';
import { EnrollmentService } from './core/services/API/enrollments.service';
import { ModuleService } from './core/services/API/module.service';
import { ActivityService } from './core/services/API/activity.service';
import { LessonQuestionService } from './core/services/API/lesson-question.service';
import { SessionService } from './core/services/API/session.service';
import { ActivityParticipationService } from './core/services/API/activity_participation.service';
import { LessonService } from './core/services/API/lesson.service';
//
import { RoleService } from './core/services/role.service';
import { PageService } from './core/services/page.service';
import { SubheaderService } from './core/services/layout/subheader.service';
import { LoaderService } from './core/services/loader.service';
import { SocketService } from './core/services/socket.service';
import { EDataService } from './core/services/edata.service';
// Interceptor
import { InterceptorService } from './core/services/interceptor.service';
// Guards
import { IsLoggedInGuard } from './core/services/guards/is-logged-in.guard';
import { LoginGuard } from './core/services/guards/login.guard';
import { AdminGuard } from './core/services/guards/role-admin.guard';
import { TeacherGuard } from './core/services/guards/role-teacher.guard';
import { StudentGuard } from './core/services/guards/role-student.guard';



//ENTRY COMPONENTS (MODAL)
import { EditUserComponent } from './content/pages/admin/user/edit-user/edit-user.component';
import { CreateUserComponent } from './content/pages/admin/user/create-user/create-user.component';
import { CreateCalendarComponent } from './content/pages/admin/calendar/create-calendar/create-calendar.component';
import { EditCalendarComponent } from './content/pages/admin/calendar/edit-calendar/edit-calendar.component';
import { CreateSubjectComponent } from './content/pages/admin/subject/create-subject/create-subject.component';
import { EditSubjectComponent } from './content/pages/admin/subject/edit-subject/edit-subject.component';

//COMPONENTE INDIVIDUAL
import { YearDatepickerComponent } from './content/pages/admin/calendar/year-datepicker/year-datepicker.component';
import { CreateCourseComponent } from './content/pages/teacher/modals/create-course/create-course.component';
import { CreateCategoryComponent } from './content/pages/teacher/modals/create-category/create-category.component';
import { CreateSubcategoryComponent } from './content/pages/teacher/modals/create-subcategory/create-subcategory.component';
import { CreateQuestionComponent } from './content/pages/teacher/modals/create-question/create-question.component';

import { SidemenuService } from './core/services/sidemenu.service';
import { utilService } from './core/services/utils.service';
import { DeleteCourseComponent } from './content/pages/teacher/modals/delete-course/delete-course.component';
import { CreateModuleComponent } from './content/pages/teacher/modals/create-module/create-module.component';
import { AddStudentComponent } from './content/pages/teacher/courses/config/students/add-student/add-student.component';
import { EditModuleComponent } from './content/pages/teacher/modals/edit-module/edit-module.component';


import { CreateActivityComponent } from './content/pages/teacher/modals/create-activity/create-activity.component';
import { CreateLessonComponent } from './content/pages/teacher/modals/create-lesson/create-lesson.component';
import { EditLessonComponent } from './content/pages/teacher/modals/edit-lesson/edit-lesson.component';
import { UpdateActivityComponent } from './content/pages/teacher/modals/update-activity/update-activity.component';

import { UpdateQuestionComponent } from './content/pages/teacher/modals/update-question/update-question.component';
import { UpdateCategoryComponent } from './content/pages/teacher/modals/modal-category/update-category.component';
import { SubjectInitComponent } from './content/pages/teacher/modals/subject-init/subject-init.component';
import { DualListComponent } from './content/pages/teacher/shared/dual-list/dual-list.component';
import { ModalSubcategoryComponent } from './content/pages/teacher/modals/modal-subcategory/modal-subcategory.component';

import { QuestionSearchComponent } from './content/pages/teacher/modals/question-search/question-search.component';

import { PlayQuestionComponent } from './content/pages/teacher/courses/lessons/play-question/play-question.component';
//import { WebSocketService } from './core/services/websocket.service';

// Web Socket

import { CreateEnrollmentComponent } from './content/pages/student/modals/create-enrollment/create-enrollment.component';
import { UpdateCourseComponent } from './content/pages/teacher/modals/update-course/update-course.component';
import { WinnersComponent } from './content/pages/teacher/modals/winners/winners.component';
import { QuestionSearch2Component } from './content/pages/teacher/courses/questions/question-search2/question-search2.component';

import { PlayQuestion2Component } from './content/pages/student/modals/play-question2/play-question2.component';
import { StudentPointsComponent } from './content/pages/teacher/modals/student-points/student-points.component';



const config: SocketIoConfig = { url: environment.apiUrl, options: {} };

@NgModule({
   declarations: [
      AppComponent,
      CreateUserComponent,
      EditUserComponent,
      CreateCalendarComponent,
      EditCalendarComponent,
      CreateSubjectComponent,
      EditSubjectComponent,
      CreateCourseComponent,
      CreateCategoryComponent,
      CreateSubcategoryComponent,
      CreateQuestionComponent,
      YearDatepickerComponent,
      DeleteCourseComponent,
      CreateModuleComponent,
      AddStudentComponent,
      EditModuleComponent,
      //FileSelectDirective,
      CreateActivityComponent,
      CreateLessonComponent,
      EditLessonComponent,
      UpdateActivityComponent,
      UpdateQuestionComponent,
      UpdateCategoryComponent,
      SubjectInitComponent,
      DualListComponent,
      ModalSubcategoryComponent,
      QuestionSearchComponent,
      PlayQuestionComponent,
      CreateEnrollmentComponent,
      UpdateCourseComponent,
      StudentPointsComponent,
      WinnersComponent,
      QuestionSearch2Component,
      PlayQuestion2Component
   ],
   imports: [
      // Angular
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      SocketIoModule.forRoot(config),
      //BOOTSTRAP
      NgbModule.forRoot(),
      //NGX-TOASTR
      ToastrModule.forRoot({
         timeOut: 10000,
         closeButton: true,
         progressBar: true,
         progressAnimation: 'increasing'
      }),
      SweetAlert2Module.forRoot({
         cancelButtonText: 'Cancelar',
         confirmButtonClass: 'btn btn-success',
         cancelButtonClass: 'btn btn-danger',
         buttonsStyling: false,
      }),
      NgxEchartsModule,
      LightboxModule,
      //ANGULAR MATERIAL
      MatProgressSpinnerModule,
      //MODULOS
      LayoutModule,
      PartialsModule,
      CoreModule,
      AuthenticationModule,
      FileUploadModule
   ],
   providers: [
      {
         provide: PERFECT_SCROLLBAR_CONFIG,
         useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      },
      //INTERCEPTOR
      [
         {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
         }
      ],
      //SERVICIOS
      UserService,
      CourseService,
      CalendarService,
      SubjectService,
      LoaderService,
      RoleService,
      EDataService,
      SessionService,
      ModuleService,
      PageService,
      SubheaderService,
      SocketService,
      CategoryService,
      SubcategoryService,
      QuestionService,
      SidemenuService,
      utilService,
      EnrollmentService,
      ActivityService,
      LessonService,
      ActivityParticipationService,
      WorkspaceService,
      LessonQuestionService,
      UserQuestionClassService,
      StatisticsService,
      //WebSocketService,
      // Guards
      IsLoggedInGuard,
      LoginGuard,
      AdminGuard,
      TeacherGuard,
      StudentGuard
   ],
   entryComponents: [
      // Modals
      CreateUserComponent,
      EditUserComponent,
      CreateCalendarComponent,
      EditCalendarComponent,
      CreateSubjectComponent,
      EditSubjectComponent,
      CreateCourseComponent,
      CreateQuestionComponent,
      CreateCategoryComponent,
      CreateSubcategoryComponent,
      DeleteCourseComponent,
      CreateModuleComponent,
      AddStudentComponent,
      EditModuleComponent,
      CreateActivityComponent,
      CreateLessonComponent,
      EditLessonComponent,
      UpdateActivityComponent,
      UpdateQuestionComponent,
      UpdateCategoryComponent,
      SubjectInitComponent,
      ModalSubcategoryComponent,
      QuestionSearchComponent,
      PlayQuestionComponent,
      CreateEnrollmentComponent,
      UpdateCourseComponent,
      StudentPointsComponent,
      WinnersComponent,
      QuestionSearch2Component,
      PlayQuestion2Component
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
