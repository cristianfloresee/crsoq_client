import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../../../core/services/API/session.service';
//MODELOS
import { User } from '../../../../../core/models/user.model';

@Component({
   selector: 'cw-user-profile',
   templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {

   constructor(
      private _sessionSrv: SessionService,
   ) {

   }

   ngOnInit() {
   }

   logout() {
      this._sessionSrv.logout();
   }

}
