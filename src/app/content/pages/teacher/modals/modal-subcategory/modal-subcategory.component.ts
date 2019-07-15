
// Angular
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// rxjs
import { Subscription } from 'rxjs';
// Servicios
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { WorkspaceService } from 'src/app/core/services/API/workspace.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
// Constantes
import { TOAST_SUCCESS_CREATE_SUBCATEGORY, TOAST_ERROR_CREATE_SUBCATEGORY } from 'src/app/config/toastr_config';

@Component({
   selector: 'cw-modal-subcategory',
   templateUrl: './modal-subcategory.component.html',
   styleUrls: ['./modal-subcategory.component.scss']
})
export class ModalSubcategoryComponent implements OnInit, OnDestroy {
   @Input() id_subject;
   @Input() subcategory;
   // Form
   subcategoryForm: FormGroup;

   id_user;
   // Opciones de selector
   options_category;
   options_subject;

   subscriptions$: Subscription;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private _categorySrv: CategoryService,
      private _subcategorySrv: SubcategoryService,
      private _worskspaceSrv: WorkspaceService,
      private _sessionSrv: SessionService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.id_user = this._sessionSrv.userSubject.value.id_user;
      this.initFormData();
      this.loadFormOptions();

      // Establece opción por defecto si recibe 'id_subject'
      if (this.id_subject) this.subcategoryForm.patchValue({ id_subject: this.id_subject });
      if (this.subcategory) {
         console.log("METAPOD: ", this.subcategory);
         this.loadFormData();
         this.checkFormChanges();
      }
   }

   initFormData() {
      this.subcategoryForm = this.fb.group({
         id_subcategory: '',
         id_subject: ['', [Validators.required]],
         id_category: ['', [Validators.required]],
         name: ['', [Validators.required]],
      });
   }

   loadFormData() {
      this.subcategoryForm.setValue({
         id_subcategory: this.subcategory.id_subcategory,
         id_subject: this.subcategory.id_subject,
         id_category: this.subcategory.id_category,
         name: this.subcategory.name,
      });
   }

   loadFormOptions() {
      // Si recibo 'id_subject' (cuando intento crear una subcategorías desde una sección asignatura)
      if (this.id_subject) {
         this.getCategories({ id_subject: this.id_subject });
      }
      else {
         this._subjectSrv.getSubjectsOptions({ id_user: this.id_user })
            .subscribe(
               (result: any) => {
                  this.options_subject = result;
                  this.getCategories({ id_subject: this.subcategory.id_subject });
                  //if(result && result.length == 0) this.show_message = true;
                  console.log("bulba_result: ", result);
               },
               error => {
                  console.log("error:", error);
               });
      }
   }

   getCategories(params?) {

      params = Object.assign({}, params, { id_user: this.id_user });

      this._categorySrv.getCategoriesOptions(params)
         .subscribe(
            result => {
               this.options_category = result;
               console.log("CATEGORIES: ", result);
            },
            error => {
               console.log("error:", error);
            });
   }

   submitSubcategory(subcategory) {
      if (this.id_subject) this.createSubcategory(subcategory);
      if (this.subcategory) this.updateSubcategory(subcategory)

   }

   createSubcategory(subcategory) {
      this._subcategorySrv.createSubcategory(subcategory.id_category, subcategory.name)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_CREATE_SUBCATEGORY.message, TOAST_SUCCESS_CREATE_SUBCATEGORY.title);
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               this.toastr.error(TOAST_ERROR_CREATE_SUBCATEGORY.message, TOAST_ERROR_CREATE_SUBCATEGORY.title);
            }
         );
   }

   updateSubcategory(subcategory) {

      this._subcategorySrv.updateSubcategory(subcategory.id_subcategory, subcategory.id_category, subcategory.name)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_CREATE_SUBCATEGORY.message, TOAST_SUCCESS_CREATE_SUBCATEGORY.title);
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               this.toastr.error(TOAST_ERROR_CREATE_SUBCATEGORY.message, TOAST_ERROR_CREATE_SUBCATEGORY.title);
            }
         );
   }

   checkFormChanges() {
      this.subscriptions$.add(this.subcategoryForm.get('id_subject').valueChanges
         .subscribe((changes) => {
            this.subcategoryForm.controls.id_category.setValue('');

            if (changes) {
               this.getCategories({ id_subject: changes });
               if (changes == this.subcategory.id_subject) this.subcategoryForm.get('id_subject').markAsPristine();
            }
            else this.options_category = [];

         })
      );

      this.subscriptions$.add(this.subcategoryForm.get('id_category').valueChanges
         .subscribe((changes) => {
            if (changes == this.subcategory.id_category) this.subcategoryForm.get('id_category').markAsPristine();
         })
      );

      this.subscriptions$.add(this.subcategoryForm.get('name').valueChanges
         .subscribe((changes) => {
            if (changes == this.subcategory.name) this.subcategoryForm.get('name').markAsPristine();
         })
      );
   }

   ngOnDestroy(){
      this.subscriptions$.unsubscribe();
   }

}
