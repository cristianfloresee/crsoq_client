//https://stackoverflow.com/questions/34714462/updating-variable-changes-in-components-from-a-service-with-angular2/34714574
//https://stackoverflow.com/questions/40393703/rxjs-observable-angular-2-on-localstorage-change
//HTTPBACKEND:
// + https://stackoverflow.com/questions/46469349/how-to-make-an-angular-module-to-ignore-http-interceptor-added-in-a-core-module
// + https://github.com/angular/angular/issues/20203
//INTERCEPTOR CON JWT
// + https://ryanchenkie.com/angular-authentication-using-the-http-client-and-http-interceptors

// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
// Constantes
import { API } from '../../../config/constants';
// rxjs
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// Models
import { User } from '../../models/user.model';
// Servicios
import { SocketService } from '../socket.service';

@Injectable()
export class SessionService {

   private httpBackend: HttpClient;
   token: string;
   menu;

   userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
   user$: Observable<User> = this.userSubject.asObservable();

   private _roleSrv: any;

   constructor(
      public router: Router,
      public http: HttpClient,
      public handler: HttpBackend,
      private _socketSrv: SocketService
   ) {
      console.log("se crea session service...");
      this.httpBackend = new HttpClient(handler); // HttpClient que se salta los interceptors
      this.loadStorage();
   }

   //
   changeUser(user: User) {
      console.log("niconi: ", user);
      this.userSubject.next(user);
   }

   // Importa el roleSrv en el SessionSrv evitando el error de dependencia circular
   setRoleService(service) {
      this._roleSrv = service;

   }

   login(email: string, password: string) {

      return this.httpBackend.post(API.LOGIN, { email, password })
         .pipe(
            map((response: any) => {  // { token, user }

               // KIRS: CAMBIE EL ORDEN DE LOS 2 DE ABAJO..
               this.saveStorage(response.user, response.token);
               this.changeUser(response.user);

               // Actualiza el array observable de roles disponibles para el usuario logueado
               this._roleSrv.changeAvailableRoles(response.user.roles);

               //this._socketSrv.initSocket();

               let user = {
                  'id_user': response.user.id_user,
                  'username': response.user.username,
                  'role': response.user.roles[0]
               }

               // Emite evento para añadir al usuario en la lista de logueados en el servidor
               this._socketSrv.emit('loggedInUser', user);
               return user.role;
            })
         );

   }

   // Renueva el token desde el servidor
   private renewToken() {

      return this.http.post(API.RENEW_TOKEN, {})
         .pipe(
            map((response: any) => {
               this.token = response.token;
               localStorage.setItem('token', this.token);
               return true;
            }),
            catchError(error => {
               this.router.navigate(['/login']);
               return throwError(error);
            })
         );

   }

   updateSession() {

      console.log("UPDATE SESION...");
      let token_expired: boolean = true;

      return this.http.post(API.UPDATE_SESSION, { token_expired })
         .pipe(
            map((response: any) => {
               console.log("RESPONSE: ", response);
               // this.token = response.token;
               // //localStorage.setItem('token', response.token);
               // localStorage.setItem('user', response.user); // Para funcionamiento offline


               // let user = {
               //    'id_user': response.user.id_user,
               //    'username': response.user.username,
               //    'role': response.user.roles[0]
               // }

               // // Emite evento para añadir al usuario en la lista de logueados en el servidor
               // //this._socketSrv.emit('loggedInUser', user);
               // //return user.role;

               return true;
            }),
            catchError(error => {
               console.log("catchError en el updateSession...");
               //this.router.navigate(['/login']);
               return throwError(error);
            })
         );
   }

   logout() {

      this.token = '';
      this.router.navigate(['/login']); // Se ejecuta el 'isLoggedGuard'

      setTimeout(() => {
         // Limpia las variables globales
         this.menu = [];
         this.userSubject.next(null);
         this._roleSrv.cleanRoles();

         // Limpia el locastorage
         localStorage.removeItem('token');
         localStorage.removeItem('menu');
         localStorage.removeItem('user');

         this._socketSrv.emit('loggedOutUser');

         // Desconecta socket.io (Con el método de Fernando Herrera no se puede hacer de momento)
         this._socketSrv.offSocket();
      }, 1000);

   }

   getTokenExpiration() {
      if (!this.token) return null;

      let payload = JSON.parse(atob(this.token.split('.')[1])); // Obtiene el payload decodificando base64
      return payload.exp;
   }

   isInvalidToken(token_exp) {
      if (!this.token) return true;
      else return this.isTokenExpirated(token_exp);
   }

   // Carga el 'token' y 'user' desde el localstorage
   loadStorage() {

      console.log(" - loadTokenFromStorage...");
      this.token = localStorage.getItem('token');

      if (this.token) {

         const user = JSON.parse(localStorage.getItem('user'));
         this.userSubject.next(user); // Actualizo los datos de 'user$'

         /*
         let session_loggedin = {
            'id_user': user.id_user,
            'role': user.roles[0]
         }

         // Emite evento para añadir al usuario en la lista de logueados en el servidor
         this._socketSrv.emit('loggedInUser', session_loggedin);*/
      }
      else {
         this.token = '';
         this.userSubject.next(null);
         // Limpia el localstorage?
      }
   }

   saveStorage(user: User, token?: string) {
      console.log(" + saveStorage()")
      //this.changeUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      if (token) {
         localStorage.setItem('token', token);
         this.token = token;
      }
   }

   socketChangeRole(role) {
      console.log("CHANGE ROLE: ", role);
   }

   // Verifica si el token es válido y lo renueva (también obtiene el user)
   verifyAndRenewToken(token_exp: number): Promise<boolean> {

      return new Promise((resolve, reject) => {
         let token_expiration = new Date(token_exp * 1000);
         let now = new Date();

         now.setTime(now.getTime() + (1 * 60 * 60 * 1000)); // Añade una hora adicional

         // Donde hago el emit de inicio de sesion??
         // Si en una hora el token aún no expira no hace nada
         if (token_expiration.getTime() > now.getTime()) resolve(true);
         else {
            // Renueva el token
            this.renewToken()
               .subscribe(
                  () => resolve(true),
                  (error) => {
                     // *handleError(error)
                     this.router.navigate(['/login']);
                     reject(false);
                  });
         }
      });

   }



   // Verifica si el token ha expirado
   isTokenExpirated(token_exp: number): boolean {
      const now = new Date().getTime() / 1000;
      return (token_exp < now) ? true : false;
   }

   getRoles(): Array<number> {
      const user = this.userSubject.value;
      return user ? user.roles : null;
   }

   getUser(): any {
      return this.userSubject.value;
   }

   getIdUser(): any{
      return this.userSubject.value.id_user;
   }

   registerUser(){
      
   }

}
