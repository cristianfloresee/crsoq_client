import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';
//SERVICIOS
import { ModuleService } from 'src/app/core/services/API/module.service';
import { Subscription } from 'rxjs';
import { LessonService } from 'src/app/core/services/API/lesson.service';

@Component({
   selector: 'cw-edit-lesson',
   templateUrl: './edit-lesson.component.html',
   styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit, OnDestroy {

   @Input() lesson;
   @Input() options_module;
   lessonForm: FormGroup;

   // Form Changes
   moduleChanges$: Subscription;
   descriptionChanges$: Subscription;
   dateChanges$: Subscription;
   statusChanges$: Subscription;

   // Date as NgbDateStruct
   date_formatted;

   constructor(
      private fb: FormBuilder,
      private activeModal: NgbActiveModal,
      private _moduleSrv: ModuleService,
      private _lessonSrv: LessonService,
      private toastr: ToastrService,
      private ngbDateParserFormatter: NgbDateParserFormatter
   ) { }

   ngOnInit() {
      console.log("lesson: ", this.lesson);
      console.log("data: ", this.options_module);
      this.initFormData();
      this.loadFormData();
      this.checkFormChanges();
   }

   initFormData() {
      this.lessonForm = this.fb.group({
         module: ['', Validators.required],
         description: ['', Validators.required],
         date: [null, Validators.required],
         status: ['', Validators.required]
      });
   }

   loadFormData() {
      // Convierto la fecha ISOString (2007-11-03T16:18:05Z) a un NgbDate para poder usar la función equals de comparación
      // + Pendiente: Ver si se puede hacer en una línea
      this.date_formatted = this.ngbDateParserFormatter.parse(this.lesson.date);
      this.date_formatted = NgbDate.from(this.date_formatted);
      // Carga los datos en el Form
      this.lessonForm.setValue({
         module: this.lesson.id_module,
         description: this.lesson.description,
         date: this.date_formatted,
         status: this.lesson.status,
      });
   }

   updateLesson(lesson) {
      let dateISO = this.ngbDateParserFormatter.format(lesson.date);

      this._lessonSrv.updateLesson(this.lesson.id_class, lesson.module, lesson.description, dateISO, lesson.status)
         .subscribe(
            result => {
               if (!result) {
                  this.toastr.error('Asegúrate de no tener otra clase iniciada.', 'Ha ocurrido un error!');
               }
               else {
                  this.activeModal.close(true);
               this.toastr.success('La clase ha sido actualizada correctamente.', 'Clase actualizada!');
               }

            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               this.toastr.error('La clas no ha sido actualizado.', 'Ha ocurrido un error!');
            }
         );
   }

   checkFormChanges() {
      this.moduleChanges$ = this.lessonForm.get('module').valueChanges.subscribe((changes) => {
         if (changes == this.lesson.id_module) this.lessonForm.get('module').markAsPristine();
      });

      this.descriptionChanges$ = this.lessonForm.get('description').valueChanges.subscribe((changes) => {
         if (changes == this.lesson.description) this.lessonForm.get('description').markAsPristine();
      });


      this.dateChanges$ = this.lessonForm.get('date').valueChanges.subscribe((changes) => {
         // Convierte la fecha recibida en NgbDate para usar la función equals()
         changes = NgbDate.from(changes);
         // Si las fechas son iguales marco el markAsPristine
         if (changes.equals(this.date_formatted)) this.lessonForm.get('date').markAsPristine();
      });

      this.statusChanges$ = this.lessonForm.get('status').valueChanges.subscribe((changes) => {
         if (changes == this.lesson.status) this.lessonForm.get('status').markAsPristine();
      });

   }

   ngOnDestroy() {
      this.moduleChanges$.unsubscribe();
      this.descriptionChanges$.unsubscribe();
      this.dateChanges$.unsubscribe();
      this.statusChanges$.unsubscribe();
   }

}
