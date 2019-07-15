//ANGULAR IMPORTS
import { Component, OnInit, Output, Input, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//RXJS
import { Subject } from 'rxjs';
//SERVICIOS
import { SessionService } from '../../../../core/services/API/session.service';
import { LoaderService } from '../../../../core/services/loader.service';
//LIBRERÍA TERCEROS
//import * as objectPath from 'object-path';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
   selector: 'cw-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   @Input() action: string;
   @Output() actionChange = new Subject<string>();

   loginForm: FormGroup;

   type;
   message;

   error_response = { show: false, title: '', message: '' };

   // errors_form = {
   //    email: '',
   //    password: ''
   // };

   // messages_validation = {
   //    email: {
   //       required: 'Este campo es requerido.',
   //       email: 'Este campo debe ser una dirección de correo electrónico válida.'
   //    },
   //    password: {
   //       required: 'Este campo es requerido.',
   //       minlength: 'La contraseña debe tener al menos 4 carácteres.'
   //    }
   // };

   constructor(
      fb: FormBuilder,
      public sessionSrv: SessionService,
      public loaderSrv: LoaderService,
      private toastr: ToastrService,
      public router: Router
   ) {
      this.type = 'success';
      this.message = `Usa la cuenta <strong>demo@demo.com</strong> y la contraseña
      <strong>demo</strong> para continuar.`;

      this.loginForm = fb.group({
         'email': ['', [Validators.required, Validators.email]],
         'password': ['', [Validators.required, Validators.minLength(4)]]
      });
   }

   ngOnInit() { }


   login() {
      this.loaderSrv.show();
      return this.sessionSrv.login(this.loginForm.value.email, this.loginForm.value.password)
         .subscribe(
            result => {
               console.log("sessionSrv.login(", result, ") (result)");
               this.error_response.show = false;

               if(result == 1) this.router.navigate(['/admin']);
               else if(result == 2) this.router.navigate(['/teacher']);
               else if(result == 3) this.router.navigate(['/student']);
               else this.router.navigate(['/']);

               this.loaderSrv.hide();
            },
            error => {
               console.log("error:", error);
               this.loaderSrv.hide();
               if (error.status == 0) {
                  this.error_response.show = true;
                  this.error_response.title = 'Error!';
                  this.error_response.message = 'Tenemos un problema en nuestros servidores.'
               }
               else if (error.message = '(email) or password incorrect.') {
                  this.error_response.show = true;
                  this.error_response.title = 'Error!';
                  this.error_response.message = 'correo electrónico o contraseña no válidos.'
               }
            });
   }

   //REEDIRECCIONAMIENTO A LA PÁGINA DE RECUPERACIÓN DE CONTRASEÑA
   forgotPasswordPage() {
      this.action = 'forgot-password';
      this.actionChange.next(this.action);
   }

}
