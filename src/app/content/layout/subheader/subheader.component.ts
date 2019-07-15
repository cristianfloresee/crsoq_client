import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../core/services/layout/subheader.service';
//MODELO
import { BreadCrumb } from './breadcrumb.interface'
// import { ActivatedRoute, NavigationEnd, Router, PRIMARY_OUTLET } from '@angular/router';
// import { map, filter, distinctUntilChanged, startWith } from 'rxjs/operators';


@Component({
   selector: 'cw-subheader',
   templateUrl: './subheader.component.html'
})
export class SubheaderComponent implements OnInit {

   //breadcrumbs$;
   //public breadcrumbs: BreadCrumb[];

   constructor(
      private _subheaderSrv: SubheaderService,
      //private activatedRoute: ActivatedRoute,
      //private router: Router
   ) { }

   ngOnInit() {

      let breadcrumb: BreadCrumb = {
         label: 'Home',
         url: ''
      };

      // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      //    //set breadcrumbs
      //    let root: ActivatedRoute = this.activatedRoute.root;
      //    this.breadcrumbs = this.getBreadcrumbs(root);
      //    this.breadcrumbs = [breadcrumb, ...this.breadcrumbs];
      // });
      // this.breadcrumbs$ = this.router.events
      //    .pipe(
      //       filter(event => event instanceof NavigationEnd),
      //       distinctUntilChanged(),
      //       startWith(this.buildBreadCrumb(this.activatedRoute.root))
      //    )
      //    .subscribe(() => this.buildBreadCrumb(this.activatedRoute.root))
   }

   /*
   private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: BreadCrumb[] = []): BreadCrumb[] {
      console.log("======================================")
      console.log("this.activatedRoute.root: ", route);
      console.log("url: ", url);
      console.log("breadcrumbs: ", breadcrumbs);

      const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
      //debugger
      //get the child routes
      let children: ActivatedRoute[] = route.children;

      //return if there are no more children
      if (children.length === 0) {
         return breadcrumbs;
      }

      //iterate over each children
      for (let child of children) {
         //verify primary route
         if (child.outlet !== PRIMARY_OUTLET || child.snapshot.url.length == 0) {
            continue;
         }

         //verify the custom data property "breadcrumb" is specified on the route
         if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
            return this.getBreadcrumbs(child, url, breadcrumbs);
         }

         //get the route's URL segment
         let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

         //append route URL to URL
         url += `/${routeURL}`;

         //add breadcrumb
         let breadcrumb: BreadCrumb = {
            label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
            url: url
         };
         breadcrumbs.push(breadcrumb);

         //recursive
         return this.getBreadcrumbs(child, url, breadcrumbs);
      }
      return breadcrumbs;
   }*/


   /*
   buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<BreadCrumb> = []) {
      console.log("======================================")
      console.log("entra al buildBreadCrumb...");
      console.log("this.activatedRoute.root: ", route);
      console.log("url: ", url);
      console.log("breadcrumbs: ", breadcrumbs);
      //si el routeConfig no esta disponible estamos en la ruta raíz
      console.log()
      const label = route.routeConfig ? route.routeConfig.data['breadcrumb'] : 'Inicio';
      const path = route.routeConfig ? route.routeConfig.path : '';
      // In the routeConfig the complete path is not available,
      // so we rebuild it each time
      const nextUrl = `${url}${path}/`;
      const breadcrumb = {
         label: label,
         url: nextUrl
      };

      const newBreadcrumbs = [...breadcrumbs, breadcrumb];
      if (route.firstChild) {
         // If we are not on our current path yet,
         // there will be more children to look after, to build our breadcumb
         return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      }
      console.log("breadcrumb salida; ", newBreadcrumbs);
      console.log("======================================")
      return newBreadcrumbs;
   }*/


}
