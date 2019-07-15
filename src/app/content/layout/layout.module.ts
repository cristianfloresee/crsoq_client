//MODULOS ANGULAR
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

//COMPONENTES LAYOUT
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
//COMPONENTES LAYOUT > HEADER
import { BrandComponent } from './header/brand/brand.component';
import { MenuHorizontalComponent } from './header/menu-horizontal/menu-horizontal.component';
import { TopbarComponent } from './header/topbar/topbar.component';
//COMPONENTES LAYOUT > HEADER > TOPBAR
import { UserProfileComponent } from './header/topbar/user-profile/user-profile.component';
import { UserRoleComponent } from './header/topbar/user-role/user-role.component';
import { QuickActionComponent } from './header/topbar/quick-action/quick-action.component';
import { NotificationComponent } from './header/topbar/notification/notification.component';
import { SearchDropdownComponent } from './header/topbar/search-dropdown/search-dropdown.component';

//LOADING-BAR
import { LoadingBarModule } from '@ngx-loading-bar/core';
//BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//ANGULAR MATERIAL
import { MatProgressBarModule, MatTabsModule, MatButtonModule, MatTooltipModule } from '@angular/material';
//PERFECT-SCROLLBAR
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LanguageSelectorComponent } from './header/topbar/language-selector/language-selector.component';
import { CoreModule } from '../../core/core.module';
import { SubheaderComponent } from './subheader/subheader.component';
import { AsideComponent } from './aside/aside.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
   // suppressScrollX: true
};

@NgModule({
   exports: [
      //COMPONENTES LAYOUT
      HeaderComponent,
      FooterComponent,
      SubheaderComponent,
      AsideComponent,
      //COMPONENTES LAYOUT > HEADER
      BrandComponent,
      MenuHorizontalComponent,
      TopbarComponent,
      //COMPONENTES LAYOUT > HEADER > TOPBAR
      UserProfileComponent,
      UserRoleComponent,
      QuickActionComponent,
      NotificationComponent,
      SearchDropdownComponent
   ],
   providers: [
      {
         provide: PERFECT_SCROLLBAR_CONFIG,
         useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      }
   ],
   imports: [
      //MODULOS ANGULAR
      CommonModule,
      RouterModule,
      FormsModule,
      CoreModule,
      //BOOTSTRAP
      NgbModule,
      //ANGULAR MATERIAL
		MatProgressBarModule,
		MatTabsModule,
		MatButtonModule,
		MatTooltipModule,
      //PERFECT-SCROLL
      PerfectScrollbarModule,
      //LOADING-BAR
      LoadingBarModule.forRoot()
   ],
   declarations: [
      //COMPONENTES LAYOUT
      HeaderComponent,
      FooterComponent,
      SubheaderComponent,
      AsideComponent,
      //COMPONENTES LAYOUT > HEADER
      BrandComponent,
      MenuHorizontalComponent,
      TopbarComponent,
      //COMPONENTES LAYOUT > HEADER > TOPBAR
      UserProfileComponent,
      QuickActionComponent,
      NotificationComponent,
      SearchDropdownComponent,
      UserRoleComponent,
      LanguageSelectorComponent,
      SubheaderComponent,
      AsideComponent
   ]
})
export class LayoutModule { }
