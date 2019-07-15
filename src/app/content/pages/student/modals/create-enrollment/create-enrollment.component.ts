// Angular
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/core/services/API/course.service';

// ngx-sweetalert2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { SWAL_DELETE_ENROLLMENT, SWAL_SUCCESS_DELETE_ENROLLMENT } from 'src/app/config/swal_config';
import { EnrollmentService } from 'src/app/core/services/API/enrollments.service';

@Component({
   selector: 'cw-create-enrollment',
   templateUrl: './create-enrollment.component.html',
   styleUrls: ['./create-enrollment.component.scss']
})
export class CreateEnrollmentComponent implements OnInit {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;
   SWAL_DELETE_ENROLLMENT = SWAL_DELETE_ENROLLMENT;
   SWAL_SUCCESS_DELETE_ENROLLMENT = SWAL_SUCCESS_DELETE_ENROLLMENT;

   @Input() id_user;

   search_results;
   // Form
   searchForm: FormGroup;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private _courseSrv: CourseService,
      private _enrollmentSrv: EnrollmentService

   ) { }

   ngOnInit() {
      this.initFormData();
   }

   initFormData() {
      this.searchForm = this.fb.group({
         code: ['', Validators.required],
      });
   }

   searchCourse(code) {
      //console.log("course: ", course);
      // Busca cursos según su código
      this._courseSrv.getCoursesByCode(this.id_user, code)
         .subscribe((data: any) => {
            console.log("datax: ", data);
            this.search_results = data;
         })
   }

   createEnrollment(course) {
      console.log("create enrollment: ", course);
      this._enrollmentSrv.createEnrollment(course.id_course, this.id_user)
         .subscribe(
            result => {
               course.enrolled = !course.enrolled;
               console.log("enrollments: ", result)
               //this.getEnrollments();

               // Recibe toastr desde el socket también
               //this.toastr.success(`El estudiante ha sido inscrito correctamente.`, `Estudiante Inscrito!`);
               //this.data_updated = true;
            },
            error => {
               console.log("error:", error);
               this.toastr.error(`No se ha podido inscribir al estudiante.`, 'Ha ocurrido un error!');
            });

   }

   deleteEnrollment(course) {
      // console.log("delete enrollment: ", course);
      this._enrollmentSrv.deleteEnrollment(course.id_course, this.id_user)
      .subscribe(
         result => {
            console.log("enrollments: ", result)
            course.enrolled = !course.enrolled;
            this.successSwal.show();
            //this.getEnrollments();
         },
         error => {
            console.log("error:", error);
         });
   }

}
