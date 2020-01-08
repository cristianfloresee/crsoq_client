// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Services
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { LessonQuestionService } from 'src/app/core/services/API/lesson-question.service';
// Constants
import { DIFFICULTIES, PAGE_SIZES } from 'src/app/config/constants';
import { SWAL_DELETE_QUESTION, SWAL_SUCCESS_DELETE_QUESTION } from 'src/app/config/swal_config';
import { QuestionSearchComponent } from '../../modals/question-search/question-search.component';
import { QuestionSearch2Component } from './question-search2/question-search2.component';
import { CreateQuestionComponent } from '../../modals/create-question/create-question.component';

@Component({
   selector: 'cw-questions',
   templateUrl: './questions.component.html',
   styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {


   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   // Opciones de los swal
   SWAL_DELETE_QUESTION = SWAL_DELETE_QUESTION;
   SWAL_SUCCESS_DELETE_QUESTION = SWAL_SUCCESS_DELETE_QUESTION;

   page_sizes = PAGE_SIZES;

   // Form para el filtro y búsqueda
   filterForm: FormGroup;

   id_user;

   subscriptions$: Subscription;

   // Parámetros de la url
   id_course;
   id_subject;

   // Opciones de selector
   options_category;
   options_subcategory;
   options_difficulty = DIFFICULTIES;

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

   constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      //private _moduleSrv: ModuleService,
      private ngModal: NgbModal,
      //private _lessonSrv: LessonService,
      private _categorySrv: CategoryService,
      private toastr: ToastrService,
      private _sessionSrv: SessionService,
      private _subcategorySrv: SubcategoryService,
      private _lessonQuestionSrv: LessonQuestionService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      this.id_user = this._sessionSrv.userSubject.value.id_user;


      // Obtiene los params de la url
      this.subscriptions$.add(this.route.paramMap
         .subscribe(params => {
            this.id_subject = params.get('idSubject');
            this.id_course = params.get('idCourse');

            this.initFormData();
            this.loadFormOptions();
            this.checkFormChanges();
            this.getQuestions();
         })
      );
   }

   initFormData() {

      this.lock_difficulty = '';
      this.lock_id_category = '';
      this.lock_id_subcategory = '';

      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         // Ver si se puede dejar de depender de los locks
         id_category: this.lock_id_category,
         id_subcategory: this.lock_id_subcategory,
         difficulty: this.lock_difficulty
      });
   }

   loadFormOptions() {
      /*
      this._courseSrv.getCourseById(this.id_user, this.id_course)
         .subscribe(value => {

         }) */


      // Obtiene las opciones categorías por 'id_user' y 'id_subject'.
      this._categorySrv.getCategoriesOptions({ id_user: this.id_user, id_subject: this.id_subject })
         .subscribe(
            (result: any) => {
               this.options_category = result;
               console.log("options category: ", result);
            },
            error => {
               console.log("error:", error);
            });
   }

   checkFormChanges() {
      // Load Category Options
      this.subscriptions$.add(this.filterForm.get('id_category').valueChanges
         .subscribe((changes) => {
            this.filterForm.controls.id_subcategory.setValue('');
            if (changes) {
               //Load Subcategory Options
               //this._subcategorySrv.getSubcategoriesByCategoryId(changes)
               this._subcategorySrv.getSubcategoriesOptions({ id_category: changes })
                  .subscribe(
                     (result: any) => {
                        this.options_subcategory = result;
                        console.log("subcategories: ", result);
                     },
                     error => {
                        console.log("error:", error);
                     });
            }
            else {
               this.options_subcategory = [];
            }
         })
      );
   }

   getQuestions() {
      this._lessonQuestionSrv.getAllQuestionsByCourse(this.id_course, this.filterForm.value)
         .subscribe(
            (result: any) => {
               console.log("QUESTIONS: ", result);
               this.data_questions = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            error => {
               console.log("error:", error);
            });
   }

   deleteQuestion(question) {
      console.log("delete: ", question);
      this._lessonQuestionSrv.deleteLessonQuestion(question.id_class, question.id_question)
         .subscribe(
            result => {
               this.getQuestions();
               this.successSwal.show();
            },
            error => {
               console.log("error:", error);
            });
   }

   searchQuestion() {
      const modalRef = this.ngModal.open(QuestionSearch2Component, { size: 'lg' });
      modalRef.componentInstance.action = 'Añadir';
      modalRef.componentInstance.id_subject = this.id_subject;
      modalRef.componentInstance.id_course = this.id_course;
      //modalRef.componentInstance.id_lesson = this.id_lesson;
      /// Recargar
      modalRef.result.then((result) => {
         if (result) this.getQuestions();
      });
   }


   filterItems(params) {
      this.lock_id_category = params.id_category;
      this.lock_id_subcategory = params.id_subcategory;
      this.lock_difficulty = params.difficulty;
      this.from = 0;
      this.getQuestions();
   }

   changePage(params) {
      this.page_size = params.page_size;
      this.getQuestions();
   }

   getUsersPage(page) {
      if (page != 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getQuestions();
      }
   }

   ngOnDestroy(){
      this.subscriptions$.unsubscribe();
   }
}
