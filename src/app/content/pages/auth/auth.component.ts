import { Component, OnInit, Input, HostBinding, OnDestroy, ElementRef } from '@angular/core';
//NOTICE SERVICE

@Component({
   selector: 'cw-auth',
   templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
   @HostBinding('id') id = 'm_login';
   @HostBinding('class') classses: any = 'm-grid m-grid--hor m-grid--root m-page';

   @Input() action = 'login';
   today: number = Date.now();

   constructor(
      private el: ElementRef
   ) { }

   ngOnInit(): void {
      this.el.nativeElement.closest('body').className = 'm-content--skin-light m-header--static';
   }

   ngOnDestroy(): void {
      this.el.nativeElement.closest('body').className = 'm-page--fluid m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--fixed m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default m-scroll-top--shown';
   }

   registerPage() {
      this.action = 'register';
   }

}
