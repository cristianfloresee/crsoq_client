//ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//CONSTANTES
import { API } from '../../../config/constants';
//SERVICIOS
import { SessionService } from './session.service';
//RXJS
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable()
export class CalendarService {

   constructor(
      public http: HttpClient
   ) {}

   getCalendars(params){
      // + Necesito una interface:
      // + { year, page, page_size }
      return this.http.get(API.CALENDARS, { params })
   }

   // Interface: {  }
   getCalendarsOptions(params?) {
      return this.http.get(API.CALENDARS_AS_SELECT_OPTION, { params });
   }

   createCalendar(calendar) {
      const { year, semester } = calendar;
      return this.http.post(API.CALENDARS, { year, semester });
   }

   updateCalendar(calendar, id_calendar) {

      const { year, semester } = calendar;

      return this.http.put(`${API.CALENDARS}/${id_calendar}`, { year, semester })
         .pipe(
            map((response: any) => {
               console.log("RESPONSE: ", response);
               return true;
            }),
            catchError(err => {
               console.log("error en el service: ", err)
               return throwError(err);
            })
         );
   }

   deleteCalendar(id_calendar) {
      return this.http.delete(`${API.CALENDARS}/${id_calendar}`);
   }

   countCalendar() {
      return this.http.get(`${API.CALENDAR_COUNT}`);
   }

}
