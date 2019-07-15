import { Component, ChangeDetectionStrategy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
// LOADING-BAR
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
   selector: 'cw-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

   @ViewChild('mHeader') mHeader: ElementRef;

   constructor(
      private router: Router,
      public loader: LoadingBarService,
      //ME FALTA LAYOUTREFSERVICE......................
   ) {

      this.initLoadingBar();
   }

   ngOnInit() {
   }

   initLoadingBar() {
      this.router.events.subscribe(event => {
         if (event instanceof NavigationStart) this.loader.start();
         if (event instanceof RouteConfigLoadStart) this.loader.increment(35);
         if (event instanceof RouteConfigLoadEnd) this.loader.increment(75);
         if (event instanceof NavigationEnd || event instanceof NavigationCancel) this.loader.complete();
      });

   }

}
