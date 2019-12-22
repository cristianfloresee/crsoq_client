// + Vista que se utilizará para las 'preguntas' y 'actividades'

// Angular
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
//import { EnrollmentService } from 'src/app/core/services/API/enrollments.service';

import { EChartOption } from 'echarts';

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
   total_students: number;
   winner_status_request: Array<any> = [];
   add_winners: Array<any> = [];
   delete_winners: Array<any> = [];

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


   winner_status: number;
   participationForm: FormGroup;

   update_status_requests: Array<any> = [];

   // Echart
   option: any;
   update_options: any;
   data;
   // Ejemplo labels: https://www.anychart.com/es/products/anychart/gallery/Sunburst_Charts/The_Population_of_the_Europe.php
   // Animation Effect: https://mode.com/example-gallery/sunburst-chart/
   // English Examples: https://stackoverflow.com/questions/27930030/echarts-from-baidu
   // Sunburst Chart Doc: https://echarts.apache.org/en/option.html#series-sunburst
   // Demo efecto hover: https://echarts.apache.org/examples/en/editor.html?c=doc-example/sunburst-highlight-ancestor&theme=light
   constructor(
      private toastr: ToastrService,
      public activeModal: NgbActiveModal,
      private _activitySrv: ActivityService,
      private _activityParticipationsSrv: ActivityParticipationService,
      private _userQuestionClassSrv: UserQuestionClassService,
      //private _enrollmentSrv: EnrollmentService
   ) { }

   ngOnInit() {
      // Establece el estado ganador dependiendo si es 'pregunta' o 'actividad'
      this.winner_status = this.question ? 5 : 2;
      this.getStudentsParticipation();
   }

   changeStatus(student) {
      console.log("changeStatus...");
      const { id_user, status, original_status } = student;
      // Verifica si existe una petición de actualización en el array
      const item_index = this.update_status_requests.findIndex(item => item.id_user == id_user);

      if (status != original_status) {
         // Actualiza el item
         if (item_index >= 0) this.update_status_requests[item_index].status = status;
         // Inserta el item
         else this.update_status_requests.push({ id_user, status });
      }
      else {
         // ELiminar el item
         if (item_index >= 0) this.update_status_requests.splice(item_index, 1);
      }
      this.getOverview(this.data_students);
      this.updateChartOptions();
   }

   getStudentsParticipation() {

      if (this.activity) {

         // Obtiene la participación de todos los estudiantes
         this._activitySrv.getStudentsByActivityID(this.activity.id_activity)
            .subscribe(
               (result: any) => {
                  console.log("students: ", result);
                  this.data_students = this.formatStudentArray(result);
                  console.log("participacion formateada: ", this.data_students);
                  this.getOverview(this.data_students);
               },
               (error) => {
                  console.log("error:", error);
               });

      }
      else if (this.question) {

         const params = {
            id_question: this.question.id_question,
            id_class: this.id_class
         };

         // Obtiene todos los estudiantes del curso
         this._userQuestionClassSrv.getQuestionParticipation(params)
            .subscribe(
               (result: any) => {
                  this.data_students = this.formatStudentArray(result);
                  this.getOverview(this.data_students);
                  this.initializeChartOptions();
               },
               (error) => {
                  console.log("error:", error);
               });
      }

   }


   /**
    * Crea un estado original de participación para cada estudiante para poder actualizar sus 'status'
    */
   formatStudentArray(participants: Array<any>) {
      participants.forEach(participation => {
         participation.original_status = participation.status;
      });
      return participants;
   }

   /**
    * Obtiene el resumen de participación
    * @param participants
    */
   getOverview(participants: Array<any>) {
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

      // Reinicia los contadores
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

   }

   initializeChartOptions() {

      console.log("initializeChartOptions...");

      let legend_data = [];
      let series_data = [];
      let selected = {};

      for (let item in this.overview.values) {
         legend_data.push(item);
         series_data.push({
            name: item,
            value: this.overview.values[item]
         });
         selected[item] = this.overview.values[item] > 0;
      }

      console.log("legend_data: ", legend_data);
      console.log("series_data: ", series_data);
      console.log("selected: ", selected);

      // Naranja
      var red1 = {
         color: '#BC5631'
      };

      var red2 = {
         color: '#CD5F30'
      };

      // Azul
      var blue1 = {
         color: '#37628B'
      };

      var blue2 = {
         color: '#49739E'
      };
      var blue3 = {
         color: '#5987B1'
      };
      var blue4 = {
         color: '#6D9BC2'
      };
      var blue5 = {
         color: '#81AFD2'
      };
      var blue6 = {
         color: '#99C4E1'
      };

      var blue7 = {
         color: '#B4D4E9'
      }


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
               },
               {
                  // labels: {
                  //    show: false
                  // }
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

   //> Peta
   updateChartOptions() {

      var red1 = {
         color: '#BC5631'
      };


      // Azul
      var blue1 = {
         color: '#37628B'
      };

      var blue2 = {
         color: '#49739E'
      };
      var blue3 = {
         color: '#5987B1'
      };
      var blue4 = {
         color: '#6D9BC2'
      };

      console.log("updateChartOptions..");
      let series_data = [];
      let selected = {};

      // // Reinicia los contadores
      // for (let item in this.overview.values) {
      //    this.overview.values[item] = 0;
      //    this.overview.children[item] = [];
      // }

      for (let item in this.overview.values) {
         series_data.push({
            name: item,
            value: this.overview.values[item],

         });
         selected[item] = this.overview.values[item] > 0;
      }

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

      console.log("overview: ", this.overview);
      //console.log("legend_data: ", legend_data);
      console.log("series_data: ", series_data);
      console.log("selected: ", selected);

      this.update_options = {
         legend: {
            selected: selected
         },
         series: [{
            data: data
         }]
      }
   }

   // Status: 1:
   changeStudentStatus(student) {
      console.log("changeStudentStatus...");
      // Cambia el estado añadido/no añadido
      if (student.status == 1) student.status = 2;
      else student.status = 1;

      //student.status == 1 ? student.status = 2 : student.status = 1;

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
      console.log("add_winners: ", this.add_winners);
      console.log("delete_winners: ", this.delete_winners);
      // Obtener cantidad de ganadores
      this.getOverview(this.data_students);
   }

   insertWinnerStatusRequest(id_user: number, status: number) {
      this.winner_status_request.push({ id_user, status });
   }

   deleteWinnerStatusRequest(id_user: number) {
      const index_request = this.winner_status_request.map(i => i.id_user).indexOf(id_user); // Busca el indice de la solicitud en el array de solicitudes
      this.winner_status_request.splice(index_request, 1); // Elimina la solicitud
   }

   deleteFromArray(id, array) {
      const index = array.indexOf(id); // Busca el index de la solicitud en el array de solicitudes
      array.splice(index, 1); // Elimina la solicitud
   }

   /**
    * Actualiza el estado de los participantes (petición al server)
    */
   updateWinners() {

      if (this.activity) {
         this._activityParticipationsSrv.updateActivityParticipations(this.activity.id_activity, this.add_winners, this.delete_winners)
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
      else if (this.question) {
         console.log("update student status: ", this.update_status_requests);
         this._userQuestionClassSrv.updateStudentsParticipation(this.question.id_question, this.id_class, this.update_status_requests)
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

}
