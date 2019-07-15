// + Creo que algunos listeners se pueden reutlizar poniendo un param 'type' que indique a que se refiere

// Angular
import { Component, OnInit, Input, HostListener } from '@angular/core';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// rxjs
import { Subscription } from 'rxjs';
// Services
import { LessonQuestionService } from 'src/app/core/services/API/lesson-question.service';
import { SessionService } from 'src/app/core/services/API/session.service';

@Component({
   selector: 'cw-play-question2',
   templateUrl: './play-question2.component.html',
   styleUrls: ['./play-question2.component.scss'],
})
export class PlayQuestion2Component implements OnInit {

   // ??
   @HostListener('window:beforeunload', ['$event'])
   beforeUnloadHander(event) {
      this.exitToClassSectionRoomAsStudent();
      this.exitToParticipantsToPlayQuestionSectionRoomAsStudent();
   }

   @Input() class;
   subscriptions$: Subscription;

   total_attendes: number = 0;
   data_attendes: Array<any> = [];
   current_user: any; // Estudiante actual
   current_question: any; // Pregunta actual que se está jugando // { difficulty... }
   current_participation_status: number; // Estado de participación actual del estudiante
   counter_ended_question: number = 5; // Contador de finalización de pregunta

   constructor(
      public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private _classQuestionSrv: LessonQuestionService,
      private _sessionSrv: SessionService
   ) { }

   ngOnInit() {
      this.current_user = this._sessionSrv.getUser(); // Obtiene el estudiante actual
      this.subscriptions$ = new Subscription();

      this.enterToClassroomAsStudent(); // Emiter: indica que el estudiante ingreso a la clase

      // Listener: recibe múltiples eventos
      // + type:
      //   [1] actualiza la lista completa de estudiantes en clase (incluyendose)
      //       { type: 1, detail: UPDATE_STUDENT_ATTENDEES, }
      //   [2] actualiza el estado de un estudiante
      //       { type: 2, detail: UPDATE_STUDENT_STATUS, id_user, update_student_status, update_question_status }
      //   x[3] actualiza el estado de la pregunta actual
      //   x[4] indica cuando un estudiante fue seleccionado para responder
      //   [5] indica cuando un estudiante deja la clase
      //       { type: 5, detail: STUDENT_LEFT_CLASS, id_user }
      this.subscriptions$.add(this._classQuestionSrv.listenStudentHasEnteredToClassroom()
         .subscribe((data: any) => {

            console.log("data type: ", data);
            const { type } = data;

            if (type == 2) {

               // Busca al estudiante a actualizar entre los asistentes
               let index_student = this.data_attendes
                  .findIndex((student: any) => student.id_user == data.id_user);
               // Actualiza el estado del estudiante (si lo encuentra)
               if (index_student >= 0) this.data_attendes[index_student]['participation_status'] = data.update_student_status;
               // Actualiza el estado de la participación en clase
               this.current_question.status = data.update_question_status;
               // Actualiza el estado de participación del estudiante (necesario)
               this.current_participation_status = data.update_student_status;

            }
            else if (type == 3) {

               this.current_question = data.question; // Actualiza la pregunta actual

               // Si la pregunta finaliza (status 5)
               if (this.current_question && this.current_question.status == 5) this.finishCurrestQuestion();

            }
            else if (type == 5) {

               // Busca al estudiante que salió de la sala entre los asistentes
               let index_student = this.data_attendes
                  .findIndex((student: any) => student.id_user == data.id_user);
               // Quita al estudiante de entre los asistentes (si lo encuentra)
               if (index_student >= 0) this.data_attendes.splice(index_student, 1);

            }
            else {

               // + Cuando un estudiante entra a la sala recibe todos los estudiantes que ya están en la sala (incluyendose)
               this.data_attendes = data;
               this.total_attendes = data.length;

               // Busca al estudiante actual entre los asistentes
               let current_student = this.data_attendes.find(student => student.id_user == this.current_user.id_user);
               // Establece el estado actual del estudiante (si lo encuentra)
               if (current_student) this.current_participation_status = current_student.participation_status;

               /*
               if(current_student){
                  if(current_student.participation_status == 2) {
                     this.participant_status = true;
                     this.current_participation_status = 2;
                  }
               }*/
            }

         },
            (error) => {
               console.log("error: ", error);
               this.toastr.error(`El estado del estudiante ya se ha registrado.`, `Ha ocurrido un error!`);
            })
      );

      // Listener: indica cuando inicia/detiene/finaliza una pregunta
      this.subscriptions$.add(this._classQuestionSrv.listenPlayingTheClassQuestion()
         .subscribe((data: any) => { // { question: { id_question, difficulty, description, status } }

            console.log("JOMBA: ", data);
            this.current_question = data.question;

            // Si la pregunta finaliza (status 5)
            if (this.current_question && this.current_question.status == 5) {
               this.finishCurrestQuestion();
            }

         })
      );

      // Listener: indica que un estudiante fue seleccionado para responder (question.status 4)
      this.subscriptions$.add(this._classQuestionSrv.listenStudentSelectedToAnswer()
         .subscribe((data: any) => { // { id_user }

            console.log("listenStudentSelectedToParticipate(): ", data);

            //* + Será la mejor forma de tratar esto?
            this.current_question.status = 4; // Actualiza el estado de la pregunta a ''

            // Busca al estudiante seleccionado entre los asistentes
            let index_student = this.data_attendes
               .findIndex((student: any) => student.id_user == data.id_user);
            // Actualiza el estado del estudiante 'seleccionado' (status = 3)
            if (index_student >= 0) this.data_attendes[index_student]['participation_status'] = 3;

            // Comprueba si el estudiante seleccionado corresponde al estudiante de la sesión
            if (data.id_user == this.current_user.id_user) {
               this.current_participation_status = 3; // Actualiza el estado del estudiante actual a 'seleccionado' (status = 3)
               this.toastr.success(`Has sido escogido para responder la pregunta.`, 'Escogido para responder!');
            }

         })
      );

   }

