// Angular
import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
// Services
import { SessionService } from "../API/session.service";

@Injectable()
export class LoginGuard implements CanActivate {

   constructor(
      public router: Router,
      public _sessionSrv: SessionService,
   ) { }

   canActivate() {
      console.log(" - loginGuard");

      let token_exp = this._sessionSrv.getTokenExpiration();
      let invalid_token = this._sessionSrv.isInvalidToken(token_exp);
      console.log("invalid token: ", invalid_token);

      if (invalid_token) {
         console.log('+ url bloqued by login guard.');
         this.router.navigate(['/login']);
         return false;
      }
      else {
         this._sessionSrv.verifyAndRenewToken(token_exp)
         .then(()=>{
            // Aquí hago el emit...
            return true;
         })
         .catch(()=> false)
         //then true
         //catch false pero internamente hace reedireccion al login


         return true;
      }

   }

}
