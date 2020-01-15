// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Services
import { ActivityService } from 'src/app/core/services/API/activity.service';
// RxJS
import { Subscription } from 'rxjs';
// Constants
import { PAGE_SIZES } from 'src/app/config/constants';
// Modals
import { WinnersComponent } from '../../teacher/modals/winners/winners.component';


@Component({
   selector: 'cw-activities2',
   templateUrl: './activities2.component.html',
   styleUrls: ['./activities2.component.scss']
})
export class Activities2Component implements OnInit, OnDestroy {

   // Form para el filtro y búsqueda
   filterForm: FormGroup;
   subscriptions$: Subscription;
   id_course;
   id_subject;

   page_sizes: Array<number> = PAGE_SIZES;
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
      private toastr: ToastrService,
      private _activitySrv: ActivityService,
      private ngModal: NgbModal
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.subscriptions$.add(this.route.paramMap
         .subscribe(params => {
            // Si había un socket room abierto lo cierro
            if (this.id_course) this.exitToActivitySectionRoomAsStudent();

            this.id_subject = params.get('idSubject');
            this.id_course = params.get('idCourse');

            // Ingresa a la socket room
            this.enterToActivitySectionRoomAsStudent();

            this.initFormData();
            // Obtiene las Actividades por ID de Curso
            this.getActivities();
         })
      );

      this.listenSocket();
   }

   listenSocket() {

      // + Talvez se puede haber hecho estos 3 servicios en uno solo
      this.subscriptions$.add(this._activitySrv.listenActivityCreated()
         .subscribe((data: any) => {
            console.log("listenActivityCreated: ", data);
            // Actualiza el sidemenu del estudiante
            this.getActivities();
            this.toastr.success(`Ha sido creada una actividad.`, 'Actividad Creada!');
         })
      );

      this.subscriptions$.add(this._activitySrv.listenActivityDeleted()
         .subscribe((data: any) => {
            console.log("listenActivityDeleted: ", data);
            // Actualiza el sidemenu del estudiante
            this.getActivities()
            this.toastr.success(`Una actividad ha sido eliminada.`, 'Actividad Eliminada!');
         })
      );

      this.subscriptions$.add(this._activitySrv.listenActivityUpdated()
         .subscribe((data: any) => {
            console.log("listenActivityUpdated: ", data);
            // Actualiza el sidemenu del estudiante
            this.getActivities()
            this.toastr.success(`Una actividad ha sido actualizada.`, 'Actividad Actualizada!');
         })
      );

   }

   enterToActivitySectionRoomAsStudent() {
      this._activitySrv.enterToActivitySectionRoomAsStudent({ id_course: this.id_course })
   }

   exitToActivitySectionRoomAsStudent() {
      this._activitySrv.exitToActivitySectionRoomAsStudent({ id_course: this.id_course })
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
      this.exitToActivitySectionRoomAsStudent();
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

   // Inicializa el form
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

   // Filtra los registros de la tabla
   filterItems(params) {
      // Establece los params de filtro para no repetir la misma búsqueda
      this.f_mode = params.mode;
      this.f_status = params.status;
      this.from = 0;
      //Interface: { id_course, mode, status, page, page_size}
      this.getActivities();
   }

   enterToActivity(_activity) {
      console.log("enterToActivity: ", _activity);
   }

   showWinners(activity){
      
      const modalRef = this.ngModal.open(WinnersComponent, {
         windowClass: 'xlModal'
      });

      modalRef.componentInstance.id_course = this.id_course;
      modalRef.componentInstance.activity = activity;
   }

}
