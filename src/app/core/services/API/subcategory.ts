//ANGULAR
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
export class SubcategoryService {

   constructor(
      public http: HttpClient
   ) { }

   getSubcategories(params) {
      // + Necesito una interface:
      // + { id_user, id_subject, id_category, search, page, page_size }
      return this.http.get(API.SUBCATEGORIES, { params })
   }

   getLastSubcategories(params){
      // Interface: { id_user, page_size }
      return this.http.get(API.SUBCATEGORIES_LAST, { params })
   }

   createSubcategory(id_category, name) {
      return this.http.post(API.SUBCATEGORIES, { id_category, name })
   }

   updateSubcategory(id_subcategory, id_category, name) {
      return this.http.put(`${API.SUBCATEGORIES}/${id_subcategory}`, { id_category, name });
   }

   // Interface: { id_category }
   getSubcategoriesOptions(params) {
      return this.http.get(API.SUBCATEGORIES_AS_SELECT_OPTION, { params });
   }

   deleteSubcategory(id_subcategory) {
      return this.http.delete(`${API.SUBCATEGORIES}/${id_subcategory}`);
   }

}
