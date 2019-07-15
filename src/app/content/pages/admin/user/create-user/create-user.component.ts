//ANGULAR
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//NG-BOOTSTRAP
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//SERVICIOS
import { UserService } from '../../../../../core/services/API/user.service';
//NGX-TOASTR
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'cw-create-user',
   templateUrl: './create-user.component.html',
   styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

   userForm: FormGroup;
   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _userSrv: UserService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.initFormData();
      console.log("USEFORM: ", this.userForm);
   }

   initFormData() {
      this.userForm = this.fb.group({
         name: ['', Validators.required],
         last_name: ['', Validators.required],
         middle_name: ['', Validators.required],
         document: ['', Validators.required],
         email: ['', [Validators.required, Validators.email]],
         phone: ['', Validators.required],
         username: ['', Validators.required],
         active: [true],
         password: ['', Validators.required],
         password2: ['', Validators.required],
         roles: this.fb.group({
            admin: [''],
            teacher: [''],
            student: ['']
         }, { validator: this.requiredRoles('admin', 'teacher', 'student') })
      }, { validator: this.equalPasswords('password', 'password2') }
      );
   }

   //VALIDADOR
   requiredRoles(rol1, rol2, rol3) {

      return (result: FormGroup) => {
         console.log("requiredRoles validation...");
         if (!result.controls[rol1].value && !result.controls[rol2].value && !result.controls[rol3].value) return { requiredRole: true }
         else return null;
      }
   }

   createUser(user) {
      console.log("create user: ", user);
      user.roles = this.formatRoleArray(user.roles);

      return this._userSrv.createUser(user)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El usuario ha sido creado correctamente.', 'Usuario creado!');
            },
            error => {
               console.log("error: ", error);
               if (error.error.status == '010') {
                  this.toastr.error('El nombre de usuario ya existe.', 'Ha ocurrido un error!');
               }
               //console.log("error code:", error);
               // this.activeModal.close(false);
               // if (error.error.code && error.error.code == '23505') {
               //    this.toastr.error('El período ya existe.', 'Ha ocurrido un error!');
               // } else {
               //    this.toastr.error('El período no ha sido creado.', 'Ha ocurrido un error!');
               // }

            }
         );

   }

   formatRoleArray(array) {
      let roles = [];
      if (array.admin) roles.push(1);
      if (array.teacher) roles.push(2);
      if (array.student) roles.push(3);
      return roles;
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
