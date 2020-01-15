// Angular
import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Servicios
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { QuestionService } from 'src/app/core/services/API/question.service';
// rxjs
import { Subscription } from 'rxjs';
// Constantes
import { DIFFICULTIES, IMAGE_EXTS, API_URL } from 'src/app/config/constants';

@Component({
   selector: 'cw-update-question',
   templateUrl: './update-question.component.html',
   styleUrls: ['./update-question.component.scss']
})
export class UpdateQuestionComponent implements OnInit, OnDestroy {
   @Input() question;
   @Input() id_subject;
   @Input() action; // Título del modal
   @ViewChild('image_upload') image_upload;
   questionForm: FormGroup;
   files: any[];

   image_url;
   id_user;
   show_message;

   subjectChanges$: Subscription;
   categoryChanges$: Subscription;
   subcategoryChanges$: Subscription;
   imageChanges$: Subscription;
   difficultyChanges$: Subscription;
   descriptionChanges$: Subscription;
   sharedChanges$: Subscription;
   subscriptions$: Subscription;

   // Opciones de selector
   options_subject: Array<any>;
   options_difficulties: Array<any>;
   options_category: Array<any>;
   options_subcategory: Array<any>;

   constructor(
      private fb: FormBuilder,
      public activeModal: NgbActiveModal,
      private _subjectSrv: SubjectService,
      private _sessionSrv: SessionService,
      private _categorySrv: CategoryService,
      private _subcategorySrv: SubcategoryService,
      private _questionSrv: QuestionService,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      this.subscriptions$ = new Subscription();
      //Init Vars
      this.id_user = this._sessionSrv.userSubject.value.id_user;
      this.options_difficulties = DIFFICULTIES;
      //Init Functions
      this.initFormData();
      this.loadFormOptions();
      this.checkValidFields();
      this.loadFormData();
      this.checkFormChanges();

      /*
        //Init Vars
      this.id_user = this._sessionSrv.userSubject.value.id_user;
      this.options_difficulties = DIFFICULTIES;
      //Init Functions
      this.initFormData();
      this.loadFormOptions();
      this.checkValidFields();

      // Asigno el 'id_subject' si es que lo recibo por input() (desde la bilioteca)
      if(this.id_subject) this.questionForm.patchValue({ subject: this.id_subject });
      */
   }

   initFormData() {
      //console.log("question: ", this.question);
      this.questionForm = this.fb.group({
         subject: ['', Validators.required],
         category: ['', Validators.required],
         subcategory: ['', Validators.required],
         description: ['', [Validators.required]],
         difficulty: ['', Validators.required],
         shared: ['', Validators.required],
         image: ['']
      });
   }

   //this.courseForm.patchValue({ goalsForm: { course_goal: new_value, } }, { emitEvent: false });

   loadFormData() {
      //console.log("image: ", this.question.image);
      if (this.question.image) this.image_url = API_URL + this.question.image;
      this.questionForm.setValue({
         subject: this.question.id_subject,
         category: this.question.id_category,
         subcategory: this.question.id_subcategory,
         description: this.question.description,
         difficulty: this.question.difficulty,
         image: this.question.image,
         shared: this.question.shared
      });
   }

