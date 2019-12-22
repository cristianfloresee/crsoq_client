// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API } from '../../../config/constants';
// Services
import { SessionService } from './session.service';
// RxJS
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class StatisticsService {

    constructor(
        public http: HttpClient,
    ) { }

    getCourseStudentPoints(id_course) {
        // + Necesito una interface:
        // + { year, page, page_size }
        return this.http.get(`${API.STATISTICS}/course_student_points/${id_course}`);
    }

}
