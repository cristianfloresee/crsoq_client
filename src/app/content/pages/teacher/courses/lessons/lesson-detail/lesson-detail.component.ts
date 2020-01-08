// Interfaces
// export interface IDifficulty {
//    difficulty: number,
//    name: string
// }

// export interface ICategory {
//    id_category: number,
//    name: string
// }

// export interface ISubcategory {
//    id_subcategory: number,
//    name: string
// }
/*
export interface IClass_Question {
   added_at: string,
   category: string,
   description: string,
   difficulty: number,
   id_question: number,
   id_category: number,
   id_subcategory: number,
   image: string,
   shared: boolean,
   status: number,
   subcategory: string,
   updated_at: string,
   winners: boolean
}

export interface IDetail {
   page: number,
   page_size: number,
   total_items: number,
   total_pages: number
}

export interface I {
   info: IDetail,
   items: Array<IClass_Question>
}*/

// Angular
import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
// Constants
import { SWAL_DELETE_LESSON_QUESTION, SWAL_SUCCESS_DELETE_LESSON_QUESTION } from 'src/app/config/swal_config';
import { DIFFICULTIES, PAGE_SIZES } from 'src/app/config/constants';
// Services
import { LessonQuestionService } from 'src/app/core/services/API/lesson-question.service';
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { LessonService } from 'src/app/core/services/API/lesson.service';
// Componentes
import { WinnersComponent } from '../../../modals/winners/winners.component';
import { QuestionSearchComponent } from '../../../modals/question-search/question-search.component';
import { PlayQuestionComponent } from '../play-question/play-question.component';

@Component({
   selector: 'cw-lesson-detail',
   templateUrl: './lesson-detail.component.html',
   styleUrls: ['./lesson-detail.component.scss']
})
export class LessonDetailComponent implements OnInit, OnDestroy {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;

   SWAL_DELETE_LESSON_QUESTION = SWAL_DELETE_LESSON_QUESTION;
   SWAL_SUCCESS_DELETE_LESSON_QUESTION = SWAL_SUCCESS_DELETE_LESSON_QUESTION;

   filterForm: FormGroup; // Form para el filtro y búsqueda

   page_sizes: Array<number> = PAGE_SIZES;

   // Opciones de selector
   options_category: Array<any>;
   options_subcategory: Array<any>;
   options_difficulty: Array<any> = DIFFICULTIES;

   // Evita se haga el mismo filtro (buscar otra solución)
   lock_id_module = '';
   lock_status = '';
   lock_id_category = '';
   lock_id_subcategory = '';
   lock_difficulty = '';
   //f_search = '';

   class_detail; // { course, created_at, date, description, id_class, id_module, module, status, subject, updated_at }

   // Data para la tabla
   data_class_questions: any; // { info, items }
   total_items: number = 0;
   total_pages: number;
   page_size: number = 20;
   page: number = 1;
   from: number = ((this.page - 1) * this.page_size);

   subscriptions$: Subscription;
   id_user;

   // Parámetros de la url
   id_subject;
   id_course;
   id_class;

   constructor(
      private route: ActivatedRoute,
      private router: Router,
      private fb: FormBuilder,
      private ngModal: NgbModal,
      private toastr: ToastrService,
      private _lessonQuestionSrv: LessonQuestionService,
      private _categorySrv: CategoryService,
      private _sessionSrv: SessionService,
      private _subcategorySrv: SubcategoryService,
      private _lessonSrv: LessonService,
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();

      // Obtiene los parámetros de la url
      this.subscriptions$.add(this.route.params
         .subscribe(params => {
            this.id_course = params.idCourse;
            this.id_subject = params.idSubject;
            this.id_class = params.idLesson;
         })
      );


      this.id_user = this._sessionSrv.getIdUser();
      this.initFormData();
      this.loadFormOptions();
      this.getClassQuestions();
      this.getClassDetail(this.id_class);
   }


   initFormData(): void {
      this.filterForm = this.fb.group({
         page_size: [this.page_size],
         page: [1],
         id_category: [this.lock_id_category],
         id_subcategory: [this.lock_id_subcategory],
         difficulty: [this.lock_difficulty],
         status: [this.lock_status],
      });
   }

   loadFormOptions() {
      this.getCategoryOptions(this.id_user, this.id_subject); // Obtiene los valores para el selector de categorías
      this.checkFormChanges();
   }

   checkFormChanges() {

      // Detecta los cambios en el selector de categorías
      this.subscriptions$.add(this.filterForm.get('id_category').valueChanges
         .subscribe((changes) => {

            // Establece el valor del selector de subcategorías en vacío
            this.filterForm.controls.id_subcategory.setValue('');
            // Si el nuevo valor es distinto de vacío obtiene los valores para el selector de subcategorías
            if (changes) this.getSubcategoryOptions(changes);
            else this.options_subcategory = [];

         })
      );

   }

