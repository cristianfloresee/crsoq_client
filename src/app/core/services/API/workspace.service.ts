// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//CONSTANTES
import { API } from '../../../config/constants';
//SERVICIOS
import { SessionService } from './session.service';
//RXJS
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class WorkspaceService {

   constructor(
      public http: HttpClient
   ) { }


   // + { id_course }
   getLessonsOptions(params) {
      console.log("get lesson options");
      //return this.http.get(`${API_URL}lessons/select_options`, { params });
   }

   getWorkspaces(params) {
      // + Necesito una interface:
      // + { id_user }
      console.log("get workspaces");
      return this.http.get(API.WORKSPACES, { params });
   }

   createLesson(id_module, description, date) {
      //return this.http.post(`${API_URL}lessons`, { id_module, description, date })
   }

   updateWorkspaces(id_user, add_workspaces, delete_workspaces) {
      return this.http.post(`${API.WORKSPACES}`, { id_user, add_workspaces, delete_workspaces });
   }

   // Elimina una Clase
   deleteLesson(id_lesson) {
      //return this.http.delete(`${API_URL}lessons/${id_lesson}`);
   }
}
