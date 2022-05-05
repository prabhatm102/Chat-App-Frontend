import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { UnAuthorisedError } from '../common/unAuthorised-error';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  url: string = '';
  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'conversations';
  }

  getChatsByConversationOrUserId(id: string) {
    return this.http
      .get(this.url + '/chats/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }
  getGroupsByUserId(id: string) {
    return this.http
      .get(this.url + '/user/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  createGroup(resource: any) {
    return this.http
      .post(this.url + '/create-group', resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  sendMessage(id: string, data: any) {
    return this.http
      .patch(this.url + '/send-message/' + id, data, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  addMembers(id: string, data: any) {
    return this.http
      .patch(this.url + '/add-members/' + id, data, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  removeMembers(id: string, data: any) {
    return this.http
      .patch(this.url + '/remove-members/' + id, data, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  updateSeen(id: string, data: any) {
    return this.http
      .patch(this.url + '/chats/update-seen/' + id, data, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  private handleError(error: Response) {
    if (error.status === 400) return throwError(new BadInput(error));
    if (error.status === 404) return throwError(new NotFoundError(error));
    if (error.status === 403) return throwError(new UnAuthorisedError(error));
    if (error.status === 401) return throwError(new UnAuthorisedError(error));
    return throwError(new AppError(error));
  }
}
