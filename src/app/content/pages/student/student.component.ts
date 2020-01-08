// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// rxjs
import { Subscription } from 'rxjs';
// Services
import { EnrollmentService } from 'src/app/core/services/API/enrollments.service';
import { SessionService } from 'src/app/core/services/API/session.service';
import { SidemenuService } from 'src/app/core/services/sidemenu.service';
// Modals
import { CreateEnrollmentComponent } from './modals/create-enrollment/create-enrollment.component';

@Component({
   selector: 'cw-student',
   templateUrl: './student.component.html',
   styles: []
})
export class StudentComponent implements OnInit, OnDestroy {

   id_user;
   subscriptions$: Subscription;

   constructor(
      private _enrollmentSrv: EnrollmentService,
      private toastr: ToastrService,
      private _sidemenuSrv: SidemenuService,
      private ngModal: NgbModal,
      private _sessionSrv: SessionService
   ) {
      this.subscriptions$ = new Subscription();
   }

   ngOnInit() {
      this.id_user = this._sessionSrv.userSubject.value.id_user;

      this.subscriptions$.add(this._enrollmentSrv.listenEnrollments()
         .subscribe((data: any) => {
            // Actualiza el sidemenu del estudiante
            console.log("data socket enrolled: ", data);
            this._sidemenuSrv.changeSidemenuByRole(3);
            this.toastr.success(`Has sido inscrito en un curso para la asignatura ${data.subject}`, 'Inscrito en un Curso!');
         })
      );

      this.subscriptions$.add(this._enrollmentSrv.listenEnrollmentDeleted()
         .subscribe((data: any) => {
            console.log("data socket deleted: ", data);
            // Actualiza el sidemenu del estudiante
            this._sidemenuSrv.changeSidemenuByRole(3);
            this.toastr.success(`Has sido eliminado de un curso para la asignatura ${data.subject}`, 'Eliminado de un Curso!');
         })
      );

   }

   // Modal de Inscripciones
   // + Inscribirse o salir de un curso
   createEnrollment() {
      const modalRef = this.ngModal.open(CreateEnrollmentComponent);
      modalRef.componentInstance.id_user = this.id_user;
      /*
      modalRef.result.then((result) => {
         if (result) this.getCalendars()
      });*/
   }

   ngOnDestroy() {
      this.subscriptions$.unsubscribe();
   }

}
