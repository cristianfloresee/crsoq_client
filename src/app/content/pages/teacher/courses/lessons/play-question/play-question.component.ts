// + Se podrían poner más emiters por si el profesor tuviera 2 sesiones iniciadas al mismo tiempo y desea ver los cambios

// Angular
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetalert2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { SWAL_SUCCESS_DELETE_PARTICIPATION, SWAL_DELETE_PARTICIPATION } from 'src/app/config/swal_config';
// Services
import { LessonQuestionService } from 'src/app/core/services/API/lesson-question.service';
import { UserQuestionClassService } from 'src/app/core/services/API/user_question_class.service';
import { EChartOption } from 'echarts';

@Component({
   selector: 'cw-play-question',
   templateUrl: './play-question.component.html',
   styleUrls: ['./play-question.component.scss']
})
export class PlayQuestionComponent implements OnInit, OnDestroy {

   @Input() question;
   @Input() id_lesson;

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   SWAL_DELETE_PARTICIPATION = SWAL_DELETE_PARTICIPATION;
   SWAL_SUCCESS_DELETE_PARTICIPATION = SWAL_SUCCESS_DELETE_PARTICIPATION;

   subscriptions$: Subscription;
   data_participants: Array<any> = [];
   participants_filtered: Array<any> = [];

   participation_status;

   update; // Indica si se actualizo el estado de la clase??

   student_selected = null; // Actual estudiante seleccionado para responder
   current_question_status: number; // Estado de la pregunta actual
   counter_ended_question: number = 5; // Contador de finalización de pregunta
   interval_ended_question;

   // Variables para el resumen
   data_students: Array<any>;
   total_winners: number;

   // Echart
   option: any;
   update_options: any;
   data;

   // Overview
   overview = {
      values: {
         'participan': 0,
         'no participan': 0,
         'no seleccionados': 0,
         'perdedores': 0,
         'ganadores': 0,
         'total': 0
      },
      children: {
         'participan': [],
         'no participan': [],
         'no seleccionados': [],
         'perdedores': [],
         'ganadores': [],
         'total': []
      }
   };

   constructor(
      public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private _classQuestionSrv: LessonQuestionService,
      private _userQuestionClassSrv: UserQuestionClassService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.current_question_status = this.question.status; // Establece la pregunta actual

      if (this.current_question_status == 5) {
         this.getParticipationOverview();
      }

      this.enterToPlayQuestionSectionRoomAsTeacher(); // Emiter: indica que el profesor ingresó a la sala

      // Listener: recibe múltiples eventos
      // + type:
      //   [1] actualiza la lista completa de estudiantes participantes
      //       { type: 1, detail: UPDATE_STUDENT_PARTICIPANTS, participantes: [ ... ] }
      //   [2] indica cuando un estudiante decide participar
      //       { type: 2, detail: NEW_STUDENT_PARTICIPANT, student: { id_user, ... } }
      //   [3] indica cuando el profesor cancela la selección del estudiante para responder
      //       { type: 3, detail: CANCEL_STUDENT_SELECTED, id_user, question_status }
      //   [4] indica cuando un estudiante cancela su participación
      //       { type: 4, detail: CANCEL_STUDENT_PARTICIPATION, id_user }
      this.subscriptions$.add(this._classQuestionSrv.listenAStudentHasEnteredToParticipate()
         .subscribe((data: any) => {

            const { type } = data;

            console.log("data event: ", data);

            // { type: 'selected', user: {...} }

            // Como marcar al estudiante seleccionado...
            // { participant_selected: 3, data_participants: [] }
            // if(Array.isArray(data)){
            //    this.data_participants = data;
            // }

            if (type == 1) {
               this.data_participants = data.participants;
               this.filterStudentsByStatus(2); // Filtrar solo estudiantes en estado 'no seleccionado'
               // Busca al estudiante seleccionado entre los participantes (si es que hay)
               let index_selected = this.data_participants.findIndex(participant => participant.status == 3);
               // Establece el estudiante seleccionado (si lo encuentra)
               if (index_selected >= 0) this.student_selected = this.data_participants[index_selected];

            }
            else if (type == 2) {

               const { student } = data;
               // Busca al nuevo participante entre los participantes actuales
               let student_exist = this.data_participants.findIndex(participant => participant.id_user == student.id_user);
               // Lo agrega a la lista de participantes (si no lo encuentra)
               if (student_exist < 0) this.data_participants.push(student);
               this.filterStudentsByStatus(2); // Filtrar solo estudiantes en estado 'no seleccionado'

            }
            else if (type == 3) {

               if (this.student_selected && (this.student_selected.id_user == data.id_user)) {
                  this.student_selected = null; // Cancela al estudiante seleccionado
                  this.question.status = data.question_status;
               }

            }
            else if (type == 4) {

               // Busca al estudiante que canceló su participación entre los participantes
               let index_student = this.data_participants.findIndex(participant => participant.id_user == data.id_user);
               // Elimina al estudiantes de la lista de participantes (si lo encuentra)
               if (index_student >= 0) this.data_participants.splice(index_student, 1);
               this.filterStudentsByStatus(2); // Filtrar solo estudiantes en estado 'no seleccionado'

               // Cancela al estudiante seleccionado si es el mismo que canceló su participación
               //if (this.student_selected && (id_user == this.student_selected.id_user)) this.student_selected = null;

            }

            // else if (data.student_selected) {
            //    this.student_selected = data.student_selected;
            // }

            //this.toastr.info(`Ha sido iniciada una pregunta para la asignatura ${data.subject}.`, 'Pregunta Iniciada!');
         })
      );

   }

