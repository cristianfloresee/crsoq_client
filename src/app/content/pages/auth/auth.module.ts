//MODULOS ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//COMPONENTES
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
//ANGULAR MATERIAL
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatProgressSpinnerModule } from '@angular/material';
//MODULOS
import { CoreModule } from '../../../core/core.module';
//SWEET-ALERT2
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

//SERVICIOS

@NgModule({
   imports: [
      //ANGULAR
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      CoreModule,
      //ANGULAR MATERIAL
      MatButtonModule,
      MatInputModule,
      MatFormFieldModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      //SWEET-ALERT2
      SweetAlert2Module,
      //ROUTER
      RouterModule.forChild([
         {
            path: '',
            component: AuthComponent
         }
      ])
   ],
   declarations: [
      //COMPONENTES
      AuthComponent,
      LoginComponent,
      AuthNoticeComponent,
      ForgotPasswordComponent,
      RegisterComponent
   ]
})
export class AuthModule { }
