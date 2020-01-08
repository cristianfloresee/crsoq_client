//CREAR PROPIO DROPDOWN DE AÑOS....
//https://stackblitz.com/edit/angular-zs1rxp
//VER SI SE PUEDE CONFIGURAR ESTO_ https://valor-software.com/ngx-bootstrap/#/datepicker

// Angular
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Services
import { CalendarService } from 'src/app/core/services/API/calendar.service';
import { Subscription } from 'rxjs';
//import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';


@Component({
   selector: 'cw-modal-calendar',
   templateUrl: './modal-calendar.component.html',
   styleUrls: ['./modal-calendar.component.scss']
})
export class ModalCalendarComponent implements OnInit, OnDestroy {

   @Input() action; // Required
   @Input() calendar; // Optional

   calendarForm: FormGroup;
   calendarFormChanges$: Subscription;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _calendarSrv: CalendarService,
      private toastr: ToastrService,
   ) { }


   ngOnInit() {
      this.initFormData();
      if (this.calendar) {
         this.loadFormData(this.calendar);
         this.checkFormChanges();
      }
   }

   initFormData() {
      this.calendarForm = this.fb.group({
         year: ['', [Validators.min(2010), Validators.required]],
         semester: ['', Validators.required],
      });
   }

   loadFormData(calendar) {
      this.calendarForm.setValue({
         year: calendar.year,
         semester: calendar.semester
      });
   }

   formSubmit(calendar) {
      if (this.calendar) this.updateCalendar(calendar);
      else this.createCalendar(calendar);
   }

   updateCalendar(calendar) {
      
      this._calendarSrv.updateCalendar(calendar, this.calendar.id_calendar)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success('El período ha sido actualizado correctamente.', 'Período actualizado!');
            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               if (error.error.code && error.error.code == '23505') {
                  this.toastr.error('El período ya existe.', 'Ha ocurrido un error!');
               } else {
                  this.toastr.error('El período no ha sido actualizado.', 'Ha ocurrido un error!');
               }
            }
         );
   }

   createCalendar(calendar) {
      return this._calendarSrv.createCalendar(calendar)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success('El período ha sido creado correctamente.', 'Período creado!');
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

   checkFormChanges() {
      this.calendarFormChanges$ = this.calendarForm.valueChanges
         .subscribe((changes) => {
            for (let field in changes) {
               if (changes[field] === this.calendar[field]) this.calendarForm.get(field).markAsPristine();
            }
         });
   }

   ngOnDestroy(){
      if(this.calendarFormChanges$) this.calendarFormChanges$.unsubscribe();
   }

}
