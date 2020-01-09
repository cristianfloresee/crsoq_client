// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toatr
import { ToastrService } from 'ngx-toastr';
// ngx-sweetaler2
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
// Services
import { CourseService } from 'src/app/core/services/API/course.service';
import { CategoryService } from 'src/app/core/services/API/category.service';
import { SubcategoryService } from 'src/app/core/services/API/subcategory';
import { QuestionService } from 'src/app/core/services/API/question.service';
import { SidemenuService } from 'src/app/core/services/sidemenu.service';
import { SessionService } from 'src/app/core/services/API/session.service';
// Constants
import { SWAL_DELETE_QUESTION, SWAL_SUCCESS_DELETE_QUESTION, SWAL_SUCCESS_DELETE_COURSE, SWAL_DELETE_COURSE, SWAL_DELETE_CATEGORY, SWAL_SUCCESS_DELETE_CATEGORY, SWAL_SUCCESS_DELETE_SUBCATEGORY, SWAL_DELETE_SUBCATEGORY } from 'src/app/config/swal_config';
import { TOAST_ERROR_DELETE_QUESTIONS, TOAST_ERROR_DELETE_COURSES, TOAST_ERROR_DELETE_CATEGORIES, TOAST_ERROR_DELETE_SUBCATEGORIES } from 'src/app/config/toastr_config';
// Components
import { CreateCourseComponent } from './modals/create-course/create-course.component';
import { modalCategoryComponent } from './modals/modal-category/modal-category.component';
import { ModalSubcategoryComponent } from './modals/modal-subcategory/modal-subcategory.component';

import { CreateQuestionComponent } from './modals/create-question/create-question.component';
import { SubjectInitComponent } from './modals/subject-init/subject-init.component';
import { UpdateQuestionComponent } from './modals/update-question/update-question.component';