   initializeChartOptions() {

      let legend_data = [];
      let series_data = [];
      let selected = {};

      console.log("overview: ", this.overview);
      for (let item in this.overview.values) {
         legend_data.push(item);
         series_data.push({
            name: item,
            value: this.overview.values[item]
         });
         selected[item] = this.overview.values[item] > 0;
      }

      
      // Naranja
      const red1 = {
         color: '#BC5631'
      };
      // Azul
      const blue1 = {
         color: '#37628B'
      };
      const blue2 = {
         color: '#49739E'
      };
      const blue3 = {
         color: '#5987B1'
      };
      const blue4 = {
         color: '#6D9BC2'
      };


      //> Set real data
      const data = [{
         name: 'Estudiantes',
         children: [
            {
               name: 'participan',
               value: this.overview.values['participan'],
               itemStyle: blue1,
               children: [
                  {
                     name: 'ganador',
                     value: this.overview.values['ganadores'],
                     itemStyle: blue2,
                     children: this.overview.children['ganadores']
                  },
                  {
                     name: 'perdedores',
                     value: this.overview.values['perdedores'],
                     itemStyle: blue3,
                     children: this.overview.children['perdedores']
                  },
                  {
                     name: 'no seleccionados',
                     value: this.overview.values['no seleccionados'],
                     itemStyle: blue4,
                     children: this.overview.children['no seleccionados']
                  }
               ]
            },
            {
               name: 'no participan',
               value: this.overview.values['no participan'],
               itemStyle: red1,
               children: this.overview.children['no participan']
            }
         ]
      }];

      // Echart Options
      this.option = {
         title: {
            text: this.question.description,
            subtext: 'Gráfico de Participación',
            textStyle: {
               fontSize: 14,
               align: 'center'
            },
            subtextStyle: {
               align: 'center'
            }
         },
         series: {
            type: 'sunburst',
            highlightPolicy: 'ancestor',
            data: data,
            radius: ['20%', '100%'],
            label: {
               rotate: 'radial', // number (90 a -90), 'radial', 'tange',
               fontWeight: 600,
               //minAngle: //Oculta label si es un pequeño el angulo (en grados)
            },
            downplay: {
               itemStyle: {
                  opacity: 0.3
                  // Elementos que no pertenecen a la selección (hacer que se mantenga el color pero se aclare)
               }
            },
            levels: [
               {},
               {
                  label: {
                     rotate: 'tangential'
                  }
               },
               {
                  label: {
                     rotate: 'tangential'
                  }
               },
               {
                  label: {
                     rotate: 'tangential'
                  }
               }
            ],
            itemStyle: {
               color: '#ddd',
               borderWidth: 3
            }
         },
         tooltip: {
            trigger: 'item',
            axisPointer: {
               type: 'shadow'
            },
            formatter: "{b}: {c}"
         }
      }
   }

