// Angular
import { Component, OnInit, Input } from '@angular/core';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Services
import { EDataService } from 'src/app/core/services/edata.service';
// Constants
import { saveAs } from 'file-saver/dist/FileSaver';


@Component({
    selector: 'cw-student-points',
    templateUrl: './student-points.component.html',
    styleUrls: ['./student-points.component.scss']
})
export class StudentPointsComponent implements OnInit {

    @Input() student_points;
    @Input() course_details;
    title: string = "Puntos por Estudiante";
    sheet_name: string;

    constructor(
        public activeModal: NgbActiveModal,
        private exportDataSrv: EDataService
    ) { }

    ngOnInit() {
        console.log("STUDENT POINTS: ", this.student_points);
        console.log("course_details: ", this.course_details);
        this.sheet_name = "points_per_student";
        // Asignatura, id_asignatura,
    }

    exportData() {
        //let excel_data = this.formatExcelData(this.student_points);
        //let worksheet_names = [this.title];
        console.log("export data...")
        this.exportDataSrv.exportFile(this.course_details.id_course)
            .subscribe(
                result => {
                    const data: Blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
                    const fileName = 'dsdsds.xls';
                    saveAs(data, fileName);
                    console.log("pass success...")
                },
                error => {
                    console.log("error:", error);
                }
            );
        //this.exportDataSrv.exportAsExcelFile(excel_data, this.sheet_name, 'file_name');
    }

    formatExcelData(data) {
        let new_data = data.map((item, index) => {
            return {
                '#': index + 1,
                'rut': item.document,
                'nombre': `${item.name} ${item.last_name} ${item.middle_name}`,
                'puntos por pregunta': item.question_points,
                'puntos por actividad': item.activity_points,
                'total': item.total
            }
        });
        return new_data;
    }


}