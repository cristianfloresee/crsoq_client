// Angular
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// rxjs
import { Subscription } from "rxjs";
// ng-bootstrap
import {
   NgbActiveModal,
   NgbDate,
   NgbDateStruct
} from "@ng-bootstrap/ng-bootstrap";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
// ngx-toastr
import { ToastrService } from "ngx-toastr";
// Services
import { LessonService } from "src/app/core/services/API/lesson.service";

@Component({
   selector: "cw-modal-lesson",
   templateUrl: "./modal-lesson.component.html",
   styleUrls: ["./modal-lesson.component.scss"]
})
export class ModalLessonComponent implements OnInit, OnDestroy {
   @Input() action; // Required
   @Input() lesson; // Optional
   @Input() options_module;
   
   lessonForm: FormGroup;

   subscriptions$: Subscription;
   moduleChanges$: Subscription;
   descriptionChanges$: Subscription;
   dateChanges$: Subscription;
   statusChanges$: Subscription;

   // Date as NgbDateStruct
   date_formatted;

   constructor(
      private fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _lessonSrv: LessonService,
      private toastr: ToastrService,
      private ngbDateParserFormatter: NgbDateParserFormatter
   ) {}

   ngOnInit() {
      console.log("lesson: ", this.lesson);
      console.log("data: ", this.options_module);
      this.initFormData();
      if (this.lesson) {
         this.loadFormData(this.lesson);
         this.checkFormChanges(this.lesson);
      }
   }

   initFormData() {
      this.lessonForm = this.fb.group({
         module: ["", Validators.required],
         description: ["", Validators.required],
         date: [null, Validators.required],
         status: ["", Validators.required]
      });
   }

   loadFormData(lesson) {
      // Convierto la fecha ISOString (2007-11-03T16:18:05Z) a un NgbDate para poder usar la función equals de comparación
      // + Pendiente: Ver si se puede hacer en una línea
      this.date_formatted = this.ngbDateParserFormatter.parse(lesson.date);
      this.date_formatted = NgbDate.from(this.date_formatted);
      // Carga los datos en el Form
      this.lessonForm.setValue({
         module: lesson.id_module,
         description: lesson.description,
         date: this.date_formatted,
         status: lesson.status
      });
   }

   formSubmit(lesson){
      if(this.lesson) this.updateLesson(lesson);
   }

   updateLesson(lesson) {
      let dateISO = this.ngbDateParserFormatter.format(lesson.date);

      this._lessonSrv
         .updateLesson(
            this.lesson.id_class,
            lesson.module,
            lesson.description,
            dateISO,
            lesson.status
         )
         .subscribe(
            result => {
               if (!result) {
                  this.toastr.error(
                     "Asegúrate de no tener otra clase iniciada.",
                     "Ha ocurrido un error!"
                  );
               } else {
                  this.activeModal.close(true);
                  this.toastr.success(
                     "La clase ha sido actualizada correctamente.",
                     "Clase actualizada!"
                  );
               }
            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               this.toastr.error(
                  "La clase no ha sido actualizado.",
                  "Ha ocurrido un error!"
               );
            }
         );
   }

   checkFormChanges(lesson) {
      this.moduleChanges$ = this.lessonForm
         .get("module")
         .valueChanges.subscribe(changes => {
            if (changes == lesson.id_module)
               this.lessonForm.get("module").markAsPristine();
         });

      this.descriptionChanges$ = this.lessonForm
         .get("description")
         .valueChanges.subscribe(changes => {
            if (changes == lesson.description)
               this.lessonForm.get("description").markAsPristine();
         });

      this.dateChanges$ = this.lessonForm
         .get("date")
         .valueChanges.subscribe(changes => {
            // Convierte la fecha recibida en NgbDate para usar la función equals()
            changes = NgbDate.from(changes);
            // Si las fechas son iguales marco el markAsPristine
            if (changes.equals(this.date_formatted))
               this.lessonForm.get("date").markAsPristine();
         });

      this.statusChanges$ = this.lessonForm
         .get("status")
         .valueChanges.subscribe(changes => {
            if (changes == lesson.status)
               this.lessonForm.get("status").markAsPristine();
         });
   }

   ngOnDestroy() {
      if(this.subscriptions$) this.subscriptions$.unsubscribe();
      this.moduleChanges$.unsubscribe();
      this.descriptionChanges$.unsubscribe();
      this.dateChanges$.unsubscribe();
      this.statusChanges$.unsubscribe();
   }
}
