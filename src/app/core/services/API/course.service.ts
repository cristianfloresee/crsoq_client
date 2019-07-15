//ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//CONSTANTES
import { API } from '../../../config/constants';
//SERVICIOS
import { SessionService } from './session.service';
import { SocketService } from '../socket.service';


@Injectable()
export class CourseService {

   constructor(
      public http: HttpClient,
      private _socketSrv: SocketService
   ) { }

   getCourses(params) {
      // + Necesito una interface:
      // + { id_user, id_subject, id_course, page, page_size }
      return this.http.get(API.COURSES, { params })
   }

   getCoursesByCode(id_user, code) {
      // + Necesito una interface:
      // + { id_user, id_course, page, page_size }
      const params = { id_user, code };
      return this.http.get(API.COURSES_SEARCH, { params })
   }

   getCourseDetail(id_course) {
      return this.http.get(`${API.COURSES}/${id_course}`);
   }

   // No usado aún...
   // Interface: { }
   getCoursesOptions(params) {
      return this.http.get(API.COURSES_AS_SELECT_OPTION, { params });
   }

   createCourse(course) {
      const { id_calendar, id_user, id_subject, name, course_goal, student_goal } = course;
      return this.http.post(API.COURSES, { id_calendar, id_user, id_subject, name, course_goal, student_goal })
   }

   updateCourse(id_course, course) {
      return this.http.put(`${API.COURSES}/${id_course}`, course);
   }

   deleteCourse(id_course) {
      return this.http.delete(`${API.COURSES}/${id_course}`);
   }




   /*
   listenEnrollmentDeleted(){
      return this.socketSrv.listen('studentEnrollmentDeleted');
   }*/

}
