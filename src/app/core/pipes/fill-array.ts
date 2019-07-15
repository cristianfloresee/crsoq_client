import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'fillArray'
})
export class FillArray implements PipeTransform {

   transform(value) {
      return Array.from({ length: value }, (v, i) => i + 1);
   }

}
