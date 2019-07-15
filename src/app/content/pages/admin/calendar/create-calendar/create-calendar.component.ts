//ANGULAR
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//SERVICIOS
import { CalendarService } from 'src/app/core/services/API/calendar.service';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';


@Component({
   selector: 'cw-create-calendar',
   templateUrl: './create-calendar.component.html',
   styleUrls: ['./create-calendar.component.scss']
})
export class CreateCalendarComponent implements OnInit {

   calendarForm: FormGroup;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _calendarSrv: CalendarService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.initFormData();
   }

   initFormData() {
      this.calendarForm = this.fb.group({
         year: ['', [Validators.min(2010), Validators.max(3000), Validators.required]],
         semester: ['', Validators.required],
      });
   }

   createCalendar(calendar) {

      return this._calendarSrv.createCalendar(calendar)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El usuario ha sido creado correctamente.', 'Usuario actualizado!');
            },
            error => {
               console.log("error code:", error);
               this.activeModal.close(false);
               if (error.error.code && error.error.code == '23505') {
                  this.toastr.error('El período ya existe.', 'Ha ocurrido un error!');
               }else{
                  this.toastr.error('El período no ha sido creado.', 'Ha ocurrido un error!');
               }

            }
         );
   }
}
