// Angular
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// rxjs
import { Subscription } from "rxjs";
// ng-bootstrap
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
// ngx-toastr
import { ToastrService } from "ngx-toastr";
// Services
import { ModuleService } from "src/app/core/services/API/module.service";

@Component({
   selector: "cw-modal-module",
   templateUrl: "./modal-module.component.html",
   styleUrls: ["./modal-module.component.scss"]
})
export class ModalModuleComponent implements OnInit, OnDestroy {
   @Input() action; // Required
   @Input() id_course; // Optional
   @Input() module; // Optional

   moduleForm: FormGroup;
   nameChanges$: Subscription;

   constructor(
      private fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _moduleSrv: ModuleService,
      private toastr: ToastrService
   ) {}

   ngOnInit() {
      this.initFormData();
      if (this.module) {
         this.loadFormData(this.module);
         this.checkFormChanges(this.module);
      }
   }

   initFormData() {
      this.moduleForm = this.fb.group({
         name: ["", Validators.required]
      });
   }

   loadFormData(module) {
      this.moduleForm.setValue({
         name: module.name
      });
   }

   checkFormChanges(module) {
      this.nameChanges$ = this.moduleForm
         .get("name")
         .valueChanges.subscribe(changes => {
            if (changes == module.name)
               this.moduleForm.get("name").markAsPristine();
         });
   }

   formSubmit(module){
      if(this.module) this.updateModule(module);
      else if(this.id_course) this.createModule(module, this.id_course);
   }

   updateModule(module) {
      this._moduleSrv
         .updateModule(this.module.id_module, module.name)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success(
                  "El modulo ha sido actualizado correctamente.",
                  "Modulo actualizado!"
               );
            },
            (error) => {
               console.log("error:", error);
               this.activeModal.close(false);
               this.toastr.error(
                  "El modulo no ha sido actualizado.",
                  "Ha ocurrido un error!"
               );
            }
         );
   }

   createModule(module, id_course) {
      this._moduleSrv.createModule(module.name, id_course)
         .subscribe(
            () => {
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

   ngOnDestroy() {
      if (this.nameChanges$) this.nameChanges$.unsubscribe();
   }
}
