//ANGULAR
import { Pipe, PipeTransform } from '@angular/core';
//MOMENT
import * as moment from 'moment';

@Pipe({
   name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

   transform(date) {
      return moment(date).format("YYYY/MM/DD  HH:mm");
   }

}
