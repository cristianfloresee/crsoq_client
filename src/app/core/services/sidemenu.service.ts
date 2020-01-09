// Angular
import { Injectable, OnInit } from '@angular/core';
// rxjs
import { BehaviorSubject, Observable, throwError } from 'rxjs';
// Constants
import { MENU, MENU_ADMIN } from 'src/app/config/menu';
// Services
import { CourseService } from './API/course.service';
import { SessionService } from './API/session.service';
import { utilService } from './utils.service';
import { WorkspaceService } from './API/workspace.service';
import { EnrollmentService } from './API/enrollments.service';


@Injectable()
export class SidemenuService {

   id_user;

   sidemenuSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
   sidemenu$: Observable<any> = this.sidemenuSubject.asObservable();

   constructor(
      private _courseSrv: CourseService,
      private _sessionSrv: SessionService,
      private _utilSrv: utilService,
      private _workspaces: WorkspaceService,
      private _enrollmentSrv: EnrollmentService
   ) {

   }


   // Actualiza el sidemenu ante un cambio en la variable global 'role'
   changeSidemenuByRole(role: number) {

      console.log(` + changeSidemenuByRole(${role}).`);

      let id_user;
      if(role) {
         id_user = this._sessionSrv.userSubject.value.id_user;
      }


      // Si se selecciono el rol '1' (rol de administrador)
      if (role == 1) this.sidemenuSubject.next(MENU_ADMIN)

      // Si se selecciono el rol '2' (rol de profesor)
      else if (role == 2) {

         // Obtiene los workspaces del profesor
         this._workspaces.getWorkspaces({ id_user: id_user })
            .subscribe(workspaces => {
               // {id_subject, name}
               // Formatea los cursos agrupandolos por asignatura
               //console.log("getWorkspaces(): ", workspaces);

               // Obtiene los cursos del profesor

               this._courseSrv.getCourses({ id_user: id_user })
                  .subscribe((result: any) => {
                     console.log(" + getCourses(", id_user, "): ", result);
                     // Formatea los cursos agrupandolos por asignatura
                     let menu_formatted = this._utilSrv.formatR(workspaces, result.items);

                     this.sidemenuSubject.next(menu_formatted);
                  })
            })
         // Obtengo los cursos creados por el profesor

      }
      else if (role == 3) {
         this._enrollmentSrv.getEnrollmentsByUserId(id_user)
            .subscribe(data => {
               console.log(" + getEnrollmentsByUserId(", id_user, "): ", data);
               let menu_formatted = this._utilSrv.groupCoursesByYears(data);
               console.log("FORMATTED ENROLLMENTS: ", menu_formatted);
               this.sidemenuSubject.next(menu_formatted);
            })
      }
      else this.sidemenuSubject.next(null);
   }



   // changeSidemenu(menu) {
   //    this.sidemenuSubject.next(menu);
   // }

   cleanSidemenu() {
      this.sidemenuSubject.next(null);
   }

   /* [ {
         year: 2017,
         semesters: [
            { semester,
               courses: [
                  { id_course }
               ]
            }
         ]
      }
   ]
   */
   formatStudentMenu(data) {
      return data;
   }
}
