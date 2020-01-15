// Angular
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
// ngx-toastr
import { ToastrService } from 'ngx-toastr';
// Services
import { LoaderService } from './core/services/loader.service';
import { PageService } from './core/services/page.service';
import { RoleService } from './core/services/role.service';
import { SessionService } from './core/services/API/session.service';
import { SocketService } from './core/services/socket.service';
import { LessonService } from './core/services/API/lesson.service';
import { ActivityService } from './core/services/API/activity.service';
import { LessonQuestionService } from './core/services/API/lesson-question.service';

@Component({
   selector: 'cw-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
   animations: [
      trigger('loader_container', [
         state('false', style({ opacity: '0' })),
         state('true', style({ opacity: '0.2' })),
         transition('false => true', animate('300ms ease-in')),
         transition('true => false', animate('600ms ease-in')),
      ]),
      trigger('loader_content', [
         state('false', style({ opacity: '0' })),
         state('true', style({ opacity: '1' })),
         transition('false => true', animate('500ms ease-in')),
         transition('true => false', animate('500ms ease-in')),
      ])
   ]
})
export class AppComponent implements OnInit {
   @ViewChild('cwLoader') cwLoader: ElementRef;

   show_loader: boolean;
   ioConnection: any;

   current_role;

   count = 1;
   socket_estudiante_count = 1;

   subscriptions$: Subscription;

   activityStarted$: Subscription;
   classStarted$: Subscription;
   classQuestionStarted$: Subscription;

   constructor(
      private loaderSrv: LoaderService,
      private _pageSrv: PageService,
      private router: Router,
      private _roleSrv: RoleService,
      private _sessionSrv: SessionService,
      private _socketService: SocketService,
      private _classSrv: LessonService,
      private _activitySrv: ActivityService,
      private _classQuestionSrv: LessonQuestionService,
      private toastr: ToastrService
   ) { }


   ngOnInit() {
      this.subscriptions$ = new Subscription();

      // @JorgeCano
      // Intento trabajar el ruteo de forma reactiva con async pipes en el template pero tuvo problemas.
      // Para hacerlo con async pipes habría que borrar el suscribe.

      // Obtiene el nombre de la página actual
      this.router.events
         .pipe(filter(event => {
            
            return event instanceof NavigationEnd
         }))
         .subscribe((event) => {
            // Obtiene la url después de todas la reedirecciones
            //console.log(' + router.events() (on app.component): ', event);
            let url = event['urlAfterRedirects']
            //let url = event['urlAfterRedirects'];
            this._roleSrv.checkUrlRole(url);

            //console.log("nombre de la página: ", this._pageSrv.getCurrentPageConfig());
            //this.layoutConfigService.setModel({ page: objectPath.get(this.pageConfigService.getCurrentPageConfig(), 'config') }, true);
         });

      // this._sessionSrv.updateSession()
      //    .subscribe(
      //       (resp) => {
      //          console.log(resp);
      //       },
      //       (error) => {
      //          console.log(error);
      //       });


      // Detecta los cambios del loader
      // + Si el status es true muestra el loader
      // + Si el status es false oculta el loader
      this.loaderSrv.status.subscribe((status: boolean) => {
         this.show_loader = status;
         if (status) this.cwLoader.nativeElement.style.display = 'block';
         else setTimeout(() => this.cwLoader.nativeElement.style.display = 'none', 600)
      });


      this.checkIsAuth();

      // Detecta los cambios de la variable global 'role' (después usar redux en vez de servicios)
      this._roleSrv.role$
         .subscribe((role) => {

            this.current_role = role; // { role, index, name, url }
            console.log(" + role$ (on app.component):", role);


            if (role && role.role == 3) {

               if (!this.classStarted$) {
                  this.classStarted$ = this._classSrv.listenClassStartedToStudents()
                     .subscribe((data: any) => {

                        console.log("statusClassUpdated: ", data);

                        // this.getActivities();
                        // 1: no iniciada, 2: iniciada, 3: terminada.
                        // if(data.)
                        this.toastr.info(`Ha sido iniciada una clase para la asignatura ${data.subject}.`, 'Clase Iniciada!');
                     })
               }

               if (!this.activityStarted$) {
                  this.activityStarted$ = this._activitySrv.listenActivityStartedToStudents()
                     .subscribe((data: any) => {

                        console.log("activityStarted: ", data);

                        // this.getActivities();
                        // 1: no iniciada, 2: iniciada, 3: terminada.
                        // if(data.)
                        this.toastr.info(`Ha sido iniciada una actividad para la asignatura ${data.subject}.`, 'Actividad Iniciada!');
                     })
               }

               if (!this.classQuestionStarted$) {
                  this.classQuestionStarted$ = this._classQuestionSrv.listenClassQuestionStartedToStudents()
                     .subscribe((data: any) => {

                        console.log("classQuestionStarted: ", data);

                        // this.getActivities();
                        // 1: no iniciada, 2: iniciada, 3: terminada.
                        // if(data.)
                        this.toastr.info(`Ha sido iniciada una pregunta para la asignatura ${data.subject}.`, 'Pregunta Iniciada!');
                     })
               }
            }
            else {
               // Buscar una forma de desconecte el listener cuando se cierra sesión o se cambia de role.
               //if(this.classStarted$) this.classStarted$.unsubscribe();
            }

         });

   }


   // Chequea si el usuario tiene una sesión iniciada e inicia socket.io en caso de ser así
   checkIsAuth() {

      let token_exp = this._sessionSrv.getTokenExpiration();
      let is_logged = !this._sessionSrv.isInvalidToken(token_exp);
      if (is_logged) {
         //this._socketService.initSocket();
      }
   }

   ngOnDestroy() {
      this.classStarted$.unsubscribe();
   }

}
