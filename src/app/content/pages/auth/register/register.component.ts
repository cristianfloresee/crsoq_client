// Angular
import { Component, OnInit, Input, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
//NG2-VALIDATION
//import { CustomValidators } from 'ng2-validation';
// rxjs
import { Subject, Subscription } from 'rxjs';
// Models
import { User } from '../../../../core/models/user.model';
// Services
import { UserService } from '../../../../core/services/API/user.service';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'cw-register',
   templateUrl: './register.component.html',
   styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

   @Input() action: string;
   @Output() actionChange = new Subject<string>();

   model: any = { email: '' };
   registerForm: FormGroup;
   loading: boolean;

   // Form Changes
   phoneChanges$: Subscription;
   documentChanges$: Subscription;

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
      this.checkValidFields();
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

      console.log("user: ", user);
      if (this.registerForm.invalid) {
         console.log("formulario invalido...");

         return;
      }


      this.loading = true;
      return this.userSrv.createUser(user)
         .subscribe(result => {
            this.loading = false;
            console.log("usuario creado: ", result);
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

   checkValidFields() {
      this.phoneChanges$ = this.registerForm.get('phone').valueChanges.subscribe((changes) => {
         const new_value = this.validNumbers(changes);
         if (changes.length != new_value.length) {
            this.registerForm.patchValue({ phone: new_value, }, { emitEvent: false });
            this.registerForm.get('phone').markAsPristine();
         }
      });

      this.documentChanges$ = this.registerForm.get('document').valueChanges.subscribe((changes) => {
         const new_value = this.validDocumentValue(changes);
         console.log("document: ", changes);
         if (changes.length != new_value.length) {
            this.registerForm.patchValue({ document: new_value, }, { emitEvent: false });
            this.registerForm.get('document').markAsPristine();
         }
      });
   }

   ngOnDestroy() {
      this.phoneChanges$.unsubscribe();
      this.documentChanges$.unsubscribe();
   }

   // Función Global: Util Service
   validNumbers(value) {
      return value.replace(/[^0-9]/g, '');
   }

   validDocumentValue(rut) {
      let largo_rut = rut.length;
      //SI EL INPUT TIENE MAS DE 9 DIGITOS BORRO EL ULTIMO DIGITO
      if (largo_rut > 9) rut = rut.substring(0, largo_rut - 1);
      else rut = rut.replace(/[^0-9\K\k]/g, ''); //REEMPLAZO CUALQUIER VALOR DISTINTO DE 0-9Kk

      return rut;
   }


}
