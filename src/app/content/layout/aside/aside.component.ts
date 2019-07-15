// Angular
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
// Servicios
import { RoleService } from '../../../core/services/role.service';
import { SidemenuService } from 'src/app/core/services/sidemenu.service';
import { SessionService } from 'src/app/core/services/API/session.service';

@Component({
   selector: 'cw-aside',
   templateUrl: './aside.component.html'
})
export class AsideComponent implements OnInit {

   currentRouteUrl: string = '';
   current_role;

   my_menu;

   subscriptions$: Subscription;

   constructor(
      private router: Router,
      private roleSrv: RoleService,
      private _sidemenuSrv: SidemenuService,
      private _sessionSrv: SessionService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();

      this.getCurrentUrl();

      // Detecta los cambios de la variable global 'role' (después usar redux en vez de servicios)
      this.subscriptions$.add(this.roleSrv.role$
         .subscribe((role: number) => {
            this.current_role = role; //{role, index, name, url}

            console.log(" + role$(", role, ") (on aside.component)");
            // Actualiza el sidemenú de acuerdo al 'role'
            if (role) {
               // Si recibe el objeto role envía el número de rol
               this._sidemenuSrv.changeSidemenuByRole(this.current_role.role);
            }
            else {
               // Si no recibe el objeto role envía null (sucede desde logout)
               console.log("changeSidemenu Null");
               this._sidemenuSrv.changeSidemenuByRole(null);
            }

            //SI SOY PROFESOR DEBO OBTENER LOS CURSOS........-----------------------------------------
            //console.log("MI ROLEEE: ", this.current_role);
         })
      );

      // Detecta los cambios del sidemenu que a su vez cambia de acuerdo al role
      // + Analizar esto. Es necesario suscribirse a ambos?
      this._sidemenuSrv.sidemenu$
         .subscribe((menu: any) => {
            this.my_menu = menu;
            console.log("MY MENUCITO: ", this.my_menu);
         })
   }


   //OBSERVABLE QUE OBTIENE LA URL ACTUAL LIMPIANDOLA DE PARÁMETROS
   getCurrentUrl() {
      this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
      this.router.events
         .pipe(filter(event => event instanceof NavigationEnd))
         .subscribe(() => this.currentRouteUrl = this.router.url.split(/[?#]/)[0]); //QUITA LOS PARÁMETROS DE LA URL (EJEMPLO: ?id=2)
   }

   // Identifica si el item recibido del menú es la página activa
   isItemActive(item) {

      // En inicio
      // Recibe vacío siempre, debe retonar true o false y pera en el else if
      // Si la url no es '/' y inicia con '/admin/(user)'
      if (!item && (this.currentRouteUrl === `/${this.current_role.url}`)) return true;
      else if (item && item.url !== '/' && this.currentRouteUrl.startsWith(`${item.parent}(${item.url})`)) return true;
      return false;
   }

   logout() {
      this._sessionSrv.logout();
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

}
