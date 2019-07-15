// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API, API_URL } from '../../../config/constants';

@Injectable()
export class ActivityParticipationService {

   constructor(
      public http: HttpClient,
   ) { }

   // Necesito una interface:
   // { status: mode: page: page_size: }
   // getActivities(params) {
   //    return this.http.get(API.ACTIVITIES, { params });
   // }

   // Obtiene las Participaciones en la Actividad
   getActivityParticipation(id_activity) {
      let params = { id_activity }
      return this.http.get(`${API_URL}activity_participation`, { params });
   }

   // // Crea una nueva Actividad
   // createActivity(id_lesson, name, mode) {
   //    return this.http.post(`${API_URL}/activity_participation`, { id_lesson, name, mode });
   // }

   // Actualiza una Participación
   updateActivityParticipation(id_activity, id_user, status: number) {
      return this.http.put(`${API_URL}activity_participation/${id_activity}/${id_user}`, { status });
   }

   // Actualiza múltiples participaciones
   updateActivityParticipations(id_activity, array_participation) {
      return this.http.post(`${API_URL}activity_participation/${id_activity}`, { array_participation });
   }
   // // Elimina una Actividad (eliminaría todas las participaciones de esa actividad)
   // deleteActivity(id_activity) {
   //    return this.http.delete(`${API.ACTIVITIES}/${id_activity}`);
   // }



}
