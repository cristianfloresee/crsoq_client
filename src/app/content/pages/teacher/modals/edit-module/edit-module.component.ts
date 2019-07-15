import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';
//SERVICIOS
import { ModuleService } from 'src/app/core/services/API/module.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'cw-edit-module',
   templateUrl: './edit-module.component.html',
   styleUrls: ['./edit-module.component.scss']
})
export class EditModuleComponent implements OnInit, OnDestroy {
   @Input() module;
   moduleForm: FormGroup;
   nameChanges$: Subscription;

   constructor(
      private fb: FormBuilder,
      private activeModal: NgbActiveModal,
      private _moduleSrv: ModuleService,
      private toastr: ToastrService
   ) {

   }

   ngOnInit() {
      this.initFormData();
      this.loadFormData();
      this.checkFormChanges();
   }

   initFormData() {
      this.moduleForm = this.fb.group({
         name: ['', Validators.required]
      });
   }

   loadFormData() {
      this.moduleForm.setValue({
         name: this.module.name,
      });
   }

   updateModule(module) {
      console.log("ñee: ", module)
      this._moduleSrv.updateModule(this.module.id_module, module.name)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El modulo ha sido actualizado correctamente.', 'Modulo actualizado!');
            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               this.toastr.error('El modulo no ha sido actualizado.', 'Ha ocurrido un error!');
            }
         );
   }

   checkFormChanges() {
      //DETECTA CAMBIOS EN EL NOMBRE DEL CURSO
      this.nameChanges$ = this.moduleForm.get('name').valueChanges.subscribe((changes) => {
         if (changes == this.module.name) this.moduleForm.get('name').markAsPristine();
      })
   }

   ngOnDestroy(){
      this.nameChanges$.unsubscribe();
   }

}
