//ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//CONSTANTES
import { API } from '../../../config/constants';
//SERVICIOS
import { SessionService } from './session.service';
import { SocketService } from '../socket.service';


@Injectable()
export class EnrollmentService {

   constructor(
      public http: HttpClient,
      private socketSrv: SocketService
   ) { }

   // Obtiene las matrículas por id_course
   getEnrollmentsByCourseId(id_course) {
      return this.http.get(`${API.ENROLLMENTS}/courses/${id_course}`);
   }

   getEnrollmentsByUserId(id_user){
      return this.http.get(`${API.ENROLLMENTS}/users/${id_user}`);
   }

   // params: {id_ocurse?, id_user?}
   /*getEnrollments(params) {
      return this.http.get(API.ENROLLMENTS, { params });
   }*/

   createEnrollment(id_course, id_user) {
      return this.http.post(API.ENROLLMENTS, { id_course, id_user });
   }

   changeStatusEnrollment(id_course, id_user, active) {
      return this.http.put(`${API.ENROLLMENTS}/${id_course}/${id_user}`, { active });
   }

   deleteEnrollment(id_course, id_user) {
      return this.http.delete(`${API.ENROLLMENTS}/${id_course}/${id_user}`);
   }

   // Escucha los eventos con Web Socket
   listenEnrollments() {
      return this.socketSrv.listen('studentEnrolled');
   }


   listenEnrollmentDeleted(){
      return this.socketSrv.listen('studentEnrollmentDeleted');
   }

   // params: {id_course, id_user}
   enterToCourseRoom(params){
      return this.socketSrv.emit('enterToCourseRoom', params)
   }

   exitToCourseRoom(params){
      return this.socketSrv.emit('exitToCourseRoom', params)
   }

}
