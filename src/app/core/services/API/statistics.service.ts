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
export class ActivityService {

    constructor(
        public http: HttpClient,
    ) { }

    get(params){
        // + Necesito una interface:
        // + { year, page, page_size }
        return this.http.get(API.CALENDARS, { params })
     }
}
