// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API, API_URL } from '../../../config/constants';
// Services
import { SessionService } from './session.service';
// RxJS
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ModuleService {

   constructor(
      private http: HttpClient
   ) { }

   getModulesByCourseId(id_course) {
      let params = { id_course };
      return this.http.get(API.MODULES, { params });
   }

   // + { id_course }
   getModulesOptions(params) {
      console.log("get lesson options");
      return this.http.get(`${API_URL}modules/select_options`, { params });
   }

   createModule(name, id_course) {
      return this.http.post(API.MODULES, { name, id_course });
   }

   deleteModule(id_module) {
      return this.http.delete(`${API.MODULES}/${id_module}`);
   }

   updateModule(id_module, name) {
      return this.http.put(`${API.MODULES}/${id_module}`, { name });
   }

}
