
//ANGULAR
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';
//SERVICIOS
import { LessonService } from 'src/app/core/services/API/lesson.service';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
   selector: 'cw-create-lesson',
   templateUrl: './create-lesson.component.html',
   styleUrls: ['./create-lesson.component.scss']
})
export class CreateLessonComponent implements OnInit {
   @Input() id_course;
   @Input() options_module;
   lessonForm: FormGroup;

   //NgbInputDatepicker
   //https://stackblitz.com/edit/angular-2y4hya
   //https://stackblitz.com/edit/angular-datetimepicker (better)

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _lessonSrv: LessonService,
      private toastr: ToastrService,
      private ngbDateParserFormatter: NgbDateParserFormatter,
      private _socketSrv: SocketService
   ) { }

   ngOnInit() {
      this.initFormData();
      console.log("modules: ", this.options_module);
   }

   initFormData() {
      this.lessonForm = this.fb.group({
         module: ['', [Validators.required]],
         description: ['', [Validators.required]],
         date: [''],
      });
   }


   createLesson(lesson) {

      let date = this.ngbDateParserFormatter.format(lesson.date);
      this._lessonSrv.createLesson(lesson.module, lesson.description, date)
         .subscribe(
            result => {
               this.activeModal.close(true);
               // Socket Service
               // + Debo iniciar socket y luego cerrarlo?
               // + Como 'emitir' datos?

               //this._socketSrv.
               this.toastr.success('La clase ha sido creado correctamente.', 'Clase creada!');
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               this.toastr.error('La clase no ha sido creada.', 'Ha ocurrido un error!');
            }
         );
   }

}
