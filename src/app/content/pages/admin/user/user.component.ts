// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//COMPONENTES
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
//SERVICIOS
import { UserService } from '../../../../core/services/API/user.service';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-sweetalert2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { SWAL_DELETE_USER, SWAL_SUCCESS_DELETE_USER } from 'src/app/config/swal_config';
import { PAGE_SIZES } from 'src/app/config/constants';



@Component({
   selector: 'cw-user',
   templateUrl: './user.component.html',
   styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   SWAL_DELETE_USER = SWAL_DELETE_USER;
   SWAL_SUCCESS_DELETE_USER = SWAL_SUCCESS_DELETE_USER;

   page_sizes = PAGE_SIZES;

   users: any[] = [];

   f_role = '';
   f_status = '';
   f_search = '';

   total_items = 0;
   total_pages;
   page_size = 20;
   page = 1;
   from = ((this.page - 1) * this.page_size);


   filterForm: FormGroup;

   constructor(
      private fb: FormBuilder,
      private _userSrv: UserService,
      private ngModal: NgbModal
   ) {
      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         // Ver si se puede dejar de depender de los locks
         role: this.f_role,
         status: this.f_status,
         search: this.f_search
      });
   }

   ngOnInit() {
      this.getUsers();
   }

   getUsers(params?) {
      params = Object.assign({}, params);
      this._userSrv.getUsers(params)
         .subscribe(
            (result: any) => {
               console.log("result: ", result);
               this.users = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            error => {
               console.log("error:", error);
            });
   }

   filter() {
      this.f_role = this.filterForm.value.role;
      this.f_status = this.filterForm.value.status;
      this.f_search = this.filterForm.value.search;
      this.from = 0;

      this._userSrv.getUsers(this.filterForm.value)
         .subscribe(
            (result: any) => {
               this.users = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
               console.log("result: ", result);
               console.log("current page: ", this.page)
            },
            error => {
               console.log("error:", error);
            });

   }

   getUsersPage(page) {
      if (page != 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getUsers({ page: this.page });
      }
   }

   kisa() {
      this.page_size = this.filterForm.value.limit;
      this.from = 0;
      this.getUsers();
   }

   changePage(params) {
      this.page_size = params.page_size;
      this.getUsers(params);
   }

   deleteUser(id_user) {
      this._userSrv.deleteUser(id_user)
         .subscribe(
            result => {
               this.successSwal.show();
               this.getUsers();
            },
            error => {
               console.log("error:", error);
            });
   }


   openUserEdit(user) {
      const modalRef = this.ngModal.open(EditUserComponent);
      modalRef.componentInstance.user = user;

      modalRef.result.then((result) => {
         console.log("result: ", result);
         if (result) {
            console.log("correct update..");
            this.getUsers()
         }
      }, (reason) => {
         console.log("reason: ", reason);
      });
      //DETECTAR SI SE HACE EL EDIT PARA ACTUALIZAR DATOS....
      //RECIBO LOS DATOS USER Y HAGO EDIT ACA O... HAGO EDIT EN MODAL Y DEVUELVO SI FUE SUCCES O ERROR
   }

   openCreateUser() {
      const modalRef = this.ngModal.open(CreateUserComponent);
   }

}