   loadFormOptions() {
      // Load Subject Options
      this._subjectSrv.getSubjectsOptions({ id_user: this.id_user })
         .subscribe(
            (result: any) => {
               this.options_subject = result;
               if (result && result.length == 0) this.show_message = true;
            },
            error => {
               console.log("error:", error);
            });

      // Detecta los cambios en el campo 'category' de la pregunta
      this.subscriptions$.add(this.questionForm.get('category').valueChanges
         .subscribe((changes) => {
            // Cuando cambia la categoría setea la subcategoría en vacío
            this.questionForm.controls.subcategory.setValue('');
            if (changes) {
               console.log(`changes: ${changes}, this.question.category: ${this.question.id_category}`)
               if (changes == this.question.id_category) this.questionForm.get('category').markAsPristine();
               // Si el cambio no es vacío/null cargo las subcategorías asociadas a la categoría
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
            else this.options_subcategory = [];
         })
      );

   }


   updateQuestion(question) {
      this._questionSrv.updateQuestion(this.question.id_question, question.subcategory, question.description, question.difficulty, question.image, question.shared)
         .subscribe(
            result => {
               console.log("result: ", result);
               this.activeModal.close(true);
               this.toastr.success('La pregunta ha sido creada correctamente.', 'Pregunta creada!');
            },
            error => {
               console.log("error: ", error);
               this.toastr.error('No se ha podido crear la pregunta.', 'Ha ocurrido un error!');
            }
         );
   }

   checkValidFields() {
      //Detect Subject Changes
      this.subscriptions$.add(this.questionForm.get('subject').valueChanges
         .subscribe((changes) => {
            this.questionForm.controls.category.setValue('');
            if (changes) {
               //console.log(`changes: ${changes}, this.question.id_subject: ${this.id_subject}`)
               if (changes == this.question.id_subject) this.questionForm.get('subject').markAsPristine();

               this._categorySrv.getCategoriesOptions({ id_user: this.id_user, id_subject: changes })
                  .subscribe(
                     (result: any) => {
                        this.options_category = result;
                     },
                     error => {
                        console.log("error:", error);
                     });
            }
            else {
               this.options_category = [];
            }
         })
      );

   }

   onFileChanged(event: any) {
      let file = event.target.files[0];

      if (this.hasExtension(file.name, IMAGE_EXTS)) this.renderImage(file)
      else this.deleteFile();
   }

   renderImage(_image) {
      let reader = new FileReader();
      reader.readAsDataURL(_image); // debe ser type Blob
      reader.onload = (event: any) => {
         this.image_url = event.target.result;
         this.questionForm.patchValue({ image: _image });
      }
   }

   // Obtiene la extensión del nombre de archivo
   hasExtension(filename, exts_array) {
      return (new RegExp('(' + exts_array.join('|').replace(/\./g, '\\.') + ')$')).test(filename);
   }

   deleteFile() {
      //Delete Image DOM
      let image = this.image_upload.nativeElement;
      image.value = null;
      image.files = null;
      this.image_url = null;

      //Delete Image Form
      this.questionForm.patchValue({ image: null });
   }

   checkFormChanges() {
      // Detecta los cambios en el campo 'subcategory' de la pregunta
      this.subscriptions$.add(this.questionForm.get('subcategory').valueChanges
         .subscribe((changes) => {
            if (changes == this.question.id_subcategory) this.questionForm.get('subcategory').markAsPristine();
         })
      );

      // Detecta los cambios en el campo 'description' de la pregunta
      this.subscriptions$.add(this.questionForm.get('description').valueChanges
         .subscribe((changes) => {
            if (changes == this.question.description) this.questionForm.get('description').markAsPristine();
         })
      );

      // Detecta los cambios en el campo 'difficulty' de la pregunta
      this.subscriptions$.add(this.questionForm.get('difficulty').valueChanges
         .subscribe((changes) => {
            if (changes == this.question.difficulty) this.questionForm.get('difficulty').markAsPristine();
         })
      );

      // Detecta los cambios en el campo 'image' de la pregunta. Es necesario que esto se cargue despues de 'loadFormData()'
      this.subscriptions$.add(this.questionForm.get('image').valueChanges
         .subscribe((changes) => {
            if (changes == this.question.image) this.questionForm.get('image').markAsPristine();
            else this.questionForm.get('image').markAsDirty();
         })
      );

      // Detecta los cambios en el campo 'shared' de la pregunta
      this.subscriptions$.add(this.questionForm.get('shared').valueChanges
         .subscribe((changes) => {
            if (changes == this.question.shared) this.questionForm.get('shared').markAsPristine();
         })
      );

   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

}
