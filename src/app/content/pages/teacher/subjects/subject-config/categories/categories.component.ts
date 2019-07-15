// Manejar ngx-sweetalert2 sin el setTimeOut():
// Como le paso el id del registro que quiero eliminar al 'preConfirm()' del Swal para luego ejecutar la función que elimina el registro dentro
// + https://stackoverflow.com/questions/49961790/clicking-on-confirm-button-closes-the-swal/50040554
// + https://github.com/sweetalert2/ngx-sweetalert2/issues/68

// Angular
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
// Constantes
import { SWAL_DELETE_CATEGORY, SWAL_SUCCESS_DELETE_CATEGORY } from 'src/app/config/swal_config';
// Modals
import { UpdateCategoryComponent } from '../../../modals/modal-category/update-category.component';
// Servicios
import { CategoryService } from 'src/app/core/services/API/category.service';

@Component({
   selector: 'cw-categories',
   templateUrl: './categories.component.html',
   styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   // Opciones de los swal
   SWAL_DELETE_CATEGORY: SweetAlertOptions = SWAL_DELETE_CATEGORY;
   SWAL_SUCCESS_DELETE_CATEGORY: SweetAlertOptions = SWAL_SUCCESS_DELETE_CATEGORY;

   @Input() id_subject;
   @Input() id_user;

   // Evitan que se haga el mismo filtro
   //lock_name = ''; // Para cuando implemente el search

   // Data para la tabla
   data_categories;
   total_items = 0;
   total_pages;
   page_size = 20;
   page = 1;
   from = ((this.page - 1) * this.page_size);

   constructor(
      private _categorySrv: CategoryService,
      private ngModal: NgbModal,
   ) { }

   ngOnInit() {

   }

   // Necesario para cuando pasa de la categoría de una asignatura a la categoría de otra asignatura
   // + En la situación anterior no cambiaría la url completa, solo el parámetro por lo que en ngOnInit no se actualizaría
   ngOnChanges() {
      this.getCategories();
   }

   getCategories(params?) {
      params = Object.assign({}, params, { id_user: this.id_user, id_subject: this.id_subject });
      this._categorySrv.getCategories(params)
         .subscribe(
            (result: any) => {
               console.log("result: ", result);
               this.data_categories = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
            },
            error => {
               console.log("error:", error);
            });
   }


   deleteCategory(id_category) {

      this._categorySrv.deleteCategory(id_category)
         .subscribe(
            result => {
               this.successSwal.show()
               this.getCategories();
            },
            error => {
               console.log("error:", error);
            });
   }


   createCategory() {
      const modalRef = this.ngModal.open(UpdateCategoryComponent);
      modalRef.componentInstance.action = 'Crear';
      modalRef.componentInstance.id_subject = this.id_subject;
      modalRef.result
         .then((result) => { if (result) this.getCategories() })
         .catch(reason => reason);
   }

   updateCategory(category) {
      const modalRef = this.ngModal.open(UpdateCategoryComponent);
      modalRef.componentInstance.action = 'Actualizar';
      modalRef.componentInstance.category = category;
      modalRef.result
         .then((result) => { if (result) this.getCategories() })
         .catch(reason => reason);
   }


}