   getCategoryOptions(id_user, id_subject) {

      this._categorySrv.getCategoriesOptions({ id_user, id_subject })
         .subscribe(
            (result: any) => this.options_category = result,
            (error) => {
               console.log("error:", error);
            });

   }

   getSubcategoryOptions(id_category) {

      this._subcategorySrv.getSubcategoriesOptions({ id_category })
         .subscribe(
            (result: any) => this.options_subcategory = result,
            (error) => {
               console.log("error:", error);
            });

   }

   getClassQuestions() {

      let params = Object.assign({ id_lesson: this.id_class }, this.filterForm.value);
      this._lessonQuestionSrv.getLessonQuestions(params)
         .subscribe(
            (result: any) => {
               this.data_class_questions = result.items;
               console.log("data_class_questions: ", this.data_class_questions);
               this.total_items = result.info.total_items;
               this.total_pages = result.info.total_pages;
               this.page = (this.from / this.page_size) + 1;
            },
            (error) => {
               console.log("error:", error);
            });

   }

   searchQuestion() {

      const modalRef = this.ngModal.open(QuestionSearchComponent, {
         windowClass: 'xlModal'
      });
      // Pasar los params en un solo objeto?
      modalRef.componentInstance.action = 'Añadir';
      // Sería bueno tener todo el subject en vez de solo el id_subject
      modalRef.componentInstance.id_subject = this.id_subject;
      modalRef.componentInstance.id_course = this.id_course;
      modalRef.componentInstance.id_class = this.id_class;
      modalRef.componentInstance.class = this.class_detail;
      modalRef.componentInstance.subject = this.class_detail.subject;
      modalRef.componentInstance.course = this.class_detail.course;

      // Al cerrar el modal
      modalRef.result.then(
         (changes: boolean) => {
            if (changes) this.getClassQuestions(); // Si se realiza un cambio se recargan los datos
         },
         () => { }
      );

   }

   updateClass(question) {

   }

   changeStatus(status) {
      console.log("CHANGE: ", status);

      this._lessonSrv.updateLesson(this.id_class, this.class_detail.id_module, this.class_detail.description, this.class_detail.date, status)
         .subscribe(
            (result: any) => {

               if (!result) {
                  this.toastr.error('Asegúrate de no tener otra clase iniciada.', 'Ha ocurrido un error!');
               }
               else {
                  this.class_detail.status = status;
                  this.toastr.success('El estado de la clase ha sido actualizado correctamente.', 'Acción realizada!');
               }

            },
            error => {
               console.log("error:", error);
            });
   }


   getClassDetail(id_class) {

      this._lessonSrv.getClassById(id_class)
         .subscribe(
            (result: any) => this.class_detail = result,
            (error) => {
               console.log("error:", error);
            });

   }

   goBack() {
      this.router.navigate(['/teacher', 'subject', this.id_subject, 'course', this.id_course, 'lesson']);
   }

   playQuestion(question) {
      console.log("ID LESSON: ", this.id_class);
      console.log("quesion: ", question);
      const modalRef = this.ngModal.open(PlayQuestionComponent, {
         windowClass: 'xlModal'
      });
      // Pasar los params en un solo objeto?
      modalRef.componentInstance.question = question;
      modalRef.componentInstance.id_lesson = this.id_class;

      modalRef.result.then(
         (result) => {
            console.log("RESULTE: ", result);
            //if (result)
            this.getClassQuestions();
         },
         () => { }
      );
   }

   deleteQuestion(id_question) {

      this._lessonQuestionSrv.deleteLessonQuestion(this.id_class, id_question)
         .subscribe(
            () => {
               this.successSwal.show();
               this.getClassQuestions();
            },
            (error) => {
               console.log("error:", error);
               this.toastr.error('La clase no ha sido eliminada porque contiene actividades.', 'Ha ocurrido un error!');
            });

   }

   filterItems(params) {
      this.lock_id_category = params.id_category;
      this.lock_id_subcategory = params.id_subcategory;
      this.lock_difficulty = params.difficulty;
      this.from = 0;
      this.getClassQuestions();
   }

   changePageSize(_page_size: number) {
      this.page_size = _page_size;
      this.getClassQuestions();
   }

   getUsersToPage(_page: number) {
      if (_page > 0 && _page <= this.total_pages) {
         this.from = (_page - 1) * this.page_size;
         this.page = _page;
         this.getClassQuestions();
      }
   }

   updateWinners(question) {

      const modalRef = this.ngModal.open(WinnersComponent, {
         windowClass: 'xlModal'
      });
      // Pasar los params en un solo objeto?
      modalRef.componentInstance.id_course = this.id_course;
      modalRef.componentInstance.id_class = this.id_class;
      modalRef.componentInstance.question = question;

      // Al cerrar el modal
      modalRef.result.then(
         (changes) => {
            if (changes) this.getClassQuestions(); // Si se realiza un cambio se recargan los datos
         },
         () => { }
      );

   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

}
