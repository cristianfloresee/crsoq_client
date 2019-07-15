import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CourseService } from 'src/app/core/services/API/course.service';
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Constants
import { SWAL_DELETE_COURSE, SWAL_SUCCESS_DELETE_COURSE } from 'src/app/config/swal_config';
import { DeleteCourseComponent } from '../../../modals/delete-course/delete-course.component';
import { CreateCourseComponent } from '../../../modals/create-course/create-course.component';
import { SidemenuService } from 'src/app/core/services/sidemenu.service';
// Modals

@Component({
   selector: 'cw-courses2',
   templateUrl: './courses2.component.html',
   styleUrls: ['./courses2.component.scss']
})
export class Courses2Component implements OnInit {

   @Input() id_subject;
   @Input() id_user;

    // Hace referencia al template 'successSwal'
    @ViewChild('successSwal') private successSwal: SwalComponent;

    // Opciones de los swal
    SWAL_DELETE_COURSE: SweetAlertOptions = SWAL_DELETE_COURSE;
    SWAL_SUCCESS_DELETE_COURSE: SweetAlertOptions = SWAL_SUCCESS_DELETE_COURSE;

    // Data para la tabla
    data_courses;
    total_items = 0;
    total_pages;
    page_size = 20;
    page = 1;
    from = ((this.page - 1) * this.page_size);


   constructor(
      private _courseSrv: CourseService,
      private ngModal: NgbModal,
      private _sidemenuSrv: SidemenuService
   ) { }

   ngOnInit() {
      console.log("Id USER: ", this.id_user);
      console.log("Id SUBJECT: ", this.id_subject);
      this.getCourses();
   }

   getCourses() {
      this._courseSrv.getCourses({id_user: this.id_user, id_subject: this.id_subject})
      .subscribe(
         (result: any) => {
            console.log("coco: ", result);
            this.data_courses = result.items;
            this.total_items = result.info.total_items;
            this.total_pages = result.info.total_pages;
            this.page = (this.from / this.page_size) + 1;
         },
         error => {
            console.log("error:", error);
         });
   }

   deleteCourse(course) {
      const modalRef = this.ngModal.open(DeleteCourseComponent);
      modalRef.componentInstance.course = course;
      modalRef.result.then((result) => {
         if (result) {
            this.getCourses();
            // Actualizo el sidemenu
            this._sidemenuSrv.changeSidemenuByRole(2);
         }
      });
   }

   createCourse() {
      const modalRef = this.ngModal.open(CreateCourseComponent);
      modalRef.componentInstance.id_subject = this.id_subject;
      modalRef.componentInstance.action = 'Crear';
      modalRef.result.then((result) => {
         if (result) this.getCourses()
      });
   }

   updateCourse(course) {
      const modalRef = this.ngModal.open(CreateCourseComponent);
      modalRef.componentInstance.course = course;
      modalRef.componentInstance.action = 'Actualizar';
      modalRef.result.then((result) => {
         if (result) this.getCourses()
      });
   }


}
