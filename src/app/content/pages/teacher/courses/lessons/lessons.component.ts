// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constantes
import { SWAL_DELETE_LESSON, SWAL_SUCCESS_DELETE_LESSON } from 'src/app/config/swal_config';
import { PAGE_SIZES } from 'src/app/config/constants';
// Servicios
import { ModuleService } from 'src/app/core/services/API/module.service';
import { LessonService } from 'src/app/core/services/API/lesson.service';
// Componentes
import { EditLessonComponent } from '../../modals/edit-lesson/edit-lesson.component';
import { CreateLessonComponent } from '../../modals/create-lesson/create-lesson.component';

@Component({
   selector: 'cw-lessons',
   templateUrl: './lessons.component.html',
   styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, OnDestroy {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   filterForm: FormGroup; // Form para el filtro y búsqueda

   SWAL_DELETE_LESSON = SWAL_DELETE_LESSON;
   SWAL_SUCCESS_DELETE_LESSON = SWAL_SUCCESS_DELETE_LESSON;

   options_module: Array<any>; // Opciones para el selector de módulos { id_module, name }

   page_sizes: Array<number> = PAGE_SIZES;

   // Evita se haga el mismo filtro (ver si se pueden sacar)
   lock_id_module = '';
   lock_status = '';
   //f_search = '';

   data_classes: Array<any>;
   total_items: number = 0;
   total_pages: number;
   page_size: number = 20;
   page: number = 1;
   from: number = ((this.page - 1) * this.page_size);

   urlParamChanges$: Subscription;

   // Parámetros de la url
   id_subject;
   id_course;

   constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private router: Router,
      private ngModal: NgbModal,
      private _moduleSrv: ModuleService,
      private _lessonSrv: LessonService,
   ) { }

   ngOnInit() {

      this.urlParamChanges$ = this.route.paramMap
         .subscribe(params => {
            this.id_subject = params.get('idSubject');
            this.id_course = params.get('idCourse');

            this.initFormData();
            this.loadFormOptions();
            this.getClasses();
         });

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

   loadFormOptions() {
      this._moduleSrv.getModulesOptions({ id_course: this.id_course })
         .subscribe(
            (result: any) => this.options_module = result,
            (error) => {
               console.log("error:", error);
            });
   }

   getClasses() {
      let params = Object.assign({ id_course: this.id_course }, this.filterForm.value);
      this._lessonSrv.getLessons(params)
         .subscribe(
            (result: any) => {
               console.log("classes: ", result);
               this.data_classes = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            (error) => {
               console.log("error code:", error);
            }
         );
   }

   createClass() {
      const modalRef = this.ngModal.open(CreateLessonComponent);
      modalRef.componentInstance.id_course = this.id_course;
      modalRef.componentInstance.options_module = this.options_module;
      modalRef.result.then((result) => {
         if (result) this.getClasses();
      });
   }


   updateClass(_class) {
      const modalRef = this.ngModal.open(EditLessonComponent);
      modalRef.componentInstance.lesson = _class;
      modalRef.componentInstance.options_module = this.options_module;
      modalRef.result.then((result) => {
         if (result) this.getClasses();
      });
   }

   goToClassDetail(id_class: number) {
      this.router.navigate([id_class], { relativeTo: this.route });
   }

   filterItems(params) {
      this.lock_id_module = params.id_module;
      this.lock_status = params.status;
      this.from = 0;
      this.getClasses();
   }

   deleteClass(id_class: number) {
      this._lessonSrv.deleteLesson(id_class)
         .subscribe(
            () => {
               this.getClasses();
               this.successSwal.show();
            },
            (error) => {
               console.log("error:", error);
               this.toastr.error('La clase no ha sido eliminada porque contiene actividades.', 'Ha ocurrido un error!');
            });
   }

   changePageSize(_page_size: number) {
      this.page_size = _page_size;
      this.getClasses();
   }

   getUsersToPage(_page: number) {
      if (_page > 0 && _page <= this.total_pages) { // Verifica si el nro de página es válido
         this.from = (_page - 1) * this.page_size;
         this.page = _page;
         this.getClasses();
      }
   }

   ngOnDestroy() {
      this.urlParamChanges$.unsubscribe();
   }

}
