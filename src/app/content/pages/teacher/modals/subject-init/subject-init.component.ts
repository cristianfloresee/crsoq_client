// Angular
import { Component, OnInit, Input } from '@angular/core';
// ng-bootstrap
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Constantes
import { TOAST_SUCCESS_UPDATE_WORKSPACES, TOAST_ERROR_UPDATE_WORKSPACES } from 'src/app/config/toastr_config';
// Services
import { SubjectService } from 'src/app/core/services/API/subject.service';
import { WorkspaceService } from 'src/app/core/services/API/workspace.service';

@Component({
   selector: 'cw-subject-init',
   templateUrl: './subject-init.component.html',
   styleUrls: ['./subject-init.component.scss']
})
export class SubjectInitComponent implements OnInit {

   @Input() id_user;

   // Array de solicitudes que serán enviadas al servidor
   add_workspaces = [];
   delete_workspaces = [];

   // Lista de workspaces (disponibles y ya activos)
   default_right_list;
   default_left_list;

   constructor(
      private _subjectSrv: SubjectService,
      private _workspaceSrv: WorkspaceService,
      public activeModal: NgbActiveModal,
      private toastr: ToastrService
   ) { }

   ngOnInit() {
      console.log("id_user: ", this.id_user);
      this.getSubjects();
      //this.getWorkspaces();
      //this.formatArrayLeft(this.default_left_list, this.default_right_list);
   }

   getWorkspaces(all_workspaces) {

      this._workspaceSrv.getWorkspaces({ id_user: this.id_user })
         .subscribe(
            result => {
               console.log("result: ", result);
               this.default_right_list = result;
               this.formatArrayLeft(all_workspaces, this.default_right_list);

            },
            error => {
               console.log("error:", error);
            });
   }

   getSubjects() {
      this._subjectSrv.getSubjectsOptions()
         .subscribe(
            result => {
               this.getWorkspaces(result)
            },
            error => {
               console.log("error:", error);
            });
   }

   // Elimina los workspaces que ya estan activos (de la lista de workspaces disponibles)
   formatArrayLeft(array_all_workspaces, array_active_workspaces) {

      array_active_workspaces.forEach(workspace => {
         let index_found = array_all_workspaces.findIndex(subject => subject.id_subject == workspace.id_subject);
         if (index_found >= 0) array_all_workspaces.splice(index_found, 1);
      });
      // Asigna la lista de los workspaces disponibles ya formateada (sin los workspaces que ya están activos)
      this.default_left_list = array_all_workspaces;
   }


   outputReceive(right_list) {
      // Obtiene las asignaturas que solo están en el nuevo array (workspaces que hay que agregar)
      this.add_workspaces = right_list.filter(this.compareArrays(this.default_right_list))
      // Obtiene las asignaturas que solo estan en el array original (workspaces que hay que eliminar)
      this.delete_workspaces = this.default_right_list.filter(this.compareArrays(right_list));
      console.log("add: ", this.add_workspaces);
   }

   // Permite comparar arrays de workspaces
   // https://stackoverflow.com/questions/21987909/how-to-get-the-difference-between-two-arrays-of-objects-in-javascript
   compareArrays(subject_array) {
      return (external_item) => {
         return subject_array.filter(item => {
            return (item.id_subject == external_item.id_subject)
         }).length == 0;
      }
   }

   saveWorkspaces() {

      let add_workspaces_formatted = this.formatArrayRequests(this.add_workspaces);
      let delete_workspaces_formatted = this.formatArrayRequests(this.delete_workspaces);
      //console.log("add_workspaces formatted: ", add_workspaces_formatted);
      this._workspaceSrv.updateWorkspaces(this.id_user, add_workspaces_formatted, delete_workspaces_formatted)
         .subscribe(
            result => {
               this.activeModal.close(true);
               this.toastr.success(TOAST_SUCCESS_UPDATE_WORKSPACES.message, TOAST_SUCCESS_UPDATE_WORKSPACES.title);
            },
            error => {
               this.toastr.error(TOAST_ERROR_UPDATE_WORKSPACES.message, TOAST_ERROR_UPDATE_WORKSPACES.title);
               console.log("error:", error);
            });
   }

   formatArrayRequests(array) {
      return array.map(item => item.id_subject);
   }
}
