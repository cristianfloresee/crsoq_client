// + Vista de ganadores que se utilizará para las 'preguntas' y para las 'actividades'

// Angular
import { Component, OnInit, Input } from '@angular/core';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toaster
import { ToastrService } from 'ngx-toastr';
// Constants
import { TOAST_SUCCESS_UPDATE_WINNERS, TOAST_ERROR_UPDATE_WINNERS } from 'src/app/config/toastr_config';
// Services
import { ActivityParticipationService } from 'src/app/core/services/API/activity_participation.service';
import { UserQuestionClassService } from 'src/app/core/services/API/user_question_class.service';
import { ActivityService } from 'src/app/core/services/API/activity.service';

@Component({
   selector: 'cw-winners',
   templateUrl: './winners.component.html',
   styleUrls: ['./winners.component.scss']
})
export class WinnersComponent implements OnInit {

   @Input() activity;
   @Input() id_course;

   @Input() question;
   @Input() id_class;

   data_students: Array<any>;
   winner_status_request: Array<any> = [];
   add_winners: Array<any> = [];
   delete_winners: Array<any> = [];
   total_winners: number;

   constructor(
      private toastr: ToastrService,
      private activeModal: NgbActiveModal,
      private _activitySrv: ActivityService,
      private _activityParticipationsSrv: ActivityParticipationService,
      private _userQuestionClassSrv: UserQuestionClassService
   ) { }

   ngOnInit() {
      this.getStudents();
   }


   // En vez de obtener las inscripciones
   // necesito obtener los ganadores de la actividad
   getStudents() {

      if (this.activity) {

         // Obtiene a todos los estudiantes ...
         this._activitySrv.getStudentsByActivityID(this.activity.id_activity)
            .subscribe(
               (result: any) => {
                  console.log("students: ", result);
                  this.data_students = this.formatStudentArray(result);
                  console.log("participacion formateada: ", this.data_students);
                  this.getTotalWinners(this.data_students);
               },
               (error) => {
                  console.log("error:", error);
               });

      }
      else if (this.question) {

         let params = {
            id_question: this.question.id_question,
            id_class: this.id_class
         };

         // Obtiene a todos los estudiantes asistentes
         this._userQuestionClassSrv.getStudentAssistants(params)
            .subscribe(
               (result: any) => {
                  console.log("students: ", result);

                  this.data_students = this.formatStudentArray(result);
                  console.log("participacion formateada: ", this.data_students);
                  this.getTotalWinners(this.data_students);
               },
               (error) => {
                  console.log("error:", error);
               });
      }

   }


   /**
    * Crea un estado original de participación para cada registro del array de estudiantes inscritos en el curso
    */
   formatStudentArray(participants: Array<any>) {

      participants.forEach(participation => {
         participation.original_status = participation.status;
      });
      return participants;

   }

   /**
    * Obtiene el total de ganadores a partir del array de participantes
    * @param participants
    */
   getTotalWinners(participants: Array<any>) {

      this.total_winners = 0;
      participants.forEach(item => {
         if (item.status == 5) this.total_winners++;
      });

   }

   // Status: 1:
   changeStudentStatus(student) {
      console.log("student: ", student);

      // Cambia el estado añadido/no añadido
      if (student.status == 1) student.status = 2;
      else student.status = 1;

      // Si el nuevo estado 'added' (añadida/no añadida) es diferente al estado original 'original_added'
      // Si es un nuevo estado entonces debo insertar una petición
      if (student.status != student.original_status) {
         // Si ya estaba añadido entonces corresponde a una eliminación
         if (student.original_status == 2) this.delete_winners.push(student.id_user);
         else this.add_winners.push(student.id_user);
      } else {
         //
         if (student.status == 2) this.deleteFromArray(student.id_user, this.delete_winners);
         else this.deleteFromArray(student.id_user, this.add_winners);
         // Elimina el cambio de estado en el array de peticiones
      }
      console.log("add_question: ", this.add_winners);
      console.log("delete_question: ", this.delete_winners);
   }

   // Corregir esto
   changeWinnerStatus(participation) {
      // Cambia el estado ganador/perdedor
      console.log("PARTICIPATION: ", participation);
      if (participation.status == 1) participation.status = 2;
      else participation.status = 1;

      // Si el nuevo estado 'status' (ganador/perdedor) es diferente al estado original 'original_status'
      if (participation.status != participation.original_status) {
         // Inserta el cambio de estado el el array de peticiones
         this.insertWinnerStatusRequest(participation.id_user, participation.status)
      } else {
         // Elimina el cambio de estado en el array de peticiones
         this.deleteWinnerStatusRequest(participation.id_user)
      }
      this.getTotalWinners(this.data_students);
   }


   insertWinnerStatusRequest(id_user: number, status: number) {

      this.winner_status_request.push({ id_user, status });
      console.log("winner: ", this.winner_status_request);

   }

   deleteWinnerStatusRequest(id_user: number) {

      let index_request = this.winner_status_request.map(i => i.id_user).indexOf(id_user); // Busca el indice de la solicitud en el array de solicitudes
      this.winner_status_request.splice(index_request, 1); // Elimina la solicitud
      console.log("winner: ", this.winner_status_request);

   }

   deleteFromArray(id, array) {
      let index = array.indexOf(id); // Busca el indice de la solicitud en el array de solicitudes
      array.splice(index, 1); // Elimina la solicitud
   }

   /**
    * Actualiza el estado de los participantes
    */
   updateWinners() {

      this._activityParticipationsSrv.updateActivityParticipations(this.activity.id_activity, this.winner_status_request)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_UPDATE_WINNERS.message, TOAST_SUCCESS_UPDATE_WINNERS.title);
            },
            (error) => {
               this.toastr.error(TOAST_ERROR_UPDATE_WINNERS.message, TOAST_ERROR_UPDATE_WINNERS.title);
               console.log("error:", error);
            });

   }

}
