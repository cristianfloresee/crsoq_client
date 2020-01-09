// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// API Services
import { StatisticsService } from 'src/app/core/services/API/statistics.service';
import { CourseService } from 'src/app/core/services/API/course.service';
// Modals
import { StudentPointsComponent } from '../../modals/student-points/student-points.component';

@Component({
    selector: 'cw-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

    // Parámetros de la url
    urlParamChanges$: Subscription;
    id_subject;
    id_course;

    course_details;

    options;
    data_points;

    constructor(
        private route: ActivatedRoute,
        private ngModal: NgbModal,
        private _statisticsSrv: StatisticsService,
        private _courseSrv: CourseService
    ) { }

    ngOnInit() {
        // Obtiene los params de la url
        this.urlParamChanges$ = this.route.params
            .subscribe(params => {
                this.id_course = params.idCourse;
                this.id_subject = params.idSubject;

                this.getCourseDetails(this.id_course);
            });

        this.getCourseStudentPoints(this.id_course);
    }

    getCourseDetails(id_course){
        this._courseSrv.getCourseDetail(id_course)
        .subscribe(
            (result: any) => {
                //this.data_points = result;
                console.log("course_details: ", result);
                this.course_details = result;
            },
            error => {
                console.log("error code:", error);
            }
        );
    }

    getCourseStudentPoints(id_course) {
        this._statisticsSrv.getCourseStudentPoints(id_course)
            .subscribe(
                (result: any) => {
                    this.data_points = result;
                    console.log("getCourseStudentPoints: ", result);

                    this.initChart(this.data_points)

                },
                error => {
                    console.log("error code:", error);
                }
            );
    }

    initChart(student_points: Array<any>) {

        let students = student_points.map(student => `${student.name} ${student.last_name}`);
        let question_points = student_points.map(student => student.question_points);
        let activity_points = student_points.map(student => student.activity_points);

        this.options = {
            barMaxWidth: 30,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Puntos por Preguntas', 'Puntos por Actividades']
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                name: 'Estudiantes',
                axisLabel: {
                    rotate: 80

                },
                data: students

            },
            yAxis: {
                type: 'value',
                name: 'Puntos',
                minInterval: 1

            },
            series: [
                {
                    name: 'Puntos por Preguntas',
                    type: 'bar',
                    stack: 'points',
                    data: question_points
                },
                {
                    name: 'Puntos por Actividades',
                    type: 'bar',
                    stack: 'points',
                    data: activity_points
                }
            ]
        };

        console.log("OPTIONS: ", this.options);
    }

    openStudentPointsModal() {
        console.log("openStudentPointsModal...");
        const modalRef = this.ngModal.open(StudentPointsComponent, {
            windowClass: 'xlModal'
        });
        modalRef.componentInstance.student_points = this.data_points;
        modalRef.componentInstance.course_details = this.course_details;

        modalRef.result
            .then((result) => {
                // Pasar data
                if (result) { }
            })
            .catch(reason => reason);
    }

    updateClass(_class) {
        //const modalRef = this.ngModal.open(ModalLessonComponent);
        //modalRef.componentInstance.lesson = _class;
        //modalRef.componentInstance.options_module = this.options_module;
    }

}
