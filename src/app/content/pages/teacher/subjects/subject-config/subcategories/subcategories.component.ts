// Angular
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// Services
import { CategoryService } from 'src/app/core/services/API/category.service';
// RxJS
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
// Constants
import { SWAL_DELETE_SUBCATEGORY, SWAL_SUCCESS_DELETE_SUBCATEGORY } from 'src/app/config/swal_config';
// Modals
import { UpdateCategoryComponent } from '../../../modals/modal-category/update-category.component';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { ModalSubcategoryComponent } from '../../../modals/modal-subcategory/modal-subcategory.component';


// Services

@Component({
   selector: 'cw-subcategories',
   templateUrl: './subcategories.component.html',
   styleUrls: ['./subcategories.component.scss']
})
export class SubcategoriesComponent implements OnInit {

   @Input() id_subject;
   @Input() id_user;

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   // Opciones de los swal
   SWAL_DELETE_SUBCATEGORY: SweetAlertOptions = SWAL_DELETE_SUBCATEGORY;
   SWAL_SUCCESS_DELETE_SUBCATEGORY: SweetAlertOptions = SWAL_SUCCESS_DELETE_SUBCATEGORY;

   // Data para la tabla
   data_subcategories;
   total_items = 0;
   total_pages;
   page_size = 20;
   page = 1;
   from = ((this.page - 1) * this.page_size);

   constructor(
      private _subcategorySrv: SubcategoryService,
      private ngModal: NgbModal,
   ) { }

   ngOnInit() {
      //this.getSubcategories()
   }

   ngOnChanges(){
      this.getSubcategories();
   }

   getSubcategories(params?) {

      params = Object.assign({}, params, { id_user: this.id_user, id_subject: this.id_subject });
      this._subcategorySrv.getSubcategories(params)
         .subscribe(
            (result: any) => {
               console.log("result: ", result);
               this.data_subcategories = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            error => {
               console.log("error:", error);
            });
   }

   createSubcategory() {
      const modalRef = this.ngModal.open(ModalSubcategoryComponent);
      modalRef.componentInstance.action = 'Crear';
      modalRef.componentInstance.id_subject = this.id_subject;
      modalRef.result
         .then((result) => { if (result) this.getSubcategories() })
         .catch(reason => reason);
   }

   updateSubcategory(subcategory) {
      const modalRef = this.ngModal.open(ModalSubcategoryComponent);
      modalRef.componentInstance.action = 'Actualizar';
      modalRef.componentInstance.subcategory = subcategory;
      modalRef.result
         .then((result) => { if (result) this.getSubcategories() })
         .catch(reason => reason);
   }

   deleteSubcategory(id_subcategory){
      this._subcategorySrv.deleteSubcategory(id_subcategory)
      .subscribe(
         result => {
            this.successSwal.show()
            this.getSubcategories();
         },
         error => {
            console.log("error:", error);
         });
   }


}
