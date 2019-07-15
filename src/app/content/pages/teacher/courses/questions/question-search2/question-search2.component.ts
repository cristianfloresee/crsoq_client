
// Angular
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
import { DIFFICULTIES, PAGE_SIZES } from 'src/app/config/constants';
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { QuestionService } from 'src/app/core/services/API/question.service';
import { Subscription } from 'rxjs';
import { SWAL_DELETE_QUESTION, SWAL_SUCCESS_DELETE_QUESTION } from 'src/app/config/swal_config';
import { LessonQuestionService } from 'src/app/core/services/API/lesson-question.service';
import { TOAST_SUCCESS_UPDATE_QUESTIONS, TOAST_ERROR_UPDATE_QUESTIONS } from 'src/app/config/toastr_config';

@Component({
   selector: 'cw-question-search2',
   templateUrl: './question-search2.component.html',
   styleUrls: ['./question-search2.component.scss']
})
export class QuestionSearch2Component implements OnInit {

   @Input() id_subject;
   @Input() id_course;

   // Opciones de los swal
   SWAL_DELETE_QUESTION = SWAL_DELETE_QUESTION;
   SWAL_SUCCESS_DELETE_QUESTION = SWAL_SUCCESS_DELETE_QUESTION;

   constructor() { }

   ngOnInit() {
   }

}
