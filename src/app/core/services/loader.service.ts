import { Injectable, } from '@angular/core'; //Renderer2, ElementRef
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class LoaderService {

   public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

   show() {
      this.status.next(true);
   }

   hide() {
      setTimeout(() => this.status.next(false), 1000)
   }
}
