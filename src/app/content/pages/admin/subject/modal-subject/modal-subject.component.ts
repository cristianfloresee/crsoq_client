// Angular
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Services
import { SubjectService } from 'src/app/core/services/API/subject.service';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Constants
import { TOAST_SUCCESS_CREATE_SUBJECT, TOAST_SUCCESS_UPDATE_SUBJECT, TOAST_ERROR_CREATE_SUBJECT, TOAST_ERROR_UPDATE_SUBJECT } from 'src/app/config/toastr_config';


@Component({
   selector: 'cw-modal-subject',
   templateUrl: './modal-subject.component.html',
   styleUrls: ['./modal-subject.component.scss']
})
export class ModalSubjectComponent implements OnInit {
   @Input() subject; // Optional (only in update actions)
   @Input() action; // Required

   subjectForm: FormGroup;
   subjectFormChanges$;
   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {

      this.initFormData();
      if (this.subject) {
         this.loadFormData();
         this.checkFormChanges();
      }

   }

   initFormData() {
      this.subjectForm = this.fb.group({
         name: ['', [Validators.required]]
      });
   }

   loadFormData() {
      this.subjectForm.setValue({
         name: this.subject.name,
      })
   }

   checkFormChanges() {
      this.subjectFormChanges$ = this.subjectForm.valueChanges
         .subscribe((changes) => {
            for (let field in changes) {
               if (changes[field] === this.subject[field]) this.subjectForm.get(field).markAsPristine();
            }
         });
   }

   formSubmit(subject) {
      if (this.subject) this.updateSubject(subject);
      else this.createSubject(subject);
   }

   createSubject(subject) {

      return this._subjectSrv.createSubject(subject)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_CREATE_SUBJECT.message, TOAST_SUCCESS_CREATE_SUBJECT.title);
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               if (error.error.code && error.error.code == '23505') {
                  this.toastr.error('El período ya existe.', 'Ha ocurrido un error!');
               } else {
                  this.toastr.error(TOAST_ERROR_CREATE_SUBJECT.message, TOAST_ERROR_CREATE_SUBJECT.title);
               }

            }
         );
   }

   updateSubject(subject) {
      this._subjectSrv.updateSubject(subject, this.subject.id_subject)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_UPDATE_SUBJECT.message, TOAST_SUCCESS_UPDATE_SUBJECT.title);
            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               if (error.error.code && error.error.code == '23505') {
                  this.toastr.error('El período ya existe.', 'Ha ocurrido un error!');
               } else {
                  this.toastr.error(TOAST_ERROR_UPDATE_SUBJECT.message, TOAST_ERROR_UPDATE_SUBJECT.title);
               }
            }
         );
   }

}
