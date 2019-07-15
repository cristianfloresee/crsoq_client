import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'

@Component({
   selector: 'cw-brand',
   templateUrl: './brand.component.html'
})
export class BrandComponent implements OnInit {

   constructor(@Inject(DOCUMENT) private document: Document) { }

   ngOnInit() {
   }

   //BOTON 3 PUNTOS: MUESTRA U OCULTA EL SUBHEADER (EN MOVIL)
   clickTopbarToggle(event: Event): void {
      this.document.body.classList.toggle('m-topbar--on');
   }
}
