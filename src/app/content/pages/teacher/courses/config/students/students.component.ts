// Angular
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Modals
import { AddStudentComponent } from './add-student/add-student.component';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// rxjs
import { Subscription } from 'rxjs';
// Constantes
import { SWAL_DELETE_STUDENT, SWAL_SUCCESS_DELETE_STUDENT } from 'src/app/config/swal_config';
// ngx-sweetalert2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Services
import { EnrollmentService } from 'src/app/core/services/API/enrollments.service';
import { SessionService } from 'src/app/core/services/API/session.service';

@Component({
   selector: 'cw-students',
   templateUrl: './students.component.html',
   styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit, OnDestroy {
   @Input() course;

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   SWAL_DELETE_STUDENT = SWAL_DELETE_STUDENT;
   SWAL_SUCCESS_DELETE_STUDENT = SWAL_SUCCESS_DELETE_STUDENT;
   students;

   subscriptions$: Subscription;

   id_user;
   constructor(
      private ngModal: NgbModal,
      public fb: FormBuilder,
      private _enrollmentSrv: EnrollmentService,
      private toastr: ToastrService,
      private _sessionSrv: SessionService
   ) { }

   ngOnInit() {
      //this._userSrv.getUsersByCourseId(this.id_course)
      console.log("CURSITO: ", this.course);
      this.subscriptions$ = new Subscription();
      this.id_user = this._sessionSrv.userSubject.value.id_user;

      this.getEnrollments();
      //this._socketSrv.onCreateEnrollment();
      this.initIoConnection();
      this.enterToCourseRoom();
   }


   addStudent() {
      //ENVIAR EL ID_COURSE
      const modalRef = this.ngModal.open(AddStudentComponent, { size: 'lg' });
      modalRef.componentInstance.course = this.course;
      modalRef.componentInstance.students = this.students;
      modalRef.componentInstance.id_user = this.id_user;

      modalRef.result.then((result) => {
         if (result) this.getEnrollments();
      });
   }

   getEnrollments() {
      this._enrollmentSrv.getEnrollmentsByCourseId(this.course.id_course)
         .subscribe(
            (result: any) => {
               console.log("enrollments: ", result)
               this.students = result.items;
               console.log("STUDENTS: ", this.students);
            },
            error => {
               console.log("error:", error);
            });
   }

   changeStatus(student) {
      console.log("student: ", student);

      this._enrollmentSrv.changeStatusEnrollment(this.course.id_course, student.id_user, !student.active)
         .subscribe(
            result => {
               console.log("enrollments: ", result)
               let status = student.active ? 'habilitado' : 'deshabilitado';
               student.active = !student.active;
               this.toastr.success(`El estudiante ha sido ${status} correctamente.`, `Estudiante ${status}!`);
            },
            error => {
               console.log("error:", error);
               let status = student.active ? 'habilitar' : 'deshabilitar';
               this.toastr.error(`No se ha podido ${status} al estudiante.`, 'Ha ocurrido un error!');
            });
   }

   deleteStudent(id_user) {

      this._enrollmentSrv.deleteEnrollment(this.course.id_course, id_user)
         .subscribe(
            result => {
               console.log("enrollments: ", result)
               this.successSwal.show();
               this.getEnrollments();
            },
            error => {
               console.log("error:", error);
            });
   }

   initIoConnection() {
      // No enviaré data por socket, solo me servirá para dar una señal y traer nueva data paginada desde el server.
      // Me llegaran todos los emits de todas los cursos. ¿Cómo solucionar esto?
      this.subscriptions$.add(this._enrollmentSrv.listenEnrollments()
         .subscribe((data) => {
            console.log("enrollment socket: ", data);
            this.getEnrollments();
         })
      );

      this.subscriptions$.add(this._enrollmentSrv.listenEnrollmentDeleted()
         .subscribe((data) => {
            console.log("enrollment socket deleted: ", data);
            this.getEnrollments();
         })
      );
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
      this.exitToCourseRoom();
   }

   enterToCourseRoom() {
      this._enrollmentSrv.enterToCourseRoom({ id_user: this.id_user, id_course: this.course.id_course })
   }

   exitToCourseRoom() {
      this._enrollmentSrv.exitToCourseRoom({ id_user: this.id_user, id_course: this.course.id_course })
   }
}
