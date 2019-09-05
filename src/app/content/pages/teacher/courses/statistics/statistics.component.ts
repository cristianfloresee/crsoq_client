// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// RxJS
import { Subscription } from 'rxjs';

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

    options;

    constructor(
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        // Obtiene los params de la url
        this.urlParamChanges$ = this.route.params
            .subscribe(params => {
                this.id_course = params.idCourse;
                this.id_subject = params.idSubject;
            });

        this.options = {
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
                data: ['Juan', 'Alexis', 'Matías', 'Pedro', 'Mike', 'Ana', 'Beto', 'Cris', 'Katy', 'Mario', 'Pepe', 'Luis', 'Arturo', 'Cristian']

            },
            yAxis: {
                type: 'value',
                name: 'Puntos'
            },
            series: [
                {
                    name: 'Puntos por Preguntas',
                    type: 'bar',
                    stack: 'points',
                    data: [320, 302, 301, 334, 390, 330, 320, 100, 210, 310, 210, 232, 320, 430]
                },
                {
                    name: 'Puntos por Actividades',
                    type: 'bar',
                    stack: 'points',
                    data: [120, 132, 101, 134, 90, 230, 210, 100, 210, 310]
                }
            ]
        };
    }

}
