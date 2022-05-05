import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';
import { NotFoundError } from '../common/not-found-error';
import { UnAuthorisedError } from '../common/unAuthorised-error';

// @Injectable({
//   providedIn: 'root',
// })
export class DataService {
  constructor(private url: string, private http: HttpClient) {}

  getAll(searchQuery?: any) {
    return this.http
      .get(this.url, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
        params: searchQuery,
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  getById(id: string) {
    return this.http
      .get(this.url + '/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  create(resource: any) {
    return this.http
      .post(this.url, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }
  createById(id: string, resource: any) {
    return this.http
      .post(this.url + '/' + id, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      )
      .toPromise();
  }

  updatePatch(id: string, data: any) {
    return this.http
      .patch(this.url + '/' + id, data, {
        headers: {
          ['x-auth-token']: localStorage.getItem('authToken') || '',
        },
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  update(id: string, resource: any) {
    return this.http
      .put(this.url + '/' + id, resource, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
        observe: 'response',
      })
      .pipe(
        map((response) => JSON.parse(JSON.stringify(response))),
        catchError((error) => this.handleError(error))
      );
  }

  delete(id: string) {
    return this.http
      .delete(this.url + '/' + id, {
        headers: { ['x-auth-token']: localStorage.getItem('authToken') || '' },
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
