// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API } from '../../../config/constants';
// Services
import { SocketService } from '../socket.service';

@Injectable()
export class LessonQuestionService {

   constructor(
      private http: HttpClient,
      private socketSrv: SocketService
   ) { }

   // Obtiene las preguntas de la clase.
   // Interface {id_lesson, id_category, id_subcategory, difficulty, page_size, page}
   getLessonQuestions(params) {
      return this.http.get(API.LESSON_QUESTIONS, { params });
   }

   // Obtiene las preguntas de la biblioteca de la asignatura.
   // Interface {id_user, id_subject, id_category, id_subcategory, difficulty, id_lesson, page_size, page}
   getAllQuestionsForLesson(params) {
      return this.http.get(`${API.LESSON_QUESTIONS}/all`, { params });
   }

   getAllQuestionsByCourse(id_course, params) {
      return this.http.get(`${API.LESSON_QUESTIONS}/course/${id_course}`, { params });
   }


   // params : { id_user, id_subject, id_ course }
   // + Creo que el id_subject se podría obviar.
   getCourseQuestions(params){
      return this.http.get(`${API.LESSON_QUESTIONS}/course_questions`, { params });
   }

   // Actualiza el estado de una pregunta
   updateLessonQuestion(id_class, id_question, status) {
      return this.http.post(`${API.LESSON_QUESTIONS}/${id_class}/${id_question}`, { status })
   }

   // Agrega o elimina múltiples preguntas a la clase
   updateLessonQuestions(id_lesson, add_questions, delete_questions) {
      return this.http.post(API.LESSON_QUESTIONS, { id_lesson, add_questions, delete_questions });
   }

   deleteLessonQuestion(id_class, id_question) {
      return this.http.delete(`${API.LESSON_QUESTIONS}/${id_class}/${id_question}`);
   }

    // Cuando una clase se ha iniciado
    listenClassQuestionStartedToStudents() {
      return this.socketSrv.listen('classQuestionStarted');
   }

   // Cuando una pregunta se ha iniciado
   listenPlayingTheClassQuestion(){
      return this.socketSrv.listen('playingTheClassQuestion');
   }

   listenStudentHasEnteredToClassroom(){
      return this.socketSrv.listen('studentHasEnteredToTheClassroom');
   }

   
   l_UpdateParticipantStatus(){
      return this.socketSrv.listen('updateParticipantStatus');
   }

   e_UpdateParticipantStatus(params){
      return this.socketSrv.emit('updateParticipantStatus', params)
   }

   //>
    // + params: { participant_student }
    setStudentParticipationStatus(winner_student, id_class, id_question ){
      return this.http.post(`${API.USER_QUESTION_CLASS}/winner_student`, { winner_student, id_class, id_question } )
   }

   //>
   setLoserStudent(student, id_class, id_question, status){
      return this.http.post(`${API.USER_QUESTION_CLASS}/loser_student`, { student, id_class, id_question, status } )
   }





   // Cuando el estudiante presiona el botón participar emite este evento
   listenAStudentHasEnteredToParticipate(){
      return this.socketSrv.listen('aStudentHasEntered');
   }

   // Necesito el id_class
   // Ingresa a la sala de socket.io de los usuario que estan en la sección de juego de pregunta
   enterToPlayQuestionSectionRoomAsStudent(params){
      console.log("enterToPlayQuestionSectionRoomAsStudent: ", params);
      return this.socketSrv.emit('enterToPlayQuestionSectionRoomAsStudent', params)
   }

   // necesito el id_class
   // Sale de la sala de socket.io de los usuario que estan en la sección de juego de pregunta
   exitToPlayQuestionSectionRoomAsStudent(params){
      console.log("exitToPlayQuestionSectionRoomAsStudent: ", params);
      return this.socketSrv.emit('exitToPlayQuestionSectionRoomAsStudent', params)
   }

   enterToPlayQuestionSectionRoomAsTeacher(params){
      console.log("enterToPlayQuestionSectionRoomAsTeacher: ", params);
      return this.socketSrv.emit('enterToPlayQuestionSectionRoomAsTeacher', params);
   }

   exitToPlayQuestionSectionRoomAsTeacher(params){
      console.log("exitToPlayQuestionSectionRoomAsTeacher: ", params);
      return this.socketSrv.emit('exitToPlayQuestionSectionRoomAsTeacher', params)
   }

  


  
  

}
