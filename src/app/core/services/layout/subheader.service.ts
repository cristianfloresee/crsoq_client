import { Injectable } from '@angular/core';
//SERVICIOS
import { Router, NavigationEnd } from '@angular/router';
//OBJECT-PATH
import * as objectPath from 'object-path';
//RXJS
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
//CONSTANTES
import { PAGE_TITLES } from '../../../config/constants';
//MODELOS

@Injectable()
export class SubheaderService {

   title$: BehaviorSubject<string> = new BehaviorSubject('');
   page_config;

   constructor(
      private router: Router,
   ) {
      this.updateTitlePage();

      //CAMBIA EL TITULO CUANDO CAMBIA LA RUTA
      this.router.events
         .pipe(filter(event => event instanceof NavigationEnd))
         .subscribe(() => {

            this.updateTitlePage()
            // get updated breadcrumbs on every route changed
            // this.updateBreadcrumbs();
            // breadcrumbs was appended before, reuse it for this page
            /*if (objectPath.get(this.appendingBreadcrumbs, this.router.url)) {
               this.appendBreadcrumbs(this.appendingBreadcrumbs[this.router.url]);

            }*/
         });


   }

   setTitle(title: string) {

   }

   //ACTUALIZA EL TÍTULO DE PÁGINA
   updateTitlePage() {
      let title = objectPath.get(PAGE_TITLES[this.router.url.substring(1).replace(/\//g, '.') || '/'], 'title');
      if (title) this.title$.next(title);
      else this.title$.next(null);
   }

}
