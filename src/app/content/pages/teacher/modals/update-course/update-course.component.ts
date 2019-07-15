// Angular
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Servicios
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { CalendarService } from 'src/app/core/services/API/calendar.service';
import { CourseService } from 'src/app/core/services/API/course.service';
import { SessionService } from 'src/app/core/services/API/session.service';

@Component({
   selector: 'cw-update-course',
   templateUrl: './update-course.component.html',
   styleUrls: ['./update-course.component.scss']
})
export class UpdateCourseComponent implements OnInit, OnDestroy {
   @Input() course;

   courseForm: FormGroup;
   id_user;
   // Select Options
   options_subject;
   options_calendar;

   subscriptions$: Subscription;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private _calendarSrv: CalendarService,
      private _courseSrv: CourseService,
      private _sessionSrv: SessionService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      console.log("the course: ", this.course);
      this.id_user = this._sessionSrv.userSubject.value.id_user;
      this.initFormData();
      this.loadFormOptions();
      //this.loadFormData();
   }

   initFormData() {
      this.courseForm = this.fb.group({
         subject: ['', Validators.required],
         year: ['', Validators.required],
         semester: ['', Validators.required],
         code: [''],
         name: ['', [Validators.required, Validators.maxLength(15)]],
         active: [''],
         goalsForm: this.fb.group({
            course_goal: ['', Validators.required],
            student_goal: ['', Validators.required],
         }, { validator: this.validGoals }),
      });
   }

   loadFormData() {
      let _year = this.options_calendar.find(element => element.year == this.course.year);
      let _semester = _year.options.find(element => element.semester == this.course.semester);

      //ASIGNA LOS VALORES AL FORM
      this.courseForm.setValue({
         subject: this.course.id_subject,
         name: this.course.name,
         code: this.course.code.toUpperCase(),
         //active: this.activePipe.transform(value.active),
         active: this.course.active,
         year: _year.options,
         semester: _semester.id_calendar,
         goalsForm: {
            course_goal: this.course.course_goal.toString(),
            student_goal: this.course.student_goal.toString()
         }
      })
   }

   loadFormOptions() {
      this._subjectSrv.getSubjectsOptions()
         .subscribe(
            result => {
               this.options_subject = result;

            },
            error => {
               console.log("error:", error);
            });

      this._calendarSrv.getCalendarsOptions()
         .subscribe(
            result => {
               this.options_calendar = this.formatCalendarOptions(result);
               this.loadFormData();
               this.checkFormChanges();
            },
            error => {
               console.log("error:", error);
            });
   }

   validNumbers(value) {
      return value.replace(/[^0-9]/g, '');
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


   //VALIDADOR DE METAS
   validGoals(group: FormGroup) {
      const course_goal = Number(group.get('course_goal').value);
      const student_goal = Number(group.get('student_goal').value);
      if (student_goal > course_goal) return { invalidGoals: true }
      else return null;
   }

   updateCourse(course) {
      console.log("update: ", course);
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
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
            console.log(`changes: ${changes}, course.id_calendar: ${this.course.id_calendar}`)
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
            if (changes.length != new_value.length) {
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
            if (changes.length != new_value.length) {
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

}
