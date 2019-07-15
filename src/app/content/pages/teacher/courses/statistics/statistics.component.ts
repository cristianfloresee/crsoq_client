// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// RxJS
import { Subscription } from 'rxjs';

@Component({
   selector: 'cw-statistics',
   templateUrl: './statistics.component.html',
   styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

   // Parámetros de la url
   urlParamChanges$: Subscription;
   id_subject;
   id_course;

   constructor(
      private route: ActivatedRoute,
   ) { }

   ngOnInit() {
      // Obtiene los params de la url
      this.urlParamChanges$ = this.route.params.subscribe(params => {
         this.id_course = params.idCourse;
         this.id_subject = params.idSubject;
      });
   }

}
