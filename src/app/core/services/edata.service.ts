// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants
import { API } from 'src/app/config/constants';

//const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class EDataService {

    constructor(
        public http: HttpClient
    ) { }

    exportAsExcelFile(json: any[], sheet_name: string, excelFileName: string): void {
        // Si es array de arrays uso XLSX.utils.aoa_to_sheet(my_array) (para hacer un hoja)
        // Generate worksheet
        //const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        // Generate workbook (agrega la hoja al libro)
        /*const workbook: XLSX.WorkBook = {
            Sheets: {
                [sheet_name]: worksheet
            },
            SheetNames: [sheet_name]  //title del worksheet (hoja de cálculo)
        };*/

        //workbook.Sheets[sheet_name] = worksheet,

        /*
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });*/

        //XLSX.writeFile(workbook, `${excelFileName}.xlsb`);
        // Save to file
        //this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    exportFile(id_course){
      return this.http.get(`${API.FILE}/spreadsheet/${id_course}`, {responseType: 'arraybuffer'})
    }


    /*
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }*/

}