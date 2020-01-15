import { Component, OnInit } from "@angular/core";
import { QuestionService } from "src/app/core/services/API/question.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
   selector: "cw-questions2",
   templateUrl: "./questions2.component.html",
   styleUrls: ["./questions2.component.scss"]
})
export class Questions2Component implements OnInit {
   id_course;
   urlParamChanges$: Subscription;

   data;
   constructor(
      private route: ActivatedRoute,
      private _questionSrv: QuestionService
   ) {}

   ngOnInit() {
      this.urlParamChanges$ = this.route.paramMap.subscribe(params => {
         this.id_course = params.get("idCourse");
         this.getFinishedQuestions(this.id_course);
         console.log("id_course: ", this.id_course);
      });
   }

   getFinishedQuestions(id_course) {
      this._questionSrv.getFinishedQuestions({ id_course }).subscribe(
         (result: any) => {
            console.log("result: ", result);
            this.data = result.items;
         },
         error => {
            console.log("error code:", error);
         }
      );
   }
}
