// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//CONSTANTES
import { API } from '../../../config/constants';
import { SocketService } from '../socket.service';

@Injectable()
export class ActivityService {

   constructor(
      public http: HttpClient,
      private socketSrv: SocketService
   ) { }

   // Necesito una interface:
   // { status: mode: page: page_size: }
   getActivities(params) {
      return this.http.get(API.ACTIVITIES, { params });
   }

   getStudentsByActivityID(id_activity){
      let params = { id_activity}
      return this.http.get(`${API.ACTIVITIES}/students`, { params });
   }

   // Crea una nueva Actividad
   createActivity(id_lesson, name, mode) {
      return this.http.post(API.ACTIVITIES, { id_lesson, name, mode });
   }

   // Actualiza una Actividad (arreglar)
   updateActivity(id_activity, id_lesson, name, status, mode, array_participation) {
      return this.http.put(`${API.ACTIVITIES}/${id_activity}`, { id_lesson, name, status, mode, array_participation });
   }

   // Elimina una Actividad (eliminaría todas las participaciones de esa actividad)
   deleteActivity(id_activity) {
      return this.http.delete(`${API.ACTIVITIES}/${id_activity}`);
   }


   enterToActivitySectionRoomAsStudent(params){
      return this.socketSrv.emit('enterToActivitySectionRoomAsStudent', params)
   }

   exitToActivitySectionRoomAsStudent(params){
      return this.socketSrv.emit('exitToActivitySectionRoomAsStudent', params)
   }

   listenActivityCreated() {
      return this.socketSrv.listen('activityCreated');
   }

   listenActivityUpdated(){
      console.log("cuchando activityUpdated");
      return this.socketSrv.listen('activityUpdated');
   }

   listenActivityDeleted(){
      return this.socketSrv.listen('activityDeleted');
   }

    // Escucha los eventos con Web Socket
    listenActivityStartedToStudents() {
      return this.socketSrv.listen('activityStarted');
   }




}
