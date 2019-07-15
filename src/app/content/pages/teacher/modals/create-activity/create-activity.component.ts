
//ANGULAR
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';
// Servicios
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { ActivityService } from 'src/app/core/services/API/activity.service';
import { LessonService } from 'src/app/core/services/API/lesson.service';
import { ModuleService } from 'src/app/core/services/API/module.service';

@Component({
   selector: 'cw-create-activity',
   templateUrl: './create-activity.component.html',
   styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {
   @Input() id_course;

   // Form para Creación
   activityForm: FormGroup;

   // Detección de cambios en el Form
   moduleChanges$;

   // Opciones del Selector
   options_lesson;
   options_module;

   // Datos de Actividades que se mostrarán en la tabla
   data_activities;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private _categorySrv: CategoryService,
      private _activitySrv: ActivityService,
      private _lessonSrv: LessonService,
      private _sessionSrv: SessionService,
      private _moduleSrv: ModuleService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.initFormData();
      this.loadFormOptions();
      this.checkFormChanges();
   }

   initFormData() {
      this.activityForm = this.fb.group({
         module: ['', Validators.required],
         lesson: ['', Validators.required],
         name: ['', [Validators.required]],
         mode: ['', Validators.required]
      });
   }

   createActivity(activity) {
      this._activitySrv.createActivity(activity.lesson, activity.name, activity.mode)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El actividad ha sido creada correctamente.', 'Actividad creada!');
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               this.toastr.error('La actividad no ha sido creado.', 'Ha ocurrido un error!');
            }
         );
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
      this.moduleChanges$ = this.activityForm.get('module').valueChanges.subscribe((changes) => {
         this.activityForm.controls.lesson.setValue('');
         if (changes) {
            this._lessonSrv.getLessonsOptions({ id_module: changes })
               .subscribe(
                  (result: any) => {
                     console.log("lesson options: ", result);
                     this.options_lesson = result;
                  },
                  error => {
                     console.log("error:", error);
                  });
         }
         else {
            this.options_lesson = [];
         }

      });
   }


}
