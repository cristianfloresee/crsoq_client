// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API } from '../../../config/constants';

@Injectable()
export class CategoryService {

   constructor(
      public http: HttpClient
   ) { }

   getLastCategories(params){
      // Interface: { id_user, page_size }
      return this.http.get(API.CATEGORIES_LAST, { params })
   }

   getCategories(params) {
      // + Necesito una interface:
      // + { id_user, id_subject, page, page_size }
      return this.http.get(API.CATEGORIES, { params })
   }

   // Crea una nueva categoría
   createCategory(id_user, id_subject, name) {
      return this.http.post(API.CATEGORIES, { id_user, id_subject, name })
   }

   updateCategory(id_category, id_subject, name) {
      return this.http.put(`${API.CATEGORIES}/${id_category}`, { id_subject, name })
   }

   deleteCategory(id_category) {
      return this.http.delete(`${API.CATEGORIES}/${id_category}`);
   }

   // Interface: { id_user, id_subject }
   getCategoriesOptions(params) {
      return this.http.get(API.CATEGORIES_AS_SELECT_OPTION, { params });
   }
}
