// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constantes
import { API } from '../../../config/constants';

@Injectable()
export class UserQuestionClassService {

   constructor(
      public http: HttpClient,
   ) { }

   /**
    * Obtiene los estudiantes que asistieron a la clase
    * @param params // params: { id_question, id_class }
    */
   getQuestionParticipation(params) {
      return this.http.get(API.USER_QUESTION_CLASS, { params });
   }

   updateStudentsParticipation(id_user, id_class, update_status_requests ){
      return this.http.post(`${API.USER_QUESTION_CLASS}/${id_user}/${id_class}`, { update_status_requests });
   }

}
