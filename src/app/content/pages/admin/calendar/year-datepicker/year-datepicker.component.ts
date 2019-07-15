import { Component, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
   selector: 'cw-year-datepicker',
   templateUrl: './year-datepicker.component.html',
   styleUrls: ['./year-datepicker.component.scss'],
   providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => YearDatepickerComponent),
        multi: true
      }
    ]
})
export class YearDatepickerComponent {

   @ViewChild('calendarPanel') calendar: NgbDropdown;
   @Input() date;

   incr: number = 0;
   months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

   data: any;
   dataTxt: string; //LO QUE SE MUESTRA

   constructor() { }

   ngOnInit() {
      console.log("YEAR PASADO: ", this.date);
      this.data = this.date.year;
      this.dataTxt = this.date.year;
      this.incr = this.getIncr(this.data);
   }

   getIncr(year: number): number {
      return (year - year % 10) - 1;
   }

   selectYear($event, index) {
      console.log("SELECT YEAR: ", index);
      $event.stopPropagation();
      this.data = index + this.incr;
      this.dataTxt = this.data;
      this.incr = this.getIncr(this.data);
      this.date.year = this.data;
      console.log("date: ", this.date);
   }

   ShowOtherYears($event: any, incr: number) {
      $event.stopPropagation();
      let year = this.data + 10 * incr;
      console.log(year);
      this.data = year;
      this.incr = this.getIncr(year);
      this.dataTxt = this.data;

   }




   writeValue(data): void {
      this.data = data;
      this.onChange(this.data)
    }
  onChange = (data) => {
    console.log("SE EJECUTA ONCHANGE: ", data);
    this.data = data;
    this.dataTxt = data;
    this.incr = this.getIncr(this.data); //desde donde empieza el dropdown 1999.2009.2019
  };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };


  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (data) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {

  }




}
