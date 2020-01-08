// Angular
import { Component, OnInit } from "@angular/core";
// Services
import { UserService } from "src/app/core/services/API/user.service";
import { CalendarService } from "src/app/core/services/API/calendar.service";
import { SubjectService } from "src/app/core/services/API/subject.service";

@Component({
   selector: "cw-admin",
   templateUrl: "./admin.component.html",
   styles: []
})
export class AdminComponent implements OnInit {
   total_users;
   total_calendars;
   total_subjects;

   constructor(
      private _userSrv: UserService,
      private _calendarSrv: CalendarService,
      private _subjectSrv: SubjectService
   ) {}

   ngOnInit() {
      this._userSrv.countUser().subscribe(
         (response: any) => {
            console.log(response);
            this.total_users = response.result;
         },
         error => {
            console.log("error:", error);
         }
      );

      this._calendarSrv.countCalendar().subscribe(
         (response: any) => {
            console.log("total calendars: ", response);
            this.total_calendars = response.result;
         },
         error => {
            console.log("error:", error);
         }
      );

      this._subjectSrv.countSubject().subscribe(
         (response: any) => {
            console.log(response);
            this.total_subjects = response.result;
         },
         error => {
            console.log("error:", error);
         }
      );
   }
}
