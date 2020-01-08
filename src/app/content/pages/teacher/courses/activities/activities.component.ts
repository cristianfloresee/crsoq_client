// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// RxJS
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateActivityComponent } from '../../modals/create-activity/create-activity.component';
import { ActivityService } from 'src/app/core/services/API/activity.service';

import { UpdateActivityComponent } from '../../modals/update-activity/update-activity.component';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { SWAL_DELETE_ACTIVITY, SWAL_SUCCESS_DELETE_ACTIVITY } from 'src/app/config/swal_config';
import { WinnersComponent } from '../../modals/winners/winners.component';
import { PAGE_SIZES } from 'src/app/config/constants';

@Component({
   selector: 'cw-activities',
   templateUrl: './activities.component.html',
   styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   // Form para el filtro y búsqueda
   filterForm: FormGroup;

   // Opciones de los swal
   SWAL_DELETE_ACTIVITY = SWAL_DELETE_ACTIVITY;
   SWAL_SUCCESS_DELETE_ACTIVITY = SWAL_SUCCESS_DELETE_ACTIVITY;

   urlParamChanges$: Subscription;
   // Parámetros de la url
   id_subject;
   id_course;

   page_sizes = PAGE_SIZES;
   // Evita se haga el mismo filtro de búsqueda
   // también se puede manejar con markPristine(), averiguar que opción es mejor.
   // teniendo en cuenta el detectChanges(), usar markPristine limpiaría la plantilla!
   f_mode = '';
   f_status = '';

   // Data para la tabla
   data_activities;
   total_items = 0;
   total_pages;
   page_size = 20;
   page = 1;
   from = ((this.page - 1) * this.page_size);

   constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private ngModal: NgbModal,
      private _activitySrv: ActivityService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {

      this.urlParamChanges$ = this.route.paramMap
         .subscribe(params => {
            this.id_subject = params.get('idSubject');
            this.id_course = params.get('idCourse');

            this.initFormData();
            // Obtiene las Actividades por ID de Curso
            this.getActivities();
         });
   }

   // Inicializa el Form
   initFormData() {
      this.f_mode = '';
      this.f_status = '';
      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         mode: [this.f_mode],
         status: [this.f_status],
         //search: [this.f_search]
      });
   }

   ngOnDestroy() {
      this.urlParamChanges$.unsubscribe();
   }

   createActivity() {
      const modalRef = this.ngModal.open(CreateActivityComponent);
      modalRef.componentInstance.action = 'Crear';
      modalRef.componentInstance.id_course = this.id_course;
      modalRef.result.then(
         (result) => { if (result) this.getActivities() },
         () => { }
      );
   }

   updateActivity(activity) {
      const modalRef = this.ngModal.open(UpdateActivityComponent, { size: 'lg' });
      modalRef.componentInstance.action = 'Actualizar';
      modalRef.componentInstance.id_course = this.id_course;
      modalRef.componentInstance.activity = activity;
      modalRef.result.then(
         (result) => { if (result) this.getActivities() },
         () => { }
      );
   }

   updateWinners(activity) {
      const modalRef = this.ngModal.open(WinnersComponent, {
         windowClass: 'xlModal'
      });
      modalRef.componentInstance.id_course = this.id_course;
      modalRef.componentInstance.activity = activity;
      modalRef.result.then(
         (result) => { if (result) this.getActivities() },
         () => { }
      );
   }

   getActivities() {
      let params = Object.assign({}, { id_course: this.id_course }, this.filterForm.value);
      this._activitySrv.getActivities(params)
         .subscribe(
            (result: any) => {
               console.log("activities: ", result);
               this.data_activities = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            error => {
               console.log("error code:", error);
            }
         );
   }

   // ----------------------------------------
   // Filtra los registros de la tabla
   // ----------------------------------------
   filterItems(params) {
      // Establece los params de filtro para no repetir la misma búsqueda
      this.f_mode = params.mode;
      this.f_status = params.status;
      this.from = 0;
      //Interface: { id_course, mode, status, page, page_size}
      this.getActivities();
   }


   deleteActivity(id_activity) {
      this._activitySrv.deleteActivity(id_activity)
         .subscribe(
            result => {
               console.log("nowa: ", result);
               this.getActivities();
               this.successSwal.show();
            },
            error => {
               console.log("error:", error);
            });
   }

   changePage(params) {
      this.page_size = params.page_size;
      this.getActivities();
   }

   getUsersPage(page) {
      if (page != 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getActivities();
      }
   }

}
