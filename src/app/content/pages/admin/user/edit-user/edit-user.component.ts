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
   selector: 'cw-edit',
   templateUrl: './edit-user.component.html',
   styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
   @Input() user;
   userForm: FormGroup;
   userFormChanges$;

   add_roles;
   delete_roles;

   constructor(
      public fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _userSrv: UserService,
      private toastr: ToastrService,
   ) { }

   //ANGULAR HOOK EVENTS

   ngOnInit() {
      this.initFormData();
      this.loadFormData();
      this.checkFormChanges();
   }

   ngOnDestroy() {
      this.userFormChanges$.unsubscribe();
   }

   //ANOTHER FUNCTIONS

   initFormData() {
      this.userForm = this.fb.group({
         name: ['', Validators.required],
         last_name: ['', Validators.required],
         middle_name: ['', Validators.required],
         document: ['', Validators.required],
         email: ['', [Validators.required, Validators.email]],
         phone: ['', Validators.required],
         username: ['', Validators.required],
         active: [''],
         roles: this.fb.group({
            admin: [''],
            teacher: [''],
            student: []
         },
            { validator: this.requiredRoles('admin', 'teacher', 'student') })
      });
   }

   loadFormData() {
      this.userForm.setValue({
         name: this.user.name,
         last_name: this.user.last_name,
         middle_name: this.user.middle_name,
         document: this.user.document,
         email: this.user.email,
         phone: this.user.phone,
         username: this.user.username,
         active: this.user.active,
         roles: {
            admin: this.user.roles.includes(1) ? true : false,
            teacher: this.user.roles.includes(2) ? true : false,
            student: this.user.roles.includes(3) ? true : false
         }
      })
   }


   checkFormChanges() {
      this.userFormChanges$ = this.userForm.valueChanges
         .subscribe((changes) => {
            for (let field in changes) {
               if (field == 'roles') {
                  let roles = [];
                  if (changes[field].admin) roles.push(1);
                  if (changes[field].teacher) roles.push(2);
                  if (changes[field].student) roles.push(3);
                  if (this.arrIdentical(roles, this.user[field])) this.userForm.get(field).markAsPristine();

                  this.compareRoles(this.user['roles'], roles)
               }
               else if (changes[field] === this.user[field]) this.userForm.get(field).markAsPristine();
            }
         });
   }


   editUser(user) {
      //user.roles = this.user.roles;
      user.add_roles = this.add_roles;
      user.delete_roles = this.delete_roles;
      this._userSrv.updateUser(user, this.user.id_user)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success('El usuario ha sido actualizado correctamente.', 'Usuario actualizado!');
            },
            error => {
               console.log("error:", error);
               this.activeModal.close(false);
               this.toastr.error('El usuario no ha sido actualizado.', 'Ha ocurrido un error!');
            }
         );
   }

   //VALIDADOR
   requiredRoles(rol1, rol2, rol3) {
      return (result: FormGroup) => {
         if (!result.controls[rol1].value && !result.controls[rol2].value && !result.controls[rol3].value) return { requiredRole: true }
         else return null;
      }
   }

   //TIRARLO A UN SERVICIO
   arrIdentical(a1, a2) {
      let i = a1.length;
      if (i != a2.length) return false;
      while (i--) {
         if (a1[i] !== a2[i]) return false;
      }
      return true;
   }


   compareRoles(old_roles, new_roles) {
      this.delete_roles = old_roles.filter(x => !new_roles.includes(x));
      this.add_roles = new_roles.filter(x => !old_roles.includes(x));
   }


}
