import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//SERVICIOS
import { SubjectService } from 'src/app/core/services/API/subject.service';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';


@Component({
   selector: 'cw-edit-subject',
   templateUrl: './edit-subject.component.html',
   styleUrls: ['./edit-subject.component.scss']
})
export class EditSubjectComponent implements OnInit {
   @Input() subject;
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
            result => {
               this.activeModal.close(true);
               this.toastr.success('El período ha sido actualizado correctamente.', 'Período actualizado!');
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

}
