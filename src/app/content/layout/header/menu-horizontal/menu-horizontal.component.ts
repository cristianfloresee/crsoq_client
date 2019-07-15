import { Component, OnInit, HostBinding, AfterViewInit, ElementRef } from '@angular/core';
import * as objectPath from 'object-path';

import { MenuHorizontalDirective } from '../../../../core/directives/menu-horizontal.directive';
import { RoleService } from '../../../../core/services/role.service';

@Component({
   selector: 'cw-menu-horizontal',
   templateUrl: './menu-horizontal.component.html'
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {

   //@HostBinding('attr.mMenuHorizontalOffcanvas') mMenuHorOffcanvas: MenuHorizontalOffcanvasDirective;
   @HostBinding('attr.mMenuHorizontal') mMenuHorizontal: MenuHorizontalDirective; //PERMITE ABRIR LOS MENÚS


   header_config;
   current_role;

   constructor(
      private el: ElementRef,
      private roleSrv: RoleService
   ) {
      this.header_config = [
         {
            title: 'Acciones',
            root: true,
            icon: 'flaticon-add',
            toggle: 'click',
            submenu: {
               type: 'classic',
               alignment: 'left',
               items: [
                  {
                     title: 'Create New Post',
                     page: '/header/actions',
                     icon: 'flaticon-file',

                  },
                  {
                     title: 'Generate Reports',
                     tooltip: 'Non functional dummy link',
                     icon: 'flaticon-diagram',
                     badge: {
                        type: 'm-badge--success',
                        value: '2'
                     },
                  },
                  {
                     title: 'Manage Orders',
                     icon: 'flaticon-business',
                     submenu: {
                        type: 'classic',
                        alignment: 'right',
                        bullet: 'line',
                        items: [
                           {
                              title: 'Latest Orders',
                              tooltip: 'Non functional dummy link',
                              icon: '',
                           }
                        ]
                     }
                  }
               ]
            }
         },
         {
            title: 'Reportes',
            root: true,
            icon: 'flaticon-line-graph',
            toggle: 'click',
            submenu: {
               type: 'mega',
               width: '600px',
               alignment: 'left',
               columns: [
                  {
                     heading: {
                        heading: true,
                        title: 'Finance Reports',
                     },
                     items: [
                        {
                           title: 'Annual Reports',
                           tooltip: 'Non functional dummy link',
                           icon: 'flaticon-map',
                        },
                        {
                           title: 'HR Reports',
                           tooltip: 'Non functional dummy link',
                           icon: 'flaticon-user',
                        }
                     ]
                  },
                  {
                     bullet: 'line',
                     heading: {
                        heading: true,
                        title: 'Project Reports',
                     },
                     items: [
                        {
                           title: 'Coca Cola CRM',
                           tooltip: 'Non functional dummy link',
                           icon: '',
                        },
                        {
                           title: 'Delta Airlines Booking Site',
                           tooltip: 'Non functional dummy link',
                           icon: '',
                        }
                     ]
                  }
               ]
            }
         }
      ];

   }

   ngOnInit() {
      // this.roleSrv.current_role.subscribe((role)=>{
      //    console.log("new role desde el menu horizontal: ", role);
      //    this.role = role;
      // })

      this.roleSrv.role$.subscribe((role) => {
         this.current_role = role;
      })
   }

   ngAfterViewInit() {
      //this.mMenuHorOffcanvas = new MenuHorizontalOffcanvasDirective(this.el);
      //this.mMenuHorOffcanvas.ngAfterViewInit();

      this.mMenuHorizontal = new MenuHorizontalDirective(this.el);
      this.mMenuHorizontal.ngAfterViewInit();
   }
   //OBTIENE LOS ESTILOS DE CADA ITEM Y SUBITEM
   getItemCssClasses(item) {
      let cssClasses = 'm-menu__item';

      //SI TIENE SUBMENU
      if (objectPath.get(item, 'submenu')) {
         cssClasses += ' m-menu__item--submenu';
      }

      //SI EL TIPO DE SUBMENU ES CLASSIC O MEGA
      if (
         (objectPath.get(item, 'root') && (objectPath.get(item, 'submenu.type') === 'classic')) ||
         (parseInt(objectPath.get(item, 'submenu.width')) > 0)
      ) {
         //console.log("jaa: ", objectPath.get(item, 'submenu.width'));
         cssClasses += ' m-menu__item--rel';
      }

      return cssClasses;
   }

   //INDICA SI EL MENÚ SE ABRE HACIENDO CLICK O HOVER
   getItemAttrSubmenuToggle(menuItem) {
      let attrSubmenuToggle = 'hover';
      if (objectPath.get(menuItem, 'toggle') === 'click') {
         attrSubmenuToggle = 'click';
      }

      return attrSubmenuToggle;
   }


   //OBTIENE LOS ESTILOS DEL SUBMENÚ
   getItemMenuSubmenuClass(menuItem) {
      let subClass = '';

      const subAlignment = objectPath.get(menuItem, 'submenu.alignment');
      if (subAlignment) {
         subClass += ' m-menu__submenu--' + subAlignment;
      }

      if (objectPath.get(menuItem, 'submenu.type') === 'classic') {
         subClass += ' m-menu__submenu--classic';
      }

      if (objectPath.get(menuItem, 'submenu.type') === 'mega') {
         if (objectPath.get(menuItem, 'submenu.width')) {
            subClass += ' m-menu__submenu--fixed';
         }
      }
      return subClass;
   }
}
