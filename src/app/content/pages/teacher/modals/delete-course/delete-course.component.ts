import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from 'src/app/core/services/API/course.service';
import { Router } from '@angular/router';

@Component({
   selector: 'cw-delete-course',
   templateUrl: './delete-course.component.html',
   styleUrls: ['./delete-course.component.scss']
})
export class DeleteCourseComponent implements OnInit {
   @Input() course;
   @Input() reedirect;
   courseForm: FormGroup;

   constructor(
      public fb: FormBuilder,
      private router: Router,
      public activeModal: NgbActiveModal,
      private _courseSrv: CourseService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.initFormData();
   }

   initFormData() {
      this.courseForm = this.fb.group({
         name: ['', [Validators.required, this.validName(this.course.name)]]
      });
   }

   deleteCourse() {
      this._courseSrv.deleteCourse(this.course.id_course)
         .subscribe(
            result => {
               console.log("result: ", result);
               this.activeModal.close(true);
               this.toastr.success('El curso ha sido eliminado correctamente.', 'Curso eliminado!');
               //Reedireccionar al inicio del profe
               //http://localhost:4200/teacher
               if(this.reedirect) this.router.navigate(['/teacher']);
            },
            error => {
               console.log("error:", error);
               this.toastr.error('El curso no ha sido eliminado.', 'Ha ocurrido un error!');

            });
   }

   validName(name_to_match: string): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
         const course_name = control.value;
         if (course_name != name_to_match) return { invalidName: true }
         else return null;
      }
   }



}
