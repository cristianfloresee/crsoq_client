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
import { TOAST_SUCCESS_CREATE_SUBJECT, TOAST_SUCCESS_UPDATE_SUBJECT, TOAST_ERROR_CREATE_SUBJECT } from 'src/app/config/toastr_config';


@Component({
   selector: 'cw-edit-subject',
   templateUrl: './edit-subject.component.html',
   styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit {
   @Input() subject;
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
      console.log("CALENDARIO: ", this.subject);
      this.initFormData();
      this.loadFormData();
      this.checkFormChanges();
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

   editSubject(subject) {
      this._subjectSrv.updateSubject(subject, this.subject.id_subject)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_UPDATE_SUBJECT.message, TOAST_SUCCESS_UPDATE_SUBJECT.title);
            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               // if (error.error.code && error.error.code == '23505') {
               //    this.toastr.error('El período ya existe.', 'Ha ocurrido un error!');
               // } else {
               //    this.toastr.error('El período no ha sido actualizado.', 'Ha ocurrido un error!');
               // }
            }
         );
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
               }else{
                  this.toastr.error(TOAST_ERROR_CREATE_SUBJECT.message, TOAST_ERROR_CREATE_SUBJECT.title);
               }

            }
         );
   }

}
