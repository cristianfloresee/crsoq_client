//ANGULAR
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//SERVICIOS

//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from 'src/app/core/services/API/subject.service';

@Component({
   selector: 'cw-create-subject',
   templateUrl: './create-subject.component.html',
   styleUrls: ['./create-subject.component.scss']
})
export class CreateSubjectComponent implements OnInit {

   subjectForm: FormGroup;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.initFormData();
   }

   initFormData() {
      this.subjectForm = this.fb.group({
         name: ['', Validators.required],
      });
   }

   createSubject(subject) {

      return this._subjectSrv.createSubject(subject)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El usuario ha sido creado correctamente.', 'Usuario actualizado!');
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               if (error.error.code && error.error.code == '23505') {
                  this.toastr.error('El período ya existe.', 'Ha ocurrido un error!');
               }else{
                  this.toastr.error('El período no ha sido creado.', 'Ha ocurrido un error!');
               }

            }
         );
   }

}