   getParticipationOverview() {
      const params = {
         id_question: this.question.id_question,
         id_class: this.id_lesson
      };

      // Obtiene todos los estudiantes del curso
      this._userQuestionClassSrv.getQuestionParticipation(params)
         .subscribe(
            (result: any) => {
               console.log("students: ", result);

               this.data_students = result;
               //console.log("participacion formateada: ", this.data_students);
               this.getTotalWinners(this.data_students);
               this.initializeChartOptions();
            },
            (error) => {
               console.log("error:", error);
            });
   }

   // Actualiza el estado de la pregunta actual
   updateClassQuestionStatus(status: number) {

      this._classQuestionSrv.updateLessonQuestion(this.id_lesson, this.question.id_question, status)
         .subscribe(
            (result: any) => {
               if (!result) {
                  this.toastr.error('Asegúrate de no tener otra pregunta iniciada.', 'Ha ocurrido un error!');
               }
               else {
                  this.question.status = status;

                  if (status == 1) { // Si la pregunta se reinicia (status 'no iniciada')
                     this.data_participants = [];
                     this.participants_filtered = [];
                  }
                  else if (status == 5) {
                     this.getParticipationOverview();
                  }

                  this.toastr.success('El estado de la clase ha sido actualizado correctamente.', 'Acción realizada!');
               }
            },
            (error) => {
               console.log("error:", error);
            });
   }

   // Emiter: indica que el profesor ingresó a la sala
   enterToPlayQuestionSectionRoomAsTeacher() {
      this._classQuestionSrv.enterToPlayQuestionSectionRoomAsTeacher({ id_class: this.id_lesson });
   }

   // Emiter: indica que el profesor salió de la sala
   exitToPlayQuestionSectionRoomAsTeacher() {
      this._classQuestionSrv.exitToPlayQuestionSectionRoomAsTeacher({ id_class: this.id_lesson });
   }

   cancelWinner(participant) {
      clearInterval(this.interval_ended_question); // Finaliza el interval
      this.counter_ended_question = 5; // Reestablece el contador
      participant.status = 3;
   }

   setWinnerParticipant(participant) {
      participant.status = 5;
      this.interval_ended_question = setInterval(() => {
         this.counter_ended_question--;
         if (this.counter_ended_question == 0) {
            clearInterval(this.interval_ended_question); // Finaliza el interval
            this.updateParticipantStatus(participant, 5);
            this.counter_ended_question = 5; // Reestablece el contador
         }
      }, 1000);
   }

   updateParticipantStatus(participant, status) {

      this._classQuestionSrv.e_UpdateParticipantStatus({
         id_user: participant.id_user,
         id_class: this.id_lesson,
         id_question: this.question.id_question,
         status: status,
         sender: 'TEACHER'
      });

      // Actualiza el estado del participante
      participant.status = status;
      // Actualiza el estado de la pregunta 
      switch (status) {
         case 2:
            this.question.status = 3; // Actualiza el estado de la pregunta a 'detenida'
            this.student_selected = null; // Elimina al estudiante seleccionado
            this.filterStudentsByStatus(2); // Filtrar solo estudiantes en estado 'no seleccionado'
            break;
         case 3:
            this.question.status = 4; // Actualiza el estado de la pregunta a 'respondiendo'
            this.student_selected = participant; // Indica que participante fue seleccionado para responder
            break;
         case 4:
            this.question.status = 3;
            this.student_selected = null;
            this.filterStudentsByStatus(2); // Filtrar estudiantes en estado 'no seleccionado'
            break;
         case 5:
            this.question.status = 5;
            this.data_participants = null;
            this.participants_filtered = null;
            this.student_selected = null;
            //this.updateClassQuestionStatus(5); // Actualiza el estado de la pregunta
            //> Llamar al update en el mismo server
            break;
      }

   }

