// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Services
import { SubjectService } from '../../../../core/services/API/subject.service';
//import { SocketService } from '../../../../core/services/socket.service';
// Modals
import { EditSubjectComponent } from './edit-subject/edit-subject.component';
import { CreateSubjectComponent } from './create-subject/create-subject.component';
// Constants
import { SWAL_DELETE_SUBJECT, SWAL_SUCCESS_DELETE_SUBJECT } from 'src/app/config/swal_config';
// ngx-sweetalert2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { PAGE_SIZES } from 'src/app/config/constants';

@Component({
   selector: 'cw-subject',
   templateUrl: './subject.component.html',
   styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   // Opciones de los swal
   SWAL_DELETE_SUBJECT = SWAL_DELETE_SUBJECT;
   SWAL_SUCCESS_DELETE_SUBJECT = SWAL_SUCCESS_DELETE_SUBJECT;

   // Form para el filtro y búsqueda
   filterForm: FormGroup;

   subjects;
   //ioConnection;
   f_search = '';


   //PAGINATION
   limit = 5;
   total_calendars = 0;
   current_page = 1;

   // Evitan que se haga el mismo filtro
   lock_search = '';

   // Data para la tabla
   data_subjects;

   // Pagination
   total_items = 0;
   total_pages;
   page_size = 20;
   page_sizes = PAGE_SIZES;
   page = 1;
   from = ((this.page - 1) * this.page_size);

   constructor(
      private _subjectSrv: SubjectService,
      private fb: FormBuilder,
      private ngModal: NgbModal,
      //private _socketSrv: SocketService
   ) {
      this.initFormData();
   }

   ngOnInit() {
      this.getSubjects();
   }

   initFormData() {
      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         // Ver si se puede dejar de depender de los locks
         search: this.lock_search
      });
   }

   getSubjects(params?) {
      params = Object.assign({}, params);
      this._subjectSrv.getSubjects(params)
         .subscribe(
            (result: any) => {
               console.log("momia: ", result);
               this.data_subjects = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
            },
            error => {
               console.log("error:", error);
            });
   }

   openSubjectEdit(subject) {
      const modalRef = this.ngModal.open(EditSubjectComponent);
      modalRef.componentInstance.subject = subject;

      modalRef.result.then((result) => {
         if (result) this.getSubjects()
      });
   }

   changePage(params) {
      this.page_size = params.page_size;
      this.getSubjects(params);
   }

   createSubject() {
      const modalRef = this.ngModal.open(CreateSubjectComponent);
      modalRef.result.then((result) => {
         if (result) this.getSubjects()
      });
   }

   deleteSubject(id_subject) {
      this._subjectSrv.deleteSubject(id_subject)
         .subscribe(
            result => {
               console.log("result: ", result);
               this.successSwal.show();
               this.getSubjects()
            },
            error => {
               console.log("error:", error);
            });
   }

   filterItems(params) {
      console.log("params: ", params);
      // Evita que se vuelva a realizar el mismo filtro
      this.lock_search = params.search;
      //Realiza el filtro con los nuevos params
      this.getSubjects(params);
   }

   getUsersPage(page) {
      if (page != 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getSubjects({ page: this.page });
      }
   }

}
