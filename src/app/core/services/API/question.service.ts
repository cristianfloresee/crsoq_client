// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API } from '../../../config/constants';

@Injectable()
export class QuestionService {

   constructor(
      public http: HttpClient
   ) { }

   // Formatea el el form incluyendo la imagen como binario (única forma por ahora de enviar imagen y otros campos al servidor)
   private formatImageForm(id_subcategory, description, difficulty, image, shared) {
      const formData: FormData = new FormData();
      formData.append('id_subcategory', id_subcategory);
      formData.append('description', description);
      formData.append('difficulty', difficulty);
      formData.append('shared', shared);
      if (image) formData.append('image', image, image.name);
      return formData;
   }

   createQuestion(id_subcategory, description, difficulty, image, shared?) {
      return this.http.post(API.QUESTIONS, this.formatImageForm(id_subcategory, description, difficulty, image, shared))
   }


   updateQuestion(id_question, id_subcategory, description, difficulty, image, shared) {
      // Si la imagen es un archivo(object)
      if ((typeof (image) === 'object') && image !== null) {
         return this.http.put(`${API.QUESTIONS}/${id_question}`, this.formatImageForm(id_subcategory, description, difficulty, image, shared));
      }
      else {
         return this.http.put(`${API.QUESTIONS}/${id_question}`, { id_subcategory, description, difficulty, image, shared });
      }
   }

   // Obtiene las preguntas por id de profesor (usado en la página principal del profesor)
   getLastQuestionsByTeacherId(id_user) {
      let params = { id_user, page_size: '5' };
      return this.http.get(API.QUESTIONS, { params });
   }

   getQuestionsByTeacherIdAndSubjectId(id_user, id_subject) {
      let params = { id_user, id_subject };
      return this.http.get(API.QUESTIONS, { params });
   }

   // Interface {id_user, id_subject, page, page_size}
   getQuestions(params) {
      return this.http.get(API.QUESTIONS, { params });
   }

   // Elimina una pregunta (eliminaría todas las participaciones de esa actividad)
   deleteQuestion(id_question) {
      return this.http.delete(`${API.QUESTIONS}/${id_question}`);
   }

}
