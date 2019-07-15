// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API } from '../../../config/constants';
// Services
import { SessionService } from './session.service';
// RxJS
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// Models
import { User } from '../../models/user.model';

@Injectable()
export class UserService {

   constructor(
      public http: HttpClient,
      public _sessionSrv: SessionService,
   ) { }

   createUser(user) {
      console.log("create user service: ", user);
      const { name, last_name, middle_name, document, email, phone, username, password, roles } = user;
      return this.http.post(API.USERS, { name, last_name, middle_name, document, email, phone, username, password, roles });
   }

   updateUser(user, id_user?) {
      const { name, last_name, middle_name, document, email, phone, username, active, add_roles, delete_roles } = user;
      console.log("USER: ", user);
      id_user = id_user || this._sessionSrv.userSubject.value.id_user;
      console.log("ID USER: ", id_user)

      return this.http.put(`${API.USERS}/${id_user}`, { name, last_name, middle_name, document, email, phone, username, active, add_roles, delete_roles })
         .pipe(
            map((response: any) => {
               //this._sessionSrv.saveStorage(response.user);
               //GUARDAR EN EL STORAGE SOLO SI

               return true;
            }),
            catchError(err => {
               console.log("error en el service: ", err)
               return throwError(err);
            })
         );
   }


   //getUsers(from, limit, role?, status?, search?) {
   getUsers(params) {


      //return this.http.get(`${API.USERS}?from=${from}&limit=${limit}${filter}`)
      // + Necesito una interface:
      // + { role, status, search, page, page_size }
      return this.http.get(API.USERS, { params })
   }

   deleteUser(id_user) {
      return this.http.delete(`${API.USERS}/${id_user}`);
   }

   countUser() {
      return this.http.get(`${API.USER_COUNT}`);
   }

   getUsersByCourse(id_course) {
      const params = { id_course };
      return this.http.get(API.USERS, { params })
   }

   getUsersByDocumentId(document, id_course) {
      const params = { document, id_course };
      return this.http.get(`${API.USERS}/students`, { params })
   }

}
