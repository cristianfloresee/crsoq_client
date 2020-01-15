// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-toastr
import { ToastrService } from 'ngx-toastr';
// Models
import { User } from '../../../../core/models/user.model';
// Services
import { SessionService } from '../../../../core/services/API/session.service';
import { UserService } from '../../../../core/services/API/user.service';
import { LoaderService } from '../../../../core/services/loader.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'cw-profile',
   templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

   user: User;
   user_image;
   profileForm: FormGroup;
   subscriptions$: Subscription;

   constructor(
      public _sessionSrv: SessionService,
      public _userSrv: UserService,
      public _loaderSrv: LoaderService,
      public fb: FormBuilder,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.user = this._sessionSrv.userSubject.value;
      this.subscriptions$.add(this._sessionSrv.user$
         .subscribe(value => this.user = value)
      );

      this.initForm();
   }

   initForm(){
      this.profileForm = this.fb.group({
         'name': [this.user.name, [Validators.required]],
         'last_name': [this.user.last_name, [Validators.required, Validators.minLength(4)]],
         'middle_name': [this.user.middle_name, Validators.required],
         'document': [this.user.document, Validators.required],
         'email': [this.user.email, [Validators.required, Validators.email]],
         'phone': [this.user.phone, Validators.required],
         'username': [this.user.username, Validators.required]
      });
   }

   saveUserData() {

      this._loaderSrv.show();

      return this._userSrv.updateUser(this.profileForm.value)
         .subscribe(
            (response) => {
               this.toastr.success('El usuario ha sido actualizado correctamente.', 'Usuario actualizado!');
               console.log("response(profile.component): ", response);
               this._loaderSrv.hide();
            },
            (error) => {
               console.log("error: ", error);
               this._loaderSrv.hide();
               this.toastr.error('El usuario no ha sido actualizado.', 'Ha ocurrido un error!');
            })

   }

   saveUserImage() {
      console.log("save user image...");
   }

   selectImage(file: File) {
      if (!file) {
         return;
      }

      console.log("select image... ", event);
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

}