@Component({
   selector: 'cw-teacher',
   templateUrl: './teacher.component.html',
   styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {

   // Hace referencia al template 'successSwal'
   @ViewChild('successSwal') private successSwal: SwalComponent;
   @ViewChild('successSwal2') private successSwal2: SwalComponent;
   @ViewChild('successSwal3') private successSwal3: SwalComponent;
   @ViewChild('successSwal4') private successSwal4: SwalComponent;

   // Opciones de los swal (Question)
   SWAL_DELETE_QUESTION: SweetAlertOptions = SWAL_DELETE_QUESTION;
   SWAL_SUCCESS_DELETE_QUESTION: SweetAlertOptions = SWAL_SUCCESS_DELETE_QUESTION;

   // Opciones de los swal (Course)
   SWAL_DELETE_COURSE: SweetAlertOptions = SWAL_DELETE_COURSE;
   SWAL_SUCCESS_DELETE_COURSE: SweetAlertOptions = SWAL_SUCCESS_DELETE_COURSE;

   // Opciones de los swal (Category)
   SWAL_DELETE_CATEGORY: SweetAlertOptions = SWAL_DELETE_CATEGORY;
   SWAL_SUCCESS_DELETE_CATEGORY: SweetAlertOptions = SWAL_SUCCESS_DELETE_CATEGORY;

   // Opciones de los swal (Subategory)
   SWAL_DELETE_SUBCATEGORY: SweetAlertOptions = SWAL_DELETE_SUBCATEGORY;
   SWAL_SUCCESS_DELETE_SUBCATEGORY: SweetAlertOptions = SWAL_SUCCESS_DELETE_SUBCATEGORY;

   courses;
   categories;
   subcategories;
   questions;

   options;
   options2

   id_user;

   ///https://echarts.apache.org/en/option.html#series-pie.label.rich
   constructor(
      private _courseSrv: CourseService,
      private _sessionSrv: SessionService,
      private ngModal: NgbModal,
      private _categorySrv: CategoryService,
      private _subcategorySrv: SubcategoryService,
      private _questionSrv: QuestionService,
      private toastr: ToastrService,
      private _sidemenuSrv: SidemenuService
   ) { }

   ngOnInit() {
      this.id_user = this._sessionSrv.userSubject.value.id_user;
      this.getLastCourses(this.id_user);
      this.getLastCategories(this.id_user);
      this.getLastSubcategories();
      this.getLastQuestions();

      //DATOS NECESATIOS PARA EL GRÁFICO DE DONA:
      //! NECESITO HABER INICIADO UN CURSO PARA HACER ESTAS PRUEBAS!!!!!
      //OBTENER ÚLTIMOS CURSOS EN LOS CUALES SE REALIZARON PREGUNTAS (FROM QUESTION_CLASS?? WHERE ID_USER)..
      //OBTENER -CANTIDAD DE PREGUNTAS- DE UN USUARIO
      //TOTAL PREGUNTAS - PREGUNTAS RESPONDIDAS

      this.options = {
         //backgroundColor: 'pink',
         //
         title: {
            text: 'Preguntas:',
            //left: 'right',
            right: '25',
            padding: [5, 0],
            top: '40',
            //backgroundColor: 'yellow',
            textStyle: {
               color: '#666674',
               fontFamily: 'sans-serif',
               align: 'left',
               //verticalAlign: 'middle'
            }
         },
         color: ['#D6D7E1', '#34BFA3'],
         tooltip: {
            trigger: 'item',
            formatter: "{a} <br/> {b}: {c}"
         },
         legend: {
            orient: 'vertical',
            x: 'right',
            y: 'middle',
            align: 'left',
            itemWidth: 32,
            data: ['Faltantes', 'Realizadas'],
            itemStyle: {
               fontSize: 20
            },
            textStyle: {
               color: '#666674',
               fontWeight: 600,
               fontFamily: 'sans-serif',
               fontSize: 14,
               padding: [0, 0, 0, 5]
            }
         },
         series: [
            {
               name: 'Preguntas',
               type: 'pie',
               selectedMode: 'single',
               radius: ['60%', '85%'],
               center: ['35%', '49%'],
               itemStyle: {
                  normal: {
                     shadowBlur: 5,
                     shadowOffsetX: 0,
                     shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                  // emphasis: {
                  //   shadowBlur: 8,
                  //   shadowOffsetX: 0,
                  //   shadowColor: 'rgba(0, 0, 0, 0.2)',
                  // },
               },
               labelLine: { //eliminar las líneas por fuera del chart
                  show: false
               },
               avoidLabelOverlap: false,
               label: {
                  // normal: {
                  //   show: false,
                  //   position: 'center',
                  // },
                  emphasis: {
                     show: true,
                     zlevel: 100,
                     position: 'center',
                     textStyle: {
                        fontSize: '25',
                        fontWeight: 'bold',
                        color: '#666674'
                     },
                     formatter: "{d}%"
                  }
               },
               data: [
                  {
                     value: 335,
                     name: 'Faltantes',
                     //avoidLabelOverlap: true,
                     label: {
                        normal: {
                           show: false
                        },
                        emphasis: {
                           show: false,
                           position: 'center'
                        }
                     }
                  },
                  {
                     value: 1548, //CANTIDAD DE PREGUNTAS RESPONDIDAS
                     name: 'Realizadas',
                     avoidLabelOverlap: false,
                     label: {
                        normal: {
                           position: 'center',
                           formatter: [
                              'a|{a}',
                              'b|{b}%'
                           ].join('/n'),
                           rich: {
                              a: {
                                 color: 'red'
                              },
                              b: {
                                 color: 'blue'
                              }
                           },

                           //'{d}%',
                           textStyle: {
                              fontSize: '25',
                              fontWeight: 'bold',
                              color: '#666674'
                           },

                        },
                     }
                  }
               ]
            }
         ]
      };


   }

   openCreateCourse() {
      const modalRef = this.ngModal.open(CreateCourseComponent);
      modalRef.componentInstance.action = 'Crear';
   }

   openCreateAnswer() {
      const modalRef = this.ngModal.open(CreateQuestionComponent, {
         size: "lg"
      });
   }


   updateSubcategory(subcategory) {
      console.log("SUBCATEGORY: ", subcategory);
      const modalRef = this.ngModal.open(ModalSubcategoryComponent);
      modalRef.componentInstance.action = 'Actualizar';
      modalRef.componentInstance.subcategory = subcategory;
      modalRef.result
         .then((result) => { if (result) this.getLastSubcategories() })
         .catch(reason => reason);
   }

   initSubject() {
      const modalRef = this.ngModal.open(SubjectInitComponent, { size: "lg" });
      modalRef.componentInstance.id_user = this.id_user;
      modalRef.result
         .then((result) => {
            if (result) {
               // Actualiza el sidemenu con rol de profesor
               this._sidemenuSrv.changeSidemenuByRole(2);
            }
         })
         .catch(reason => reason);
   }

   getLastCourses(id_user) {
      this._courseSrv.getLatestUpdatedCourses({ id_user, page_size: 3 })
         .subscribe(
            (result: any) => {
               console.log("last courses: ", result);
               this.courses = result.items;
               this.courses.forEach(course => {

                  let chart_color: string;
                  if (course.percentage >= 0 && course.percentage <= 33.33) chart_color = '#fd397a';
                  else if (course.percentage > 33.33 && course.percentage <= 66.66) chart_color = '#ffb822';
                  else if (course.percentage > 66.66 && course.percentage <= 100) chart_color = '#0abb87';
                  else console.log('error');

                  course.options = {
                     title: {
                        text: 'Preguntas:',
                        right: '25',
                        padding: [5, 0],
                        top: '40',
                        textStyle: {
                           color: '#666674',
                           fontFamily: 'sans-serif',
                           align: 'left',
                        }
                     },
                     color: ['#D6D7E1', chart_color],
                     tooltip: {
                        trigger: 'item',
                        formatter: "{a} {b}: {c}"
                     },
                     legend: {
                        orient: 'vertical',
                        x: 'right',
                        y: 'middle',
                        align: 'left',
                        itemWidth: 32,
                        data: ['Faltantes', 'Realizadas'],
                        itemStyle: {
                           fontSize: 20
                        },
                        textStyle: {
                           color: '#666674',
                           fontWeight: 600,
                           fontFamily: 'sans-serif',
                           fontSize: 14,
                           padding: [0, 0, 0, 5]
                        }
                     },
                     series: [
                        {
                           name: 'Preguntas',
                           type: 'pie',
                           selectedMode: 'single',
                           radius: ['60%', '85%'],
                           center: ['35%', '49%'],
                           itemStyle: {
                              normal: {
                                 shadowBlur: 5,
                                 shadowOffsetX: 0,
                                 shadowColor: 'rgba(0, 0, 0, 0.5)',
                              },
                           },
                           labelLine: { 
                              show: false // Elimina las líneas por fuera del chart
                           },
                           avoidLabelOverlap: false,
                           label: {
                              emphasis: {
                                 show: true,
                                 zlevel: 100,
                                 position: 'center',
                                 textStyle: {
                                    fontSize: '24',
                                    fontWeight: 'bold',
                                    color: '#666674'
                                 },
                                 //formatter: "{d}% -"
                              }
                           },
                           data: [
                              {
                                 //value: this.courses[0].teacher_goal - this.courses[0].student_goal,
                                 value: course.course_goal - course.total_asked_questions, //PREGUNTAS RESPONDIDAS - PREGUNTAS TOTALES
                                 name: 'Faltantes',
                                 label: {
                                    normal: {
                                       show: false
                                    },
                                    emphasis: {
                                       show: false,
                                       position: 'center'
                                    }
                                 }
                              },
                              {
                                 value: course.total_asked_questions, //CANTIDAD DE PREGUNTAS RESPONDIDAS 2
                                 //value: this.courses[0].student_goal,
                                 name: 'Realizadas',
                                 avoidLabelOverlap: false,
                                 label: {
                                    normal: {
                                       position: 'center',
                                       formatter: [
                                          '{a|{d}%}',
                                          '{b|de una meta de}',
                                          `{c|${course.course_goal}}`
                                       ].join('\n'),
                                       rich: {
                                          a: {
                                             padding: [0, 0, 17, 12],
                                             fontSize: '28',
                                             fontWeight: 'bold',
                                             color: '#666674',
                                             verticalAlign: 'bottom'
                                          },
                                          b: {
                                             height: 18,
                                             fontSize: '11',
                                             color: '#666674',
                                             padding: [0, 0, 5, 0]
                                          },
                                          c:{
                                             fontSize: '14',
                                             fontWeight: '600',
                                             color: '#666674',
                                          }

                                       },
                                       textStyle: {
                                          fontSize: '24',
                                          fontWeight: 'bold',
                                          color: '#666674'
                                       }
                                    }
                                 }
                              }
                           ]
                        }
                     ]
                  }
               });
            },
            error => {
               console.log("error: ", error);
            }
         );
   }

   getLastCategories(id_user) {
      this._categorySrv.getLastCategories({ id_user, page_size: 5 })
         .subscribe(
            (result: any) => {
               this.categories = result;
            },
            error => {
               console.log("error: ", error);
            }
         );
   }

   getLastSubcategories() {
      this._subcategorySrv.getLastSubcategories({ id_user: this.id_user, page_size: 5 })
         .subscribe(
            (result: any) => {
               //console.log("resultH: ", result);
               this.subcategories = result;
            },
            error => {
               console.log("error: ", error);
            }
         );
   }

   getLastQuestions() {
      this._questionSrv.getLastQuestionsByTeacherId(this.id_user)
         .subscribe(
            (result: any) => {
               console.log("questions: ", result);
               this.questions = result.items;
            },
            error => {
               console.log("error: ", error);
            }
         );
   }

   deleteQuestion(id_question) {
      this._questionSrv.deleteQuestion(id_question)
         .subscribe(
            result => {
               this.getLastQuestions();
               this.successSwal.show();
            },
            error => {
               console.log("error:", error);
               this.toastr.error(TOAST_ERROR_DELETE_QUESTIONS.message, TOAST_ERROR_DELETE_QUESTIONS.title);
            });
   }

   deleteCourse(id_course) {
      this._courseSrv.deleteCourse(id_course)
         .subscribe(
            () => {
               this.getLastCourses(this.id_user);
               this.successSwal2.show();
            },
            error => {
               console.log("error:", error);
               this.toastr.error(TOAST_ERROR_DELETE_COURSES.message, TOAST_ERROR_DELETE_COURSES.title);
            });
   }

   deleteCategory(id_category) {
      this._categorySrv.deleteCategory(id_category)
         .subscribe(
            () => {
               this.getLastCategories(this.id_user);
               this.successSwal3.show();
            },
            error => {
               console.log("error:", error);
               this.toastr.error(TOAST_ERROR_DELETE_CATEGORIES.message, TOAST_ERROR_DELETE_CATEGORIES.title);
            });
   }

   deleteSubcategory(id_subcategory) {
      this._subcategorySrv.deleteSubcategory(id_subcategory)
         .subscribe(
            result => {
               this.getLastSubcategories();
               this.successSwal4.show();
            },
            error => {
               console.log("error:", error);
               this.toastr.error(TOAST_ERROR_DELETE_SUBCATEGORIES.message, TOAST_ERROR_DELETE_SUBCATEGORIES.title);
            });
   }

   updateQuestion(question) {
      const modalRef = this.ngModal.open(UpdateQuestionComponent, { size: "lg" });
      modalRef.componentInstance.question = question; //##### DIFERENTE
      modalRef.componentInstance.action = 'Actualizar'; //##### DIFERENTE
      modalRef.result
         .then((result) => { if (result) this.getLastQuestions() })
         .catch(reason => reason);
   }

   updateCourse(course) {
      console.log("update course: ", course);
      const modalRef = this.ngModal.open(CreateCourseComponent);
      modalRef.componentInstance.course = course;
      modalRef.componentInstance.action = 'Actualizar';
      modalRef.result.then((result) => {
         if (result) this.getLastCourses(this.id_user)
      });
   }


   updateCategory(category) {
      const modalRef = this.ngModal.open(modalCategoryComponent);
      modalRef.componentInstance.action = 'Actualizar';
      modalRef.componentInstance.category = category;
      /*modalRef.result
         .then((result) => { if (result) this.getLastCategories() })
         .catch(reason => reason);*/
   }

   openCreateCategory() {
      const modalRef = this.ngModal.open(modalCategoryComponent);
      modalRef.componentInstance.action = 'Crear';
   }

   // Arreglar este...
   openCreateSubcategory() {
      const modalRef = this.ngModal.open(ModalSubcategoryComponent); 
      modalRef.componentInstance.action = 'Crear';
   }

}
