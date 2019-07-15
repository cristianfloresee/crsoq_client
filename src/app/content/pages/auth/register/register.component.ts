//ANGULAR IMPORTS
import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
//NG2-VALIDATION
//import { CustomValidators } from 'ng2-validation';
//RXJS
import { Subject } from 'rxjs';
//MODELOS
import { User } from '../../../../core/models/user.model';
//SERVICIOS
import { UserService } from '../../../../core/services/API/user.service';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'cw-register',
   templateUrl: './register.component.html',
   styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

   @Input() action: string;
   @Output() actionChange = new Subject<string>();

   model: any = { email: '' };
   registerForm: FormGroup;

   constructor(
      private toastr: ToastrService,
      public fb: FormBuilder,
      public router: Router,
      public userSrv: UserService
   ) {
      this.registerForm = fb.group({
         'name': ['', Validators.required],
         'lastname': ['', Validators.required],
         'middlename': ['', Validators.required],
         'document': ['', Validators.required],
         'email': ['', [Validators.required, Validators.email]],
         'phone': ['', Validators.required],
         'username': ['', Validators.required],
         'password': ['', Validators.required],
         'password2': ['', Validators.required],
         'conditions': [false, Validators.required]
      },
         { validator: this.equalPasswords('password', 'password2') }

      );
   }

   ngOnInit() {

   }

   loginPage() {
      this.action = 'login';
      this.actionChange.next(this.action);
   }

   submit() {
      console.log(this.registerForm.value);
      console.log(this.registerForm.valid);
      console.log(this.registerForm);


      const { name, lastname, middlename, document, email, phone, username, password } = this.registerForm.value;
      let user = new User(name, lastname, middlename, document, email, phone, username, password);


      if (this.registerForm.invalid) {
         console.log("formulario invalido...");

         return;
      }



      return this.userSrv.createUser(user)
         .subscribe(result => {
            console.log("result: ", result);
            this.loginPage();
            this.toastr.success('Acción realizada', 'Usuario creado correctamente', {
               closeButton: true,
               progressBar: true,
               progressAnimation: 'increasing'
            });
         })
   }

   //COMPRUEBA SI LAS CONTRASEÑAS SON IGUALES
   equalPasswords(password1, password2) {
      return (result: FormGroup) => {
         let pass1 = result.controls[password1].value;
         let pass2 = result.controls[password2].value;

         if (pass1 === pass2) return null;
         return { areEquals: true }
      }
   }

}
