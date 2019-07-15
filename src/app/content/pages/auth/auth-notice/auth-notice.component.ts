import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'cw-auth-notice',
   templateUrl: './auth-notice.component.html'
})
export class AuthNoticeComponent implements OnInit {

   type;
   message;

   constructor() {
      this.type = 'info';
      this.message = `Use la cuenta <strong>admin@demo.com</strong> y la contraseña
      <strong>demo</strong> para continuar.`;
   }

   ngOnInit() {
   }

}
