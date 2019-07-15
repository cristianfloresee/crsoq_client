// + https://github.com/angular/angular/issues/20203

// Angular
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router';
// rxjs
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
// Servicios
import { SessionService } from './API/session.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

   constructor(
      public router: Router,
      public _sessionSrv: SessionService
      ) { }

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // if (SKIP_INTERCEPTOR.some(x => x === req.url)) {
      //    return next.handle(req);
      // }

      const authorization = localStorage.getItem('token');
      if(authorization) req = req.clone({ setHeaders: { authorization } });

      return next.handle(req).pipe(
         tap(event => { }),
         catchError((err) => {

            // Actualiza access token
            // + No necesitamos actualizar el token para algunas solicitudes como el login o el refresh token
            if(req.url == '/login')

            if (err instanceof HttpErrorResponse) {

               // Si el token caducó o es inválido
               if (err.status === 401) {
                  this._sessionSrv.logout();
               }
               // if (err.status == 0) throw ({ error: "Revise su conexión a intenet" })
               // else if (err.status == 404) {
               //     //console.log("El servidor no encuentra la ruta..");
               //     throw ({ error: "Problema de comunicación con nuestros servidores" })
               // }

            }

            return throwError(err);
         })
      );
   }

   // Manejador del error 401
   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

   }

}
