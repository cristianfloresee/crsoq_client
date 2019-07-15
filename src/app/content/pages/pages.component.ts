import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
   selector: 'cw-pages',
   templateUrl: './pages.component.html',
   styles: []
})
export class PagesComponent implements OnInit {
   @HostBinding('class') classes = 'm-grid m-grid--hor m-grid--root m-page';
   constructor(

   ) { }

   ngOnInit() {

   }

}
