// Angular
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
// Services
import { SessionService } from '../API/session.service';
// object-path
import * as objectPath from 'object-path';

@Injectable()
export class AdminGuard implements CanLoad {

   constructor(
      public router: Router,
      public _sessionSrv: SessionService
   ) { }

   canLoad() {

      let roles = this._sessionSrv.getRoles();
      console.log(" - adminGuard: ", roles);

      if (roles && roles.length != 0) {
         if (roles.find(role => role == 1)) return true;
         console.log('+ url bloqued by admin guard.');
         switch (roles[0]) {
            case 2:
               this.router.navigate(['/teacher']);
               return false;
            case 3:
               this.router.navigate(['/student']);
               return false;
            default:
               this.router.navigate(['/login']);
               return false;
         }
      }

      console.log('+ url bloqued by admin guard.');
      this.router.navigate(['/login']);
      return false;

   }

}
