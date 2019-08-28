// Angular
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Servicios
import { ModuleService } from 'src/app/core/services/API/module.service';
import { LessonService } from 'src/app/core/services/API/lesson.service';
import { ActivityService } from 'src/app/core/services/API/activity.service';
import { ActivityParticipationService } from 'src/app/core/services/API/activity_participation.service';

@Component({
   selector: 'cw-update-activity',
   templateUrl: './update-activity.component.html',
   styleUrls: ['./update-activity.component.scss']
})
export class UpdateActivityComponent implements OnInit, OnDestroy {
   @Input() activity;
   @Input() id_course;

   // Form para Creación
   activityForm: FormGroup;

   data_students;

   subscriptions$: Subscription;

   // Opciones del Selector
   options_lesson;
   options_module;

   // Solicitud de Estado de Ganadores
   winner_status_request = []; // {id_user, status}
   add_winners = []; // [id_user1, id_user2...]
   delete_winners = []; // [id_user1, id_user2...]

   total_winners;
   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _moduleSrv: ModuleService,
      private _lessonSrv: LessonService,
      private toastr: ToastrService,
      private _activitySrv: ActivityService,
      private _ActivityParticipationSrv: ActivityParticipationService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      console.log("activity: ", this.activity);
      this.initFormData();
      this.checkFormChanges();
      this.loadFormData();
      this.loadFormOptions();
      this.getStudents();
   }

   initFormData() {
      this.activityForm = this.fb.group({
         module: ['', Validators.required],
         lesson: [''],
         name: ['', [Validators.required]],
         mode: ['', Validators.required],
         status: ['', Validators.required]
      });
   }

   loadFormData() {
      this.activityForm.setValue({
         module: this.activity.id_module,
         lesson: this.activity.id_class,
         name: this.activity.name,
         mode: this.activity.mode,
         status: this.activity.status
      })
   }

   loadFormOptions() {
      // Obtiene los modulos por ID de Curso
      this._moduleSrv.getModulesOptions({ id_course: this.id_course })
         .subscribe(
            result => {
               this.options_module = result;
            },
            error => {
               console.log("error:", error);
            });
   }

   checkFormChanges() {
      this.subscriptions$.add(this.activityForm.get('module').valueChanges
         .subscribe((changes) => {
            this.activityForm.controls.lesson.setValue('');
            if (changes) {
               if (changes == this.activity.id_module) this.activityForm.get('module').markAsPristine();
               this._lessonSrv.getLessonsOptions({ id_module: changes })
                  .subscribe(
                     (result: any) => {
                        this.options_lesson = result;
                     },
                     error => {
                        console.log("error:", error);
                     });
            }
            else {
               this.options_lesson = [];
            }
         })
      );

      this.subscriptions$.add(this.activityForm.get('lesson').valueChanges
         .subscribe((changes) => {
            if (changes == this.activity.id_class) this.activityForm.get('lesson').markAsPristine();
         })
      );

      this.subscriptions$.add(this.activityForm.get('name').valueChanges
         .subscribe((changes) => {
            if (changes == this.activity.name) this.activityForm.get('name').markAsPristine();
         })
      );

      this.subscriptions$.add(this.activityForm.get('mode').valueChanges
         .subscribe((changes) => {
            if (changes == this.activity.mode) this.activityForm.get('mode').markAsPristine();
         })
      );

      this.subscriptions$.add(this.activityForm.get('status').valueChanges
         .subscribe((changes) => {
            if (changes == this.activity.status) this.activityForm.get('status').markAsPristine();
         })
      );

   }

   // Actualiza la Actividad (submit)
   updateActivity(activity) {
      console.log("activity: ", activity);
      //console.log(`students: ${typeof(this.winner_status_request)}`)
      //console.log(`students: ${typeof()}`)

      // Convierto el Array
      //let winner_status_array = JSON.stringify(this.winner_status_request);
      this._activitySrv.updateActivity(this.activity.id_activity, activity.lesson, activity.name, activity.status, activity.mode, this.add_winners, this.delete_winners)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('La actividad ha sido actualizada correctamente.', 'Actividad actualizado!');
            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               this.toastr.error('La actividad no ha sido actualizada.', 'Ha ocurrido un error!');
            }
         );
   }

   getStudents() {

      console.log("get students...");
      this._activitySrv.getStudentsByActivityID(this.activity.id_activity)
         .subscribe(
            result => {
               console.log("students: ", result);
               // Formatea el array de estudiantes con un campo 'original_status' que contendrá el estado original ganador/perdedor
               this.data_students = this.formatActivityParticipationArray(result);
               this.getTotalWinners(this.data_students);
               console.log("participacion formateada: ", this.data_students);
            },
            error => {
               console.log("error:", error);
            });
   }

   changeStudentStatus(student) {

      // Cambia el estado del estudiante añadido/no añadido
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
      // Obtener cantidad de ganadores
      this.getTotalWinners(this.data_students);
   }

   changeWinnerStatus(participation) {
      // Cambia el estado ganador/perdedor
      console.log("PARTICIPATION: ", participation);
      if (participation.status == 1) participation.status = 2;
      else participation.status = 1;
      /*
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
      */

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

   deleteFromArray(id, array) {
      // Busco el indice de la solicitud en el array de Solicitudes
      let index = array.indexOf(id);
      // Elimino la solicitud
      array.splice(index, 1);
   }

   getTotalWinners(array) {
      this.total_winners = 0;
      array.forEach(item => {
         if (item.status == 2) this.total_winners++;
         console.log("TOTAL WINNERS: ", this.total_winners);
      })
   }





   //console.log(participation);
   //this.insertWinnerStatusRequest(participation.id_user, participation.status)
   //participation.status = !participation.status;


   /*this._ActivityParticipationSrv.updateActivityParticipation(this.activity.id_activity, participation.id_user, !participation.status)
   .subscribe(
      result => {
         console.log("result: ", result);
         participation.status = !participation.status;
      },
      error => {
         console.log("error:", error);
      });*/


   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

   insertWinnerStatusRequest(id_user, status) {
      this.winner_status_request.push({ id_user, status });
      console.log("winner: ", this.winner_status_request);
   }

   deleteWinnerStatusRequest(id_user) {
      // Busco el indice de la solicitud en el array de Solicitudes
      let index = this.winner_status_request.map(i => i.id_user).indexOf(id_user);
      // Elimino la solicitud
      this.winner_status_request.splice(index, 1);
      console.log("winner: ", this.winner_status_request);
   }

   formatActivityParticipationArray(activity_participation) {
      activity_participation.forEach(participation => {
         participation.original_status = participation.status;
      });
      return activity_participation;
   }


}