   // Finaliza la pregunta mediante un counter
   //> Como cancelar el counter??
   // clearInterval(interval); // Finaliza el interval
   // this.counter_ended_question = 5; // Reestablece el contador

   finishCurrentQuestion() {
      this.interval_ended_question = setInterval(() => {
         this.counter_ended_question--;
         if (this.counter_ended_question == 0) {
            clearInterval(this.interval_ended_question); // Finaliza el interval
            this.question.status = 5; // Actualiza el estado de la pregunta a 'finalizada'
            this.updateClassQuestionStatus(5); // Actualiza el estado de la pregunta
            this.data_participants = null;
            this.participants_filtered = null;
            this.student_selected = null;
            this.counter_ended_question = 5; // Reestablece el contador
            //this.activeModal.close(); // Cierra el modal
         }
      }, 1000);

   }

   // Filtra los participantes en base a su estado
   filterStudentsByStatus(status: number) {
      this.participants_filtered = this.data_participants.filter(participant => participant.status == status);
   }

   ngOnDestroy() {
      this.exitToPlayQuestionSectionRoomAsTeacher(); // Emiter: indica que el profesor salió de la sala
      this.subscriptions$.unsubscribe(); // Cancela todas las subcripciones
   }




   /**
    * Obtiene el resumen de participación
    * @param participants
    */
   getTotalWinners(participants: Array<any>) {

      // Naranja
      const red1 = {
         color: '#BC5631'
      };

      const red2 = {
         color: '#CD5F30'
      };

      // Azul
      const blue1 = {
         color: '#37628B'
      };

      const blue2 = {
         color: '#49739E'
      };
      const blue3 = {
         color: '#5987B1'
      };
      const blue4 = {
         color: '#6D9BC2'
      };
      const blue5 = {
         color: '#81AFD2'
      };
      const blue6 = {
         color: '#99C4E1'
      };

      const blue7 = {
         color: '#B4D4E9'
      }

      // Reinicia el 'overview'
      for (let item in this.overview.values) {
         this.overview.values[item] = 0;
         this.overview.children[item] = [];
      }

      // Obtiene los nuevos valores para el overview
      participants.forEach(participant => {

         if (participant.status == 1) {
            this.overview.values['no participan']++;
            this.overview.children['no participan'].push({
               name: `${participant.name} ${participant.last_name} ${participant.middle_name}`,
               value: 1,
               itemStyle: red2,
               label: {
                  show: false
               },
               tooltip: {
                  formatter: "{b}"
               }
            });
         }
         else if (participant.status == 2) {
            this.overview.values['no seleccionados']++;
            this.overview.children['no seleccionados'].push({
               name: `${participant.name} ${participant.last_name} ${participant.middle_name}`,
               value: 1,
               itemStyle: blue7,
               label: {
                  show: false
               },
               tooltip: {
                  formatter: "{b}"
               }
            });
         }
         else if (participant.status == 4) {
            this.overview.values['perdedores']++;
            this.overview.children['perdedores'].push({
               name: `${participant.name} ${participant.last_name} ${participant.middle_name}`,
               value: 1,
               itemStyle: blue6,
               label: {
                  show: false
               },
               tooltip: {
                  formatter: "{b}"
               }
            });
         }
         else if (participant.status == 5) {
            this.overview.values['ganadores']++;
            this.overview.children['ganadores'].push({
               name: `${participant.name} ${participant.last_name} ${participant.middle_name}`,
               value: 1,
               itemStyle: blue5,
               label: {
                  show: false
               },
               tooltip: {
                  formatter: "{b}"
               }
            });
         }
      });
      this.overview.values['participan'] = this.overview.values['no seleccionados'] + this.overview.values['perdedores'] + this.overview.values['ganadores'];
      this.overview.values['total'] = participants.length;

      /*this.total_winners = 0;
      participants.forEach(participant => {
         if (participant.status == 5) this.total_winners++;
      });*/
   }

}
