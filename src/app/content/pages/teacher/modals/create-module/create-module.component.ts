import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';
//SERVICIOS
import { ModuleService } from 'src/app/core/services/API/module.service';

@Component({
   selector: 'cw-create-module',
   templateUrl: './create-module.component.html',
   styleUrls: ['./create-module.component.scss']
})
export class CreateModuleComponent implements OnInit {
   @Input() id_course;
   moduleForm: FormGroup;

   constructor(
      private fb: FormBuilder,
      private activeModal: NgbActiveModal,
      private _moduleSrv: ModuleService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.initFormData();
   }

   createModule(module) {
      this._moduleSrv.createModule(module.name, this.id_course)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El modulo ha sido creado correctamente.', 'Modulo creado!');
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               this.toastr.error('El período no ha sido creado.', 'Ha ocurrido un error!');
            }
         );
   }

   initFormData() {
      this.moduleForm = this.fb.group({
         name: ['', Validators.required]
      });
   }

}
