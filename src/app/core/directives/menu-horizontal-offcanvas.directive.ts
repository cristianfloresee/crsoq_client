import {
	Directive,
	AfterViewInit,
	OnDestroy,
	ElementRef
} from '@angular/core';

@Directive({
  selector: '[cwMenuHorizontalOffcanvas]'
})
export class MenuHorizontalOffcanvasDirective implements AfterViewInit, OnDestroy {

   menuOffcanvas: any;

	constructor(private el: ElementRef) {}

	ngAfterViewInit(): void {
		//INICIA EL PLUGIN MOFFCANVAS
		this.menuOffcanvas = new mOffcanvas(this.el.nativeElement, {
			overlay: true,
			baseClass: 'm-aside-header-menu-mobile',
			closeBy: 'm_aside_header_menu_mobile_close_btn',
			toggleBy: {
				target: 'm_aside_header_menu_mobile_toggle',
				state: 'm-brand__toggler--active'
			}
		});
	}

	ngOnDestroy(): void {}

}
