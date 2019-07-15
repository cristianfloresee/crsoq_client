// Angular
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

class BaseList {
   base: Array<any>;
   selected: Array<any> = [];

   constructor(list: Array<any> = []) {
      this.base = [...list];
   }

   selectNone(): void {
      this.selected = [];
   }

   isSelectedNone(): boolean {
      return this.selected.length === 0;
   }

   selectAll(): void {
      this.selected = [...this.base];
   }

   isSelectedAll(): boolean {
      return this.selected.length === this.base.length && this.selected.every(v1 => this.base.find(v2 => v1 === v2));
   }
}

@Component({
   selector: 'cw-dual-list',
   templateUrl: './dual-list.component.html',
   styleUrls: ['./dual-list.component.scss']
})
export class DualListComponent implements OnInit {

   public _leftList: BaseList;
   public _rightList: BaseList;

   @Input() display: String = 'name';
   @Input() leftTitle: String = 'Disponibles';
   @Input() rightTitle: String = 'Seleccionadas';

   @Input()
   set leftList(list: Array<any>) {
      this._leftList = new BaseList(list);
   }
   @Input()
   set rightList(list: Array<any>) {
      this._rightList = new BaseList(list);
   }

   @Output() updateLists = new EventEmitter<any>();

   constructor() { }

   isSelected(list: Array<any>, item: any): boolean {
      return Boolean(list.filter(e => Object.is(e, item)).length);
   }

   selectItem(list: Array<any>, item: any): void {
      const entryItems = list.filter(e => Object.is(e, item));

      if (entryItems.length) {
         entryItems.forEach(v => {
            const idx = list.indexOf(v);
            if (idx + 1) list.splice(idx, 1);
         });
      } else {
         list.push(item);
      }
   }

   moveSelectedItems(fromList: BaseList, toList: BaseList): void {
      fromList.base = fromList.base.filter(item => !(fromList.selected.indexOf(item) + 1));
      toList.base = toList.base.concat(fromList.selected);
      fromList.selectNone();

      // Emite el evento output. Enviar solo el que se elimina o agrega en el rightlist
      this.updateLists.next(this._rightList.base);
   }

   ngOnInit() { }

}
