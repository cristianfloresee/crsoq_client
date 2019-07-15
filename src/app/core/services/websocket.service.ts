//ANGULAR
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//RXJS
import { Observable } from 'rxjs';
//SOCKET
import { Socket } from 'ngx-socket-io'
//CONSTANTES
import { API_URL } from '../../config/constants';

//EMITERS: this.socket.emit('sendMessage', { message: msg });
//HANDLERS: this.socket.on('newMessage', msg => observer.next(msg) );


@Injectable({
   providedIn: 'root'
})
export class WebSocketService {

   constructor(
      private socket: Socket
   ){

   }

}
