// Angular
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Modals
import { DeleteCourseComponent } from '../../../modals/delete-course/delete-course.component';
// Services
import { CourseService } from 'src/app/core/services/API/course.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { CalendarService } from 'src/app/core/services/API/calendar.service';


//DEJAR EL FORM EN UN SOLO NIVEL

@Component({
   selector: 'cw-general',
   templateUrl: './general.component.html',
   styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
   @Input() id_course; // Required

   //FORMULARIO
   courseForm: FormGroup;
   id_user;
   course;
   //OPCIONES DE SELECTOR
   options_subject;
   options_calendar;

   subscriptions$: Subscription;

   constructor(
      private _sessionSrv: SessionService,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private _courseSrv: CourseService,
      private ngModal: NgbModal,
      private _subjectSrv: SubjectService,
      private _calendarSrv: CalendarService
   ) {
      this.id_user = this._sessionSrv.userSubject.value.id_user;
   }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.initFormData();
      this.loadFormOptions(); //ARREGLAR ESTO DESPUES PORQUE PUEDE CAMBIAR CON EL USO DE SOCKETS..
      
      this.checkFormChanges();
   }

   ngOnChanges() {
      this.getCourseDetail(this.id_course);
   }

   getCourseDetail(id_course) {
      this._courseSrv.getCourseDetail(id_course)
         .subscribe(value => {
            this.course = value;
            setTimeout(() => {
               if (this.options_calendar) this.loadFormData(value);
               else console.log("xx: ", this.options_calendar)
            }, 200)

         });
   }

   deleteCourse() {
      const modalRef = this.ngModal.open(DeleteCourseComponent);
      modalRef.componentInstance.course = this.course;
      modalRef.componentInstance.reedirect = true;
   }

   initFormData() {
      this.courseForm = this.fb.group({
         subject: ['', [Validators.required]],
         name: ['', [Validators.required]],
         code: ['', Validators.required],
         active: ['', Validators.required],
         year: ['', Validators.required],
         semester: ['', Validators.required],
         goalsForm: this.fb.group({
            course_goal: ['', Validators.required],
            student_goal: ['', Validators.required],
         }, { validator: this.validGoals })
      });
   }

   loadFormData(course) {
      let _year = this.options_calendar.find(element => element.year == course.year);
      let _semester = _year.options.find(element => element.semester == course.semester);

      console.log("loadFormData: ", course);
      this.courseForm.setValue({
         subject: course.id_subject,
         name: course.name,
         code: course.code.toUpperCase(),
         //active: this.activePipe.transform(value.active),
         active: course.active,
         year: _year.options,
         semester: _semester.id_calendar,
         goalsForm: {
            course_goal: course.course_goal.toString(),
            student_goal: course.student_goal.toString()
         }
      });
   }

   resetFormData() {
      this.loadFormData(this.course);
      //this.courseForm.markAsPristine();
   }

   loadFormOptions() {
      this._subjectSrv.getSubjectsOptions()
         .subscribe(
            result =>  this.options_subject = result,
            error => {
               console.log("error:", error);
            });
      //CARGA LOS AÑOS Y SEMESTRES (CALENDARIO)
      this._calendarSrv.getCalendarsOptions()
         .subscribe(
            result => this.options_calendar = this.formatCalendarOptions(result),
            error => {
               console.log("error:", error);
            });
   }



   //DEJARLO EN UN SERVICIO UTILS
   formatCalendarOptions(data) {
      let new_data = data.reduce((object, item) => {
         object[item.year] = object[item.year] || [];
         object[item.year].push(item);
         return object;
      }, {})
      new_data = Object.keys(new_data).map(key => {
         return { year: key, options: new_data[key] }
      })
      //console.log("calendar: ", new_data);
      return new_data;
   }

   //VERIFICAR SI CAMBIA ALGO ANTES DE HACER UPDATE..


   //VALIDADOR DE METAS
   validGoals(group: FormGroup) {
      const course_goal = Number(group.get('course_goal').value);
      const student_goal = Number(group.get('student_goal').value);
      if (student_goal > course_goal) return { invalidGoals: true }
      else return null;
   }

   checkFormChanges() {

      this.subscriptions$.add(this.courseForm.get('subject').valueChanges
         .subscribe((changes) => {
            if (changes == this.course.id_subject) this.courseForm.get('subject').markAsPristine();
         })
      );

      this.subscriptions$.add(this.courseForm.get('year').valueChanges
         .subscribe(() => {
            this.courseForm.controls.semester.setValue('');
         })
      );

      this.subscriptions$.add(this.courseForm.get('semester').valueChanges
         .subscribe(changes => {
            if (changes && changes == this.course.id_calendar) {
               this.courseForm.get('year').markAsPristine();
               this.courseForm.get('semester').markAsPristine();
            }
         })
      );

      //DETECTA CAMBIOS EN EL NOMBRE DEL CURSO
      this.subscriptions$.add(this.courseForm.get('name').valueChanges
         .subscribe((changes) => {
            if (changes == this.course.name) this.courseForm.get('name').markAsPristine();
         })
      );

      //DETECTA CAMBIOS EN LA META DEL CURSO
      this.subscriptions$.add(this.courseForm.controls.goalsForm.get('course_goal').valueChanges
         .subscribe((changes) => {
            let new_value = this.validNumbers(changes)
            if (changes && changes.length != new_value.length) {
               this.courseForm.patchValue({ goalsForm: { course_goal: new_value, } }, { emitEvent: false });
               this.courseForm.controls['goalsForm'].get('course_goal').markAsPristine();
            }
            else {
               if (new_value == this.course.course_goal) this.courseForm.controls['goalsForm'].get('course_goal').markAsPristine();
            }
         })
      );

      //DETECTA CAMBIOS EN LA META DEL ESTUDIANTE
      this.subscriptions$.add(this.courseForm.controls.goalsForm.get('student_goal').valueChanges
         .subscribe((changes) => {
            let new_value = this.validNumbers(changes)
            if (changes && changes.length != new_value.length) {
               this.courseForm.patchValue({ goalsForm: { student_goal: new_value, } }, { emitEvent: false });
               this.courseForm.controls['goalsForm'].get('student_goal').markAsPristine();
            }
            else {
               if (new_value == this.course.student_goal) this.courseForm.controls['goalsForm'].get('student_goal').markAsPristine();
            }
         })
      );

      this.subscriptions$.add(this.courseForm.get('active').valueChanges
         .subscribe((changes) => {
            if (changes == this.course.active) this.courseForm.get('active').markAsPristine();
         })
      );
   }

   //QUITA VALORES QUE NO SEAN NÚMEROS
   validNumbers(value: string) {
      return value; //value.replace(/[^0-9]/g, '');
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

   updateCourse(course) {

      let _course = { id_calendar: course.semester, id_subject: course.subject, name: course.name, active: course.active, course_goal: course.goalsForm.course_goal, student_goal: course.goalsForm.student_goal }
      this._courseSrv.updateCourse(this.id_course, _course)
         .subscribe(
            () => {
               this.toastr.success('El curso ha sido creado correctamente.', 'Curso creado!');
            },
            error => {
               console.log("error: ", error);
               this.toastr.error('No se ha podido crear el curso.', 'Ha ocurrido un error!');
            }
         )
   }

}
