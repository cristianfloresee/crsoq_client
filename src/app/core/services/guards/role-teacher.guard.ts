// Angular
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
// Services
import { SessionService } from '../API/session.service';
// object-path
import * as objectPath from 'object-path';

@Injectable()
export class TeacherGuard implements CanLoad {

   constructor(
      public router: Router,
      public _sessionSrv: SessionService
   ) { }

   canLoad() {

      console.log(" - teacherGuard...");
      let roles = objectPath.get(this._sessionSrv.userSubject.value, 'roles');
      if (roles && roles.length != 0) {
         if (roles.find(role => role == 2)) return true;
         switch (roles[0]) {
            case 1:
               this.router.navigate(['/admin']);
               return false;
            case 3:
               this.router.navigate(['/student']);
               return false;
            default:
               console.log("role-teacher.guard.ts -> login");
               this.router.navigate(['/login']);
               return false;
         }
      }

      console.log("role-teacher.guard.ts -> login");
      this.router.navigate(['/login']);
      return false;

   }

}
