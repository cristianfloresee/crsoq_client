// + Este guard en vez de bloquear la ruta reedirecciona al dashboard si existe una sesión.

// Angular
import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
// Services
import { SessionService } from "../API/session.service";
import { SocketService } from "../socket.service";

@Injectable()
export class IsLoggedInGuard implements CanActivate {

   constructor(
      public router: Router,
      public _sessionSrv: SessionService,
      public _socketSrv: SocketService
   ) { }

   canActivate() {
      console.log(" - IsLoggedInGuard...");

      // + Si el 'login.guard' reedirecciona al '/login' se vuelve a realizar esta acción...
      let token_exp = this._sessionSrv.getTokenExpiration();
      let invalid_token = this._sessionSrv.isInvalidToken(token_exp);

      // Si el token es inválido
      if (invalid_token) {
         localStorage.clear();
         return true;
      }
      else {
         // this._sessionSrv.verifyAndRenewToken(token_exp)
         // .then(()=>{
         //    this.router.navigate(['/']); // Reedirecciona al dashboard
         //    return false;
         // })
         // .catch(()=> true);
         return false;
      }

   }

}
