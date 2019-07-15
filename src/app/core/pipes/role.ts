import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'role'
})
export class rolePipe implements PipeTransform {

   transform(role: number): string {
      if (role == 1) return 'Administrador'
      else if (role == 2) return 'Profesor'
      else return 'Estudiante'
   }

}
