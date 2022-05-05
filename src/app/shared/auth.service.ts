import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import JWT from 'jwt-decode';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = new BehaviorSubject<string>(localStorage.getItem('authToken') || '');
  cast = this.token.asObservable();

  constructor(private router: Router) {}

  isLoggedIn() {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    this.token.next('');
    this.router.navigate(['users/login']);
  }

  updateToken(token: string) {
    localStorage.setItem('authToken', token);
    this.token.next(token);
  }

  getDecodedAccessToken(token: string) {
    try {
      return JWT(token);
    } catch (Error) {
      return null;
    }
  }

  getLoggedInUser() {
    try {
      return JWT(this.token.getValue());
    } catch (Error) {
      return null;
    }
  }
}
