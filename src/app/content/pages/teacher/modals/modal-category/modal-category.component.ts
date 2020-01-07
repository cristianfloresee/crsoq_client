
// Angular
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// rxjs
import { Subscription } from 'rxjs';
// Services
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { WorkspaceService } from 'src/app/core/services/API/workspace.service';

@Component({
   selector: 'cw-modal-category',
   templateUrl: './modal-category.component.html',
   styleUrls: ['./modal-category.component.scss']
})
export class modalCategoryComponent implements OnInit, OnDestroy {
   @Input() id_subject; // Necesario cuando creo una pregunta desde una asignatura (optional)
   @Input() category; // Necesario cuando voy a actualizar una categoría (optional)
   @Input() action; // Modal title (required)

   // Form
   categoryForm: FormGroup;

   // Opciones de selector
   options_subject;
   id_user;
   subscriptions$: Subscription;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private _categorySrv: CategoryService,
      private _worskspaceSrv: WorkspaceService,
      private _sessionSrv: SessionService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.id_user = this._sessionSrv.userSubject.value.id_user;

      this.initFormData();
      this.loadFormOptions();

      // Si recibo @Input() category
      if (this.category) {
         this.loadFormData();
         this.checkFormChanges();
      }

      // Establece opción por defecto si recibe 'id_subject'
      if (this.id_subject) this.categoryForm.patchValue({ subject: this.id_subject });

   }

   initFormData() {
      this.categoryForm = this.fb.group({
         id_category: '',
         subject: ['', Validators.required],
         name: ['', [Validators.required]],
      });
   }

   loadFormOptions() {
      /*this._subjectSrv.getSubjectsOptions()
         .subscribe(
            result => {
               this.options_subject = result;
               console.log("SUBJECTS: ", result);
            },
            error => {
               console.log("error:", error);
            });*/

      this._worskspaceSrv.getWorkspaces({ id_user: this.id_user })
         .subscribe(
            result => {
               this.options_subject = result;
               console.log("WORKSPACES: ", result);
            },
            error => {
               console.log("error:", error);
            });

   }

   loadFormData() {
      this.categoryForm.setValue({
         id_category: this.category.id_category,
         subject: this.category.id_subject,
         name: this.category.name,
      });
   }

   checkFormChanges() {
      this.subscriptions$.add(this.categoryForm.get('subject').valueChanges
         .subscribe((changes) => {
            if (changes == this.category.id_subject) this.categoryForm.get('subject').markAsPristine();
         })
      );

      this.subscriptions$.add(this.categoryForm.get('name').valueChanges
         .subscribe((changes) => {
            if (changes == this.category.name) this.categoryForm.get('name').markAsPristine();
         })
      );
   }

   submitCategory(category) {
      if (this.category) this.updateCategory(category)
      else this.createCategory(category)
   }

   createCategory(category) {
      this._categorySrv.createCategory(this._sessionSrv.userSubject.value.id_user, category.subject, category.name)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El categoría ha sido creada correctamente.', 'Categoría creada!');
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               this.toastr.error('El período no ha sido creado.', 'Ha ocurrido un error!');
            }
         );
   }

   updateCategory(category) {
      this._categorySrv.updateCategory(category.id_category, category.subject, category.name)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El categoría ha sido creada correctamente.', 'Categoría creada!');
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               this.toastr.error('El período no ha sido creado.', 'Ha ocurrido un error!');
            }
         );
   }

   ngOnDestroy() {
      // Si recibí @Input() category
      if (this.category) {
         this.subscriptions$.unsubscribe();
      }
   }

}
