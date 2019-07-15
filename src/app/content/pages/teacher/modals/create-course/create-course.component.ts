// Angular
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// RxJS
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Services
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { CalendarService } from 'src/app/core/services/API/calendar.service';
import { CourseService } from 'src/app/core/services/API/course.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SidemenuService } from 'src/app/core/services/sidemenu.service';

@Component({
   selector: 'cw-create-course',
   templateUrl: './create-course.component.html',
   styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit, OnDestroy {

   @Input() id_subject;
   @Input() action;
   @Input() course;

   courseForm: FormGroup;
   id_user;
   // Select Options
   options_subject;
   options_calendar;

   //DETECCIÓN DE CAMBIOS EN EL FORM
   nameChanges$: Subscription;
   subjectChanges$: Subscription;
   courseGoalChanges$: Subscription;
   studentGoalChanges$: Subscription;
   //courseFormChanges$: Subscription;
   yearChanges$: Subscription;
   semesterChanges$: Subscription;
   activeChanges$: Subscription;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private _calendarSrv: CalendarService,
      private _courseSrv: CourseService,
      private _sessionSrv: SessionService,
      private toastr: ToastrService,
      private _sidemenuSrv: SidemenuService
   ) { }

   ngOnInit() {
      console.log("COURSE: ", this.course);
      this.id_user = this._sessionSrv.userSubject.value.id_user;
      this.initFormData();
      this.loadFormOptions();



      if (this.id_subject) this.courseForm.patchValue({ subject: this.id_subject });
      this.checkValidFields();
      console.log("ID SUBJECT: ", this.id_subject);
   }

   loadFormData() {
      let _year = this.options_calendar.find(element => element.year == this.course.year);
      let _semester = _year.options.find(element => element.semester == this.course.semester);

      this.courseForm.setValue({
         subject: this.course.id_subject,
         year: _year.options,
         semester: _semester.id_calendar,
         name: this.course.name,
         active: this.course.active,
         goalsForm: {
            course_goal: this.course.course_goal.toString(),
            student_goal: this.course.student_goal.toString()
         }

      });
   }

   submitCourse(course) {
      if (this.course) this.updateCourse(course)
      else this.createCourse(course)
   }

   updateCourse(course) {
      let _course = { id_calendar: course.semester, id_subject: course.subject, name: course.name, active: course.active, course_goal: course.goalsForm.course_goal, student_goal: course.goalsForm.student_goal }
      this._courseSrv.updateCourse(this.course.id_course, _course)
         .subscribe(
            result => {
               this.activeModal.close(true)
               this._sidemenuSrv.changeSidemenuByRole(2);
               this.toastr.success('El curso ha sido actualizado correctamente.', 'Curso actualizado!');
            },
            error => {
               console.log("error: ", error);
               this.toastr.error('No se ha podido actualizar el curso.', 'Ha ocurrido un error!');
            }
         )
   }

   initFormData() {
      this.courseForm = this.fb.group({
         subject: ['', Validators.required],
         year: ['', Validators.required],
         semester: ['', Validators.required],
         name: ['', [Validators.required, Validators.maxLength(15)]],
         active: [''],
         goalsForm: this.fb.group({
            course_goal: ['', Validators.required],
            student_goal: ['', Validators.required],
         }, { validator: this.validGoals }),
      });
   }

   createCourse(course) {

      let _course = { id_calendar: course.semester, id_user: this.id_user, id_subject: course.subject, name: course.name, course_goal: course.goalsForm.course_goal, student_goal: course.goalsForm.student_goal }
      this._courseSrv.createCourse(_course)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this._sidemenuSrv.changeSidemenuByRole(2);
               this.toastr.success('El curso ha sido creado correctamente.', 'Curso creado!');
            },
            error => {
               console.log("error: ", error);
               this.toastr.error('No se ha podido crear el curso.', 'Ha ocurrido un error!');
            }
         );
   }

   loadFormOptions() {
      this._subjectSrv.getSubjectsOptions()
         .subscribe(
            result => {
               this.options_subject = result;
               //console.log("result: ", result);
            },
            error => {
               console.log("error:", error);
            });

      this._calendarSrv.getCalendarsOptions()
         .subscribe(
            result => {
               console.log("pika: ", result);
               this.options_calendar = this.formatCalendarOptions(result);
               if (this.course) {
                  this.loadFormData();
                  this.checkFormChanges();
               }
               // console.log("option_calendar: ", this.options_calendar);
            },
            error => {
               console.log("error:", error);
            });
   }

   formatCalendarOptions(data) {
      let new_data = data.reduce((object, item) => {
         object[item.year] = object[item.year] || [];
         object[item.year].push(item);
         return object;
      }, {})
      new_data = Object.keys(new_data).map(key => {
         return { year: key, options: new_data[key] }
      })
      return new_data;
   }

   checkValidFields() {

      this.subjectChanges$ = this.courseForm.get('year').valueChanges.subscribe(() => {
         this.courseForm.controls.semester.setValue('');
      });

      this.courseGoalChanges$ = this.courseForm.controls.goalsForm.get('course_goal').valueChanges.subscribe((changes) => {
         let new_value = this.validNumbers(changes)
         if (changes.length != new_value.length) this.courseForm.patchValue({ goalsForm: { course_goal: new_value, } }, { emitEvent: false });
      });

      this.studentGoalChanges$ = this.courseForm.controls.goalsForm.get('student_goal').valueChanges.subscribe((changes) => {
         let new_value = this.validNumbers(changes)
         if (changes.length != new_value.length) this.courseForm.patchValue({ goalsForm: { student_goal: new_value, } }, { emitEvent: false });
      });
   }

   validNumbers(value) {
      return value.replace(/[^0-9]/g, '');
   }

   //VALIDADOR DE METAS
   validGoals(group: FormGroup) {
      const course_goal = Number(group.get('course_goal').value);
      const student_goal = Number(group.get('student_goal').value);
      if (student_goal > course_goal) return { invalidGoals: true }
      else return null;
   }

   ngOnDestroy() {
      this.subjectChanges$.unsubscribe();
      this.courseGoalChanges$.unsubscribe();
      this.studentGoalChanges$.unsubscribe();
   }

   checkFormChanges() {

      this.subjectChanges$ = this.courseForm.get('subject').valueChanges.subscribe((changes) => {
         if (changes == this.course.id_subject) this.courseForm.get('subject').markAsPristine();
      })

      this.yearChanges$ = this.courseForm.get('year').valueChanges.subscribe(() => {
         this.courseForm.controls.semester.setValue('');
      });

      this.semesterChanges$ = this.courseForm.get('semester').valueChanges.subscribe(changes => {
         console.log(`changes: ${changes}, course.id_calendar: ${this.course.id_calendar}`)
         if (changes && changes == this.course.id_calendar) {
            this.courseForm.get('year').markAsPristine();
            this.courseForm.get('semester').markAsPristine();
         }
      })

      //DETECTA CAMBIOS EN EL NOMBRE DEL CURSO
      this.nameChanges$ = this.courseForm.get('name').valueChanges.subscribe((changes) => {
         if (changes == this.course.name) this.courseForm.get('name').markAsPristine();
      })

      //DETECTA CAMBIOS EN LA META DEL CURSO
      this.courseGoalChanges$ = this.courseForm.controls.goalsForm.get('course_goal').valueChanges.subscribe((changes) => {
         let new_value = this.validNumbers(changes)
         if (changes.length != new_value.length) {
            this.courseForm.patchValue({ goalsForm: { course_goal: new_value, } }, { emitEvent: false });
            this.courseForm.controls['goalsForm'].get('course_goal').markAsPristine();
         }
         else {
            if (new_value == this.course.course_goal) this.courseForm.controls['goalsForm'].get('course_goal').markAsPristine();
         }
      });

      //DETECTA CAMBIOS EN LA META DEL ESTUDIANTE
      this.studentGoalChanges$ = this.courseForm.controls.goalsForm.get('student_goal').valueChanges.subscribe((changes) => {
         let new_value = this.validNumbers(changes)
         if (changes.length != new_value.length) {
            this.courseForm.patchValue({ goalsForm: { student_goal: new_value, } }, { emitEvent: false });
            this.courseForm.controls['goalsForm'].get('student_goal').markAsPristine();
         }
         else {
            if (new_value == this.course.student_goal) this.courseForm.controls['goalsForm'].get('student_goal').markAsPristine();
         }
      });


      this.activeChanges$ = this.courseForm.get('active').valueChanges.subscribe((changes) => {
         if (changes == this.course.active) this.courseForm.get('active').markAsPristine();
      })
   }
}
