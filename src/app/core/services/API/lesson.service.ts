// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API_URL } from '../../../config/constants';
import { SocketService } from '../socket.service';

@Injectable()
export class LessonService {

   constructor(
      public http: HttpClient,
      private socketSrv: SocketService
   ) { }

   createLesson(id_module, description, date) {
      return this.http.post(`${API_URL}lessons`, { id_module, description, date })
   }

   // + { id_course }
   getLessonsOptions(params){
      console.log("get lesson options");
      return this.http.get(`${API_URL}lessons/select_options`, { params });
   }

   getLessons(params) {
      // + Necesito una interface:
      // + { id_module, id_course, status, page, page_size }
      return this.http.get(`${API_URL}lessons`, { params });
   }

   getClassById(id_class) {
      return this.http.get(`${API_URL}lessons/${id_class}`);
   }

   updateLesson(id_lesson, id_module, description, date, status) {
      return this.http.put(`${API_URL}lessons/${id_lesson}`, { id_module, description, date, status });
   }

   // Elimina una Clase
   deleteLesson(id_lesson) {
      return this.http.delete(`${API_URL}lessons/${id_lesson}`);
   }

   // Socket.io
   enterToClassSectionRoomAsStudent(params){
      return this.socketSrv.emit('enterToClassSectionRoomAsStudent', params)
   }

   exitToClassSectionRoomAsStudent(params){
      return this.socketSrv.emit('exitToClassSectionRoomAsStudent', params)
   }

   listenClassCreated() {
      return this.socketSrv.listen('classCreated');
   }

   listenClassDeleted(){
      return this.socketSrv.listen('classDeleted');
   }

   listenClassUpdated(){
      return this.socketSrv.listen('classUpdated');
   }

    // Escucha los eventos con Web Socket
    listenClassStartedToStudents() {
      return this.socketSrv.listen('classStarted');
   }
}