   // Finaliza la pregunta mediante un counter
   finishCurrestQuestion() {
      let interval = setInterval(() => {
         this.counter_ended_question--;
         if (this.counter_ended_question == 0) {
            clearInterval(interval); // Finaliza el interval
            this.current_question = null; // Elimina la pregunta
            this.counter_ended_question = 5; // Reestablece el contador
            // Establece el estado de los estudiantes a 'en espera'
            this.data_attendes.forEach(student => {
               student.participation_status = 1
            });
         }
      }, 1000);
   }

   // Estudiante decide participar en una pregunta
   participateOnQuestion(params) {
      this.enterToParticipantsToPlayQuestionSectionRoomAsStudent();
   }

   // Estudiante decide cancelar su participación
   cancelParticipateOnQuestion() {
      this.exitToParticipantsToPlayQuestionSectionRoomAsStudent();
   }

   // Emiter: indica que el estudiante actual decide participar por responder
   // + Se podría refactorizar este emiter con el de abajo en un updateStudentStatus(new_status: number)
   enterToParticipantsToPlayQuestionSectionRoomAsStudent() {
      this._classQuestionSrv.enterToParticipantsToPlayQuestionSectionRoomAsStudent({
         id_class: this.class.id_class,
         user: this.current_user
      });
      this.current_participation_status = 2; // Actualiza el estado del estudiante a 'desea responder'
   }

   // Emiter: indica que el estudiante actual cancela su participación por responder
   exitToParticipantsToPlayQuestionSectionRoomAsStudent() {
      this._classQuestionSrv.exitToParticipantsToPlayQuestionSectionRoomAsStudent({
         id_class: this.class.id_class,
         id_user: this.current_user.id_user
      });
      this.current_participation_status = 1; // Actualiza el estado del estudiante a 'en espera'
   }

   // Emiter: indica que el estudiante actual ingresó de la sala
   enterToClassroomAsStudent() {
      this._classQuestionSrv.enterToPlayQuestionSectionRoomAsStudent({
         id_class: this.class.id_class,
         user: this.current_user
      });
   }

   // Emiter: indica que el estudiante actual salió de la sala
   exitToClassSectionRoomAsStudent() {
      this._classQuestionSrv.exitToPlayQuestionSectionRoomAsStudent({
         id_class: this.class.id_class,
         id_user: this.current_user.id_user
      });
   }

   ngOnDestroy() {
      this.exitToClassSectionRoomAsStudent(); // Emiter: indica que el estudiante actual salió de la sala
      this.subscriptions$.unsubscribe(); // Cancela todas las subcripciones (listeners)
   }

}
