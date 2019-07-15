// Angular
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
// Services
import { SessionService } from '../API/session.service';
// objetc-path
import * as objectPath from 'object-path';

@Injectable()
export class StudentGuard implements CanLoad {

   constructor(
      public router: Router,
      public _sessionSrv: SessionService
   ) { }

   canLoad() {

      console.log(" - studentGuard...");
      let roles = objectPath.get(this._sessionSrv.userSubject.value, 'roles');
      if (roles && roles.length != 0) {
         if (roles.find(role => role == 3)) return true;
         switch (roles[0]) {
            case 1:
               this.router.navigate(['/admin']);
               return false;
            case 2:
               this.router.navigate(['/teacher']);
               return false;
            default:
               this.router.navigate(['/login']);
               return false;
         }
      }

      console.log("role-student.guard.ts -> login");
      this.router.navigate(['/login']);
      return false;

   }

}
