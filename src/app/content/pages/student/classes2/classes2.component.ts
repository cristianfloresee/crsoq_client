// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
// ngx-toatr
import { ToastrService } from 'ngx-toastr';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Constantes
import { PAGE_SIZES } from 'src/app/config/constants';
// Servicios
import { ModuleService } from 'src/app/core/services/API/module.service';
import { LessonService } from 'src/app/core/services/API/lesson.service';
// Componentes
import { PlayQuestion2Component } from '../modals/play-question2/play-question2.component';

@Component({
   selector: 'cw-classes2',
   templateUrl: './classes2.component.html',
   styleUrls: ['./classes2.component.scss'],
})
export class Classes2Component implements OnInit, OnDestroy {

   subscriptions$: Subscription;
   id_course;

   page_sizes: Array<number> = PAGE_SIZES;

   options_module; // Opciones de selector

   filterForm: FormGroup; // Form para el filtro y búsqueda

   // Evita se haga el mismo Filtro (ver si se pueden sacar)
   lock_id_module = '';
   lock_status = '';

   data_classes: Array<any>;
   total_items: number = 0;
   total_pages: number;
   page_size: number = 20;
   page: number = 1;
   from: number = ((this.page - 1) * this.page_size);

   constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private ngModal: NgbModal,
      private _lessonSrv: LessonService,
      private _moduleSrv: ModuleService,
   ) { }

   ngOnInit() {

      this.subscriptions$ = new Subscription();

      this.subscriptions$.add(this.route.paramMap
         .subscribe(params => {
            // Si había una socket room abierta la cierro
            if (this.id_course) this.exitToClassSectionRoomAsStudent();
            this.id_course = params.get('idCourse');
            // Ingresa a la socket room
            this.enterToClassSectionRoomAsStudent();
         })
      );

      this.initFormData();
      this.loadFormOptions();
      this.getLessons();

      // Socket
      this.listenSocket();
   }

   filterItems(params) {

      this.lock_id_module = params.id_module;
      this.lock_status = params.status;
      this.from = 0;

      this.getLessons();

   }

   initFormData() {
      this.lock_id_module = '';
      this.lock_status = '';

      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         id_module: [this.lock_id_module],
         status: [this.lock_status],
      });
   }

   changePage(params) {
      this.page_size = params.page_size;
      this.getLessons();
   }

   getUsersPage(page) {
      if (page != 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getLessons();
      }
   }

   loadFormOptions() {

      this.subscriptions$.add(this._moduleSrv.getModulesOptions({ id_course: this.id_course })
         .subscribe(
            (result: any) => {
               console.log("opt: ", result)
               this.options_module = result;

            },
            (error) => {
               console.log("error:", error);
            })
      );

   }

   getLessons() {

      let params = Object.assign({ id_course: this.id_course }, this.filterForm.value);
      this.subscriptions$.add(this._lessonSrv.getLessons(params)
         .subscribe(
            (result: any) => {
               console.log("lessons: ", result);
               this.data_classes = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            (error) => {
               console.log("error code:", error);
            })
      );

   }

   enterToClassSectionRoomAsStudent() {
      this._lessonSrv.enterToClassSectionRoomAsStudent({ id_course: this.id_course })
   }

   exitToClassSectionRoomAsStudent() {
      this._lessonSrv.exitToClassSectionRoomAsStudent({ id_course: this.id_course });

   }

   listenSocket() {
      this.subscriptions$.add(this._lessonSrv.listenClassCreated()
         .subscribe((data: any) => {
            console.log("listenClassCreated: ", data);

            this.getLessons(); // Actualiza el sidemenu del estudiante
            this.toastr.success(`Se ha creado una clase.`, 'Clase Creada!');
         })
      );

      this.subscriptions$.add(this._lessonSrv.listenClassDeleted()
         .subscribe((data: any) => {
            console.log("listenClassDeleted: ", data);

            this.getLessons(); // Actualiza el sidemenu del estudiante
            this.toastr.success(`Se ha eliminado una clase.`, 'Clase Eliminada!');
         })
      );

      this.subscriptions$.add(this._lessonSrv.listenClassUpdated()
         .subscribe((data: any) => {
            console.log("listenClassUpdated: ", data);

            this.getLessons(); // Actualiza el sidemenu del estudiante
            this.toastr.success(`Se ha actualizado una clase.`, 'Clase Actualizada!');
         })
      );

   }

   // Ingresa a la clase (área de juego)
   // + Ver si ya hay alguna preguna iniciada
   enterToClass(_class) {

      const modalRef = this.ngModal.open(PlayQuestion2Component, {
         windowClass: 'xlModal'
      });

      modalRef.componentInstance.class = _class;
      modalRef.result.then((result) => {
         //if (result) this.getCalendars()
      });

   }



   ngOnDestroy() {
      this.exitToClassSectionRoomAsStudent();
      this.subscriptions$.unsubscribe();
   }

}
