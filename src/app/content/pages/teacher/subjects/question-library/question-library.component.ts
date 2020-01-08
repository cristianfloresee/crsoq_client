// Angular
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { DIFFICULTIES, PAGE_SIZES } from 'src/app/config/constants';
import { SWAL_DELETE_QUESTION, SWAL_SUCCESS_DELETE_QUESTION } from 'src/app/config/swal_config';
// Modals
import { UpdateQuestionComponent } from '../../modals/update-question/update-question.component';
import { CreateQuestionComponent } from '../../modals/create-question/create-question.component';
// Services
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { QuestionService } from 'src/app/core/services/API/question.service';

@Component({
   selector: 'cw-question-library',
   templateUrl: './question-library.component.html',
   styleUrls: ['./question-library.component.scss']
})
export class QuestionLibraryComponent implements OnInit, OnDestroy {

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
      private _questionSrv: QuestionService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      //Init Vars
      this.id_user = this._sessionSrv.userSubject.value.id_user;
      // Obtiene los params de la url
      /*this.urlParamChanges$ = this.route.params.subscribe(params => {
         this.id_subject = params.idSubject;
      });*/
      this.initFormData();

      this.subscriptions$.add(this.route.paramMap
         .subscribe(params => {
            this.id_subject = params.get('idSubject');
            console.log("YOUR MAM: ", this.id_subject);
            this.loadFormOptions();
            this.getQuestions();
            this.resetForm();
         })
      );

      this.checkFormChanges();

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

   loadFormOptions() {

      // Obtiene las categorías por id de usuario y id de asignatura
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

   createQuestion() {
      const modalRef = this.ngModal.open(CreateQuestionComponent, { size: "lg" });
      modalRef.componentInstance.id_subject = this.id_subject;
      modalRef.result
         .then((result) => { if (result) this.getQuestions() })
         .catch(reason => reason);
   }

   updateQuestion(question) {
      const modalRef = this.ngModal.open(UpdateQuestionComponent, { size: "lg" });
      modalRef.componentInstance.id_subject = this.id_subject;
      modalRef.componentInstance.question = question; //##### DIFERENTE
      modalRef.componentInstance.action = 'Actualizar'; //##### DIFERENTE
      modalRef.result
         .then((result) => { if (result) this.getQuestions() })
         .catch(reason => reason);
   }

   getQuestions(params?) {
      params = Object.assign({}, params, { id_user: this.id_user, id_subject: this.id_subject });
      this._questionSrv.getQuestions(params)
         .subscribe(
            (result: any) => {
               this.data_questions = result.items;
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            error => {
               console.log("error:", error);
            });
   }


   deleteQuestion(id_question) {
      this._questionSrv.deleteQuestion(id_question)
         .subscribe(
            result => {
               this.getQuestions();
               setTimeout(() => {
                  this.successSwal.show();
               }, 1000);
            },
            error => {
               console.log("error:", error);
            });
   }

   // Obtiene los items de la página correspondiente
   changePage(params) {
      this.page_size = params.page_size;
      this.getQuestions();
   }

   filterItems(params) {
      this.lock_id_category = params.id_category;
      this.lock_id_subcategory = params.id_subcategory;
      this.lock_difficulty = params.difficulty;
      this.from = 0;
      this.getQuestions(params);
   }

   resetForm() {
      this.lock_id_category = '';
      this.lock_id_subcategory = '';
      this.lock_difficulty = '';
      this.initFormData()
   }

   getUsersPage(page) {
      if (page != 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getQuestions();
      }
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

}
