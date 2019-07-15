//ANGULAR
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//SERVICIOS
import { CalendarService } from 'src/app/core/services/API/calendar.service';
//COMPONENTES
import { CreateCalendarComponent } from './create-calendar/create-calendar.component';
import { EditCalendarComponent } from './edit-calendar/edit-calendar.component';
// ngx-sweetalert2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { SWAL_DELETE_CALENDAR, SWAL_SUCCESS_DELETE_CALENDAR } from 'src/app/config/swal_config';
import { PAGE_SIZES } from 'src/app/config/constants';


@Component({
   selector: 'cw-calendar',
   templateUrl: './calendar.component.html',
   styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   SWAL_DELETE_CALENDAR = SWAL_DELETE_CALENDAR;
   SWAL_SUCCESS_DELETE_CALENDAR = SWAL_SUCCESS_DELETE_CALENDAR;

   // Filter Form
   filterForm: FormGroup;

   // Filter Lock
   lock_year = '';

   // Records
   calendars: any[] = [];

   // Pagination
   total_items = 0;
   total_pages;
   page_size = 20;
   page_sizes = PAGE_SIZES;
   page = 1;
   from = ((this.page - 1) * this.page_size);

   constructor(
      private fb: FormBuilder,
      private ngModal: NgbModal,
      private _calendarSrv: CalendarService
   ) {
      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         // Ver si se puede dejar de depender de los locks(lock_year)
         // Validador length 4 pero que acepte vacío para quitar filtro
         year: [this.lock_year, []]
      });
   }

   ngOnInit() {
      this.getCalendars();
   }

   getCalendars(params?) {
      params = Object.assign({}, params);
      this._calendarSrv.getCalendars(params)
         .subscribe(
            (result: any) => {
               console.log("result: ", result);
               this.calendars = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
            },
            error => {
               console.log("error:", error);
            });
   }

   openCalendarEdit(calendar) {
      const modalRef = this.ngModal.open(EditCalendarComponent);
      modalRef.componentInstance.calendar = calendar;

      modalRef.result.then((result) => {
         if (result) this.getCalendars()
      });
   }



   deleteCalendar(id_calendar) {

      this._calendarSrv.deleteCalendar(id_calendar)
         .subscribe(
            result => {
               console.log("result: ", result);

               this.successSwal.show();
               this.getCalendars()
            },
            error => {
               console.log("error:", error);
            });
   }

   openCreateCalendar() {
      const modalRef = this.ngModal.open(CreateCalendarComponent);
      modalRef.result.then((result) => {
         if (result) this.getCalendars()
      });
   }

   // ----------------------------------------
   // Filtra los registros de la tabla
   // ----------------------------------------
   filterItems(params) {
      console.log("XX: ", params);
      // Establece los params de filtro para no repetir la misma búsqueda
      this.lock_year = params.year;
      //Interface: { year, page, page_size}
      this.getCalendars(params);
   }

   //SI NO FUNCIONA INPUT USAR KEYUP
   validSearch(value) {
      console.log(value);
      let search = this.validYear(value, 4);
      this.filterForm.controls.year.setValue(search);
   }

   // Elimina elementos de un input (podría dejarlo en un servicio)
   validYear(value, limit) {
      console.log(`value: ${value}, limit: ${limit}, value.length: ${value.length}, typeof: ${typeof (value)}`);
      if (value.length > limit) value = value.slice(0, limit); //SACAR LOS PRIMEROS 4
      return value;
   }

   changePage(params) {
      this.page_size = params.page_size;
      this.getCalendars(params);
   }

   getUsersPage(page) {
      if (page != 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getCalendars({ page: this.page });
      }
   }

}
