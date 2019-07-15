//ESTE SERVICIOS PERMITE OBTENER EL NOMBRE DE LA PÁGINA ACTUAL A TRAVÉS DEL USO DE LA URL
//ANGULAR
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//OBJECT-PATH
import * as objectPath from 'object-path';
//CONSTANTES
import { PAGE_TITLES } from '../../config/constants';

@Injectable()
export class PageService {

	//public configModel: PagesConfig = new PagesConfig(); //TRAE EL OBJECT DE PÁGINAS EXISTENTES
	//public onPageUpdated$: BehaviorSubject<PagesConfig> = new BehaviorSubject(this.configModel); //INICIALIZA EL OBSERVABLE CON EL OBJECT DE PÁGINAS EXISTENTES

	constructor(private router: Router) {}

	//ACTUALIZA EL OBJECT DE PÁGINAS EXISTENTES
	// setModel(menuModel: PagesConfig) {
	// 	this.configModel = Object.assign(this.configModel, menuModel);
	// 	this.onPageUpdated$.next(this.configModel);
	// }

	//RETORNA EL TÍTULO DE LA PÁGINA
	getCurrentPageConfig(): any {
		//console.log("configModel: ", this.configModel);
		//console.log("getCurrentPageConfig....");
		//console.log("this.router.url: ", objectPath.get(
			//this.configModel,
			//'config.' + this.router.url.substring(1).replace(/\//g, '.')));
		//console.log("this.router.url.substring(1).replace(/\//g, '.'): ", this.router.url.substring(1).replace(/\//g, '.'));

      //this.router.url: /material/form-controls/autocomplete
		//this.router.url.substring(1): material/form-controls/autocomplete
		//this.router.url.substring(1).replace(/\//g, '.'): material.form-controls.autocomplete
      console.log(this.router.url);
      console.log(this.router.url.substring(1).replace(/\//g, '.'));
      console.log("TITULO: ", PAGE_TITLES[this.router.url]);
		// return objectPath.get(
		// 	// this.configModel,
		// 	// 'config.' + this.router.url.substring(1).replace(/\//g, '.')
		// );
	}
}
