import { Directive, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

@Directive({
   selector: '[cwMenuHorizontal]'
})
export class MenuHorizontalDirective implements AfterViewInit, OnDestroy {
   menu: any;

   constructor(private el: ElementRef) { }

   ngAfterViewInit(): void {
      //INICIA EL PLUGIN METRONIC-MENÚ
      this.menu = new mMenu(this.el.nativeElement, {
         submenu: {
            desktop: 'dropdown',
            tablet: 'accordion',
            mobile: 'accordion'
         },
         accordion: {
            slideSpeed: 200, // VELOCIDAD EN MILISEGUNDOS DEL SLIDE AL ABRIR EL ACORDEON
            autoScroll: true, // HABILITAR DESPLAZAMIENTO (FOCUS) AL ELEMENTO CLICKEADO
            expandAll: false // PERMITIR TENER MÚLTIPLES ACORDEONES EXPANDIDOS EN EL MENÚ
         }
      });
   }

   ngOnDestroy(): void { }
}
