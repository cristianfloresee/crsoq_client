
// Angular
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// rxjs
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetalert2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { SWAL_DELETE_STUDENT, SWAL_SUCCESS_DELETE_STUDENT } from 'src/app/config/swal_config';
// Services
import { EnrollmentService } from 'src/app/core/services/API/enrollments.service';
import { UserService } from 'src/app/core/services/API/user.service';

@Component({
   selector: 'cw-add-student',
   templateUrl: './add-student.component.html',
   styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit, OnDestroy {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;
   SWAL_DELETE_STUDENT = SWAL_DELETE_STUDENT;
   SWAL_SUCCESS_DELETE_STUDENT = SWAL_SUCCESS_DELETE_STUDENT;

   @Input() course;
   @Input() students;
   @Input() id_user;

   // Resultados de la búsqueda
   results;

   subscriptions$: Subscription;
   // Form
   studentForm: FormGroup;

   // Estado para indicar si se actualizo data en el modal
   data_updated: boolean;
   constructor(
      private _enrollmentSrv: EnrollmentService,
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _userSrv: UserService,
      private toastr: ToastrService,
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.initFormData();
      console.log("cursito: ", this.course);
      console.log("students: ", this.students);
      this.initIoConnection();
   }


   initFormData() {
      this.studentForm = this.fb.group({
         query_field: ['hola'],
         document: ['', Validators.required],
      });


      this.subscriptions$.add(this.studentForm.get('query_field').valueChanges.pipe(
         debounceTime(200),
         distinctUntilChanged(),
         switchMap((document) => this._userSrv.getUsersByDocumentId(document, this.course.id_course))
      )
         .subscribe(
            (result: any) => {
               this.results = result.items;
               console.log("stack: ", result)
            },
            (error) => {
               console.log("error:", error);
            })
      );

      // .valueChanges.subscribe((changes) => {
      //    console.log("search: ", changes);
      // })
   }


   // getEnrollments() {
   //    this._enrollmentSrv.getEnrollmentsByCourseId(this.course.id_course)
   //       .subscribe(
   //          result => {
   //             console.log("enrollments: ", result)
   //          },
   //          error => {
   //             console.log("error:", error);
   //          });
   // }

   searchStudent(student) {
      this._userSrv.getUsersByDocumentId(student.document, this.course.id_course)
         .subscribe(
            (result: any) => {
               this.results = result.items;
               console.log("search results: ", result)
            },
            error => {
               console.log("error:", error);
            });
   }


   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

   createEnrollment(student) {
      console.log("enroll student: ", student.id_user);
      this._enrollmentSrv.createEnrollment(this.course.id_course, student.id_user)
         .subscribe(
            result => {
               student.enrolled = !student.enrolled;
               console.log("enrollments: ", result)
               this.getEnrollments();
               this.toastr.success(`El estudiante ha sido inscrito correctamente.`, `Estudiante Inscrito!`);
               this.data_updated = true;
            },
            error => {
               console.log("error:", error);
               this.toastr.error(`No se ha podido inscribir al estudiante.`, 'Ha ocurrido un error!');
            });

   }

   deleteEnrollment(student) {
      console.log("delete: ", student);

      this._enrollmentSrv.deleteEnrollment(this.course.id_course, student.id_user)
         .subscribe(
            result => {
               console.log("enrollments: ", result)
               student.enrolled = !student.enrolled;
               this.successSwal.show();
               //this.getEnrollments();

               // Elimino al estudiante de la lista
               const user_index = this.students.findIndex(_student => _student.id_user == student.id_user);
               if (user_index >= 0) this.students.splice(user_index, 1);

            },
            error => {
               console.log("error:", error);
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

}
