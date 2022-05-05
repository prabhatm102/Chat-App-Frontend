import { Injectable } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket, private auth: AuthService) {
    if (auth.isLoggedIn()) {
      let currentUser: any = this.auth.getLoggedInUser();
      if (currentUser?._id) this.joinRoom(currentUser?._id);
    }
  }
  // emit event
  joinRoom(userId: string) {
    this.socket.emit('joinRoom', userId);
  }

  // listen event

  OnReceiveMessage() {
    return this.socket.fromEvent('receiveMessage');
  }
  OnUpdateSeen() {
    return this.socket.fromEvent('updateSeen');
  }

  OnAddedToGroup() {
    return this.socket.fromEvent('addedToGroup');
  }
  OnRemovedFromGroup() {
    return this.socket.fromEvent('removedFromGroup');
  }
}
