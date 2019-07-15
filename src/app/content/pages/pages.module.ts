// MODULOS ANGULAR
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULOS
import { PagesRoutingModule } from './pages-routing.module';
import { LayoutModule } from '../layout/layout.module';

// COMPONENTES
import { PagesComponent } from './pages.component';
import { ActionComponent } from './header/action/action.component';
import { ProfileComponent } from './header/profile/profile.component';
import { CoreModule } from '../../core/core.module';


@NgModule({
   imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule,
      CoreModule,
      PagesRoutingModule,
      LayoutModule
   ],
   declarations: [
      PagesComponent,
      ActionComponent,
      ProfileComponent
   ]
})
export class PagesModule { }
