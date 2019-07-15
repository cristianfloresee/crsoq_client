import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/core/services/API/question.service';

@Component({
  selector: 'cw-questions2',
  templateUrl: './questions2.component.html',
  styleUrls: ['./questions2.component.scss']
})
export class Questions2Component implements OnInit {

  constructor(
     private _questionSrv: QuestionService
  ) { }

  ngOnInit() {
  }

}
