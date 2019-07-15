import { Pipe, PipeTransform } from '@angular/core';
import { API_URL } from '../../config/constants';

@Pipe({
   name: 'urlImage'
})
export class UrlImagePipe implements PipeTransform {

   transform(image: string): string {
      if (image) return (API_URL + image)
      else return './assets/images/users/placeholder_man.jpg';
   }

}
