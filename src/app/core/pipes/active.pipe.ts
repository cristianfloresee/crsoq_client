import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'active'
})
export class ActivePipe implements PipeTransform {

   transform(value: string): string {
      if (value) return 'Activo'
      else return 'Inactivo'
   }

}
