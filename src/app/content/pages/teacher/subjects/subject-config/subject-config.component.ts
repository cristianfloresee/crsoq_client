// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// RxJS
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from 'src/app/core/services/API/session.service';

@Component({
   selector: 'cw-subject-config',
   templateUrl: './subject-config.component.html',
   styleUrls: ['./subject-config.component.scss']
})
export class SubjectConfigComponent implements OnInit {

   // Form para el filtro y búsqueda
   filterForm: FormGroup;

   // Parámetros de la url
   urlParamChanges$: Subscription;
   id_subject;
   id_user;

   // Evitan que se haga el mismo filtro
   lock_id_category = '';
   lock_id_subcategory = '';
   lock_difficulty = '';

   // Data para la tabla
   data_questions;
   total_items = 0;
   total_pages;
   page_size = 20;
   page = 1;
   from = ((this.page - 1) * this.page_size);
s
   constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private _sessionSrv: SessionService
   ) { }

   ngOnInit() {
      // Obtiene los params de la url
      /*this.urlParamChanges$ = this.route.params.subscribe(params => {
         this.id_subject = params.idSubject;
      });*/
      this.urlParamChanges$ = this.route.paramMap.subscribe(params => {
         this.id_subject = params.get('idSubject');
      });
      this.id_user = this._sessionSrv.userSubject.value.id_user;
   }


   initFormData() {
      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         // Ver si se puede dejar de depender de los locks
         id_category: this.lock_id_category,
         id_subcategory: this.lock_id_subcategory,
         difficulty: this.lock_difficulty
      });
   }

}
