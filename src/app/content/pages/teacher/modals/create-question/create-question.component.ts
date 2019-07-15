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
import { DIFFICULTIES, IMAGE_EXTS } from 'src/app/config/constants';

@Component({
   selector: 'cw-create-question',
   templateUrl: './create-question.component.html',
   styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit, OnDestroy {

   @Input() id_subject;
   @ViewChild('image_upload') image_upload;
   questionForm: FormGroup;
   files: any[];

   image_url;
   id_user;
   show_message;

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

      // Asigno el 'id_subject' si es que lo recibo por input() (desde la bilioteca)
      if (this.id_subject) this.questionForm.patchValue({ subject: this.id_subject });
   }

   initFormData() {
      this.questionForm = this.fb.group({
         subject: ['', Validators.required],
         category: ['', Validators.required],
         subcategory: ['', Validators.required],
         description: ['', [Validators.required]],
         difficulty: ['', Validators.required],
         image: ['']
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

      // Load Category Options
      this.subscriptions$.add(this.questionForm.get('category').valueChanges
         .subscribe((changes) => {
            this.questionForm.controls.subcategory.setValue('');
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

   // ##### Diferente
   createQuestion(question) {
      this._questionSrv.createQuestion(question.subcategory, question.description, question.difficulty, question.image)
         .subscribe(
            result => {
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
               this._categorySrv.getCategoriesOptions({ id_user: this.id_user, id_subject: changes })
                  .subscribe(
                     (result: any) => {
                        console.log("options: ", result);
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
      reader.readAsDataURL(_image);
      reader.onload = (event: any) => {
         this.image_url = event.target.result;
         this.questionForm.patchValue({
            image: _image
         })
      }
   }

   hasExtension(filename, exts_array) {
      return (new RegExp('(' + exts_array.join('|').replace(/\./g, '\\.') + ')$')).test(filename);
   }

   deleteFile() {
      //Delete Image DOM
      let image = this.image_upload.nativeElement;
      image.value = null;
      image.files = null;
      this.image_url = null;
      //Delte Image Form
      this.questionForm.patchValue({
         image: null
      })
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

}
