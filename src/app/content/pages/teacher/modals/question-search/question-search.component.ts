
// Angular
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Constantes
import { DIFFICULTIES, PAGE_SIZES } from 'src/app/config/constants';
import { SWAL_DELETE_QUESTION, SWAL_SUCCESS_DELETE_QUESTION } from 'src/app/config/swal_config';
import { SWAL_DELETE_LESSON_QUESTION, SWAL_SUCCESS_DELETE_LESSON_QUESTION } from 'src/app/config/swal_config';
import { TOAST_SUCCESS_UPDATE_QUESTIONS, TOAST_ERROR_UPDATE_QUESTIONS } from 'src/app/config/toastr_config';
// Servicios
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { LessonQuestionService } from 'src/app/core/services/API/lesson-question.service';
// Componentes
import { CreateQuestionComponent } from '../create-question/create-question.component';

@Component({
   selector: 'cw-question-search',
   templateUrl: './question-search.component.html',
   styleUrls: ['./question-search.component.scss']
})
export class QuestionSearchComponent implements OnInit, OnDestroy {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   SWAL_DELETE_LESSON_QUESTION = SWAL_DELETE_LESSON_QUESTION;
   SWAL_SUCCESS_DELETE_LESSON_QUESTION = SWAL_SUCCESS_DELETE_LESSON_QUESTION;

   @Input() id_subject;
   @Input() id_course;
   @Input() id_class;
   @Input() subject;
   @Input() course;
   @Input() class;

   // Opciones de los swal
   SWAL_DELETE_QUESTION = SWAL_DELETE_QUESTION;
   SWAL_SUCCESS_DELETE_QUESTION = SWAL_SUCCESS_DELETE_QUESTION;

   // Form para el filtro y búsqueda
   filterForm: FormGroup;

   page_sizes: Array<number> = PAGE_SIZES;

   id_user;
   categoryChanges$: Subscription;

   // Opciones de selector
   options_category;
   options_subcategory;
   options_difficulty = DIFFICULTIES;

   // Evitan que se haga el mismo filtro
   lock_id_category = '';
   lock_id_subcategory = '';
   lock_difficulty = '';

   add_questions = [];
   delete_questions = [];

   // Data para la tabla
   data_questions;
   data_lesson_questions;
   total_items: number = 0;
   total_pages: number;
   page_size: number = 20;
   page: number = 1;
   from: number = ((this.page - 1) * this.page_size);

   constructor(
      private fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private ngModal: NgbModal,
      private toastr: ToastrService,
      private _categorySrv: CategoryService,
      private _sessionSrv: SessionService,
      private _subcategorySrv: SubcategoryService,
      private _lessonQuestionSrv: LessonQuestionService,
   ) { }

   ngOnInit() {
      console.log("id_subject: ", this.id_subject);
      console.log("CAMI: ", this.class);

      this.id_user = this._sessionSrv.getIdUser();
      this.initFormData();
      this.loadFormOptions();
      this.checkFormChanges();
      this.getQuestions();
   }

