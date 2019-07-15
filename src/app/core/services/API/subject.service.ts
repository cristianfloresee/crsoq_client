//ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//CONSTANTES
import { API } from '../../../config/constants';
//SERVICIOS
import { SessionService } from './session.service';
import { map, catchError } from 'rxjs/operators';
// //RXJS
// import { Observable, throwError } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';

// //MODELOS
// import { User } from '../../models/user.model';

@Injectable()
export class SubjectService {

   constructor(
      public http: HttpClient,
      public _sessionSrv: SessionService,
   ) { }

   // Interface: { search, page, page_size}
   getSubjects(params) {
      return this.http.get(API.SUBJECTS, { params })
   }

   // Interface: { id_user }
   getSubjectsOptions(params?) {
      return this.http.get(API.SUBJECTS_AS_SELECT_OPTION, { params });
   }

   createSubject(subject) {
      const { name } = subject;
      return this.http.post(API.SUBJECTS, { name });
   }

   updateSubject(subject, id_subject) {
      const { name } = subject;
      return this.http.put(`${API.SUBJECTS}/${id_subject}`, { name });
   }

   deleteSubject(id_subject) {
      return this.http.delete(`${API.SUBJECTS}/${id_subject}`);
   }

   countSubject() {
      return this.http.get(`${API.SUBJECT_COUNT}`);
   }
}