   initFormData() {
      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         id_category: this.lock_id_category,
         id_subcategory: this.lock_id_subcategory,
         difficulty: this.lock_difficulty
      });
   }



   checkFormChanges() {
      // Load Category Options
      this.categoryChanges$ = this.filterForm.get('id_category').valueChanges.subscribe((changes) => {

         this.filterForm.controls.id_subcategory.setValue('');
         if (changes) {
            //Load Subcategory Options
            this._subcategorySrv.getSubcategoriesOptions({ id_category: changes })
               .subscribe(
                  (result: any) => this.options_subcategory = result,
                  (error) => {
                     console.log("error:", error);
                  });
         }
         else this.options_subcategory = [];

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
            (error) => {
               console.log("error:", error);
            });
   }


   createQuestion() {

      const modalRef = this.ngModal.open(CreateQuestionComponent, {
         size: "lg"
      });

      // Actualiza la tabla de registros si se hicieron cambios
      modalRef.result.then(
         (changes) => {
            if (changes) this.getQuestions();
         },
         () => { }
      );

   }

   getQuestions() {
      //let params = Object.assign({}, this.filterForm.value, { id_user: this.id_user, id_subject: this.id_subject, id_lesson: this.id_class });
      let params = Object.assign({}, this.filterForm.value, { id_user: this.id_user, id_subject: this.id_subject, id_course: this.id_course });
      //let params = Object.assign({ id_course: this.id_course }, this.filterForm.value);

      // Obtiene las preguntas de la biblioteca de la asignatura e indica que preguntas ya han sido agregadas a otras clases del curso.
      //this._lessonQuestionSrv.getAllQuestionsForLesson(params)
      this._lessonQuestionSrv.getCourseQuestions(params)
         .subscribe(
            (result: any) => {
               console.log(" + getCourseQuestions: ", result);
               this.data_questions = this.formatQuestionLessonArray(result.items);
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            (error) => {
               console.log("error:", error);
            });
   }

   formatQuestionLessonArray(lesson_questions) {
      lesson_questions.forEach(question => {
         question.original_id_class = question.id_class;
      });
      return lesson_questions;
   }

   filterItems(params) {
      this.lock_id_category = params.id_category;
      this.lock_id_subcategory = params.id_subcategory;
      this.lock_difficulty = params.difficulty;
      this.from = 0;
      this.getQuestions();
   }

   // Obtiene los items de la página correspondiente
   changePage(params) {
      this.page_size = params.page_size;
      this.getQuestions();
   }

   changeAvailabiltyLessonQuestion(question) {

      if (question.id_class && question.id_class != this.id_class) {
         return;
      }
      console.log("changeAvailabiltyLessonQuestion: ", question);

      // Cambia el estado añadido/no añadido
      // + Arreglar esto....
      if (question.id_class) {
         question.id_class = null;
         question.class = null;
      }
      else {
         question.id_class = this.id_class;
         question.class = this.class.description;
      }
      //question.added = !question.added;

      // Si el nuevo estado 'added' (añadida/no añadida) es diferente al estado original 'original_added'
      // Si es un nuevo estado entonces debo insertar una petición
      if (question.id_class != question.original_id_class) {
         if (question.original_id_class) this.delete_questions.push(question.id_question);
         else this.add_questions.push(question.id_question)
      }
      else {
         if (question.id_class) this.deleteFromArray(question.id_question, this.delete_questions);
         else this.deleteFromArray(question.id_question, this.add_questions)
      }


      // if (question.added != question.original_added) {
      //    // Si ya estaba añadido entonces corresponde a una eliminación
      //    if (question.original_added) this.delete_questions.push(question.id_question);
      //    else this.add_questions.push(question.id_question);


      // } else {
      //    if (question.add) this.deleteFromArray(question.id_question, this.delete_questions);
      //    else this.deleteFromArray(question.id_question, this.add_questions);
      //    // Elimina el cambio de estado en el array de peticiones
      // }
   }

   deleteFromArray(id_question, array) {
      // Busco el indice de la solicitud en el array de Solicitudes
      let index = array.indexOf(id_question);
      // Elimino la solicitud
      array.splice(index, 1);
   }

   updateLessonQuestions() {
      this._lessonQuestionSrv.updateLessonQuestions(this.id_class, this.add_questions, this.delete_questions)
         .subscribe(
            () => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_UPDATE_QUESTIONS.message, TOAST_SUCCESS_UPDATE_QUESTIONS.title);
            },
            (error) => {
               this.toastr.error(TOAST_ERROR_UPDATE_QUESTIONS.message, TOAST_ERROR_UPDATE_QUESTIONS.title);
               console.log("error:", error);
            });
   }

   getUsersPage(page) {
      if (page > 0 && page <= this.total_pages) {
         this.from = (page - 1) * this.page_size;
         this.page = page;
         this.getQuestions();
      }
   }

   deleteQuestion(question) {
      console.log("deleteQuestion: ", question);

      this._lessonQuestionSrv.deleteLessonQuestion(question.id_class, question.id_question)
         .subscribe(
            () => {
               this.toastr.success('La pregunta ha sido desvinculada de su clase.', 'Pregunta Desvinculada');
               question.id_class = null;
               question.class = null;
               question.original_id_class = null;
               //this.data_questions = this.formatQuestionLessonArray(result.items);
               //this.total_items = result.info.total_items;
               //this.total_pages = result.info.total_pages;
               //this.page = (this.from / this.page_size) + 1;
            },
            (error) => {
               console.log("error:", error);
            });
   }

   ngOnDestroy() {
      this.categoryChanges$.unsubscribe();
   }

}
