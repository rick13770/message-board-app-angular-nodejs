import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user';

const USERS_URL = environment.apiUrl + '/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private userEmail = '';

  private authStatus = new ReplaySubject<boolean>(1);

  readonly authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http
      .post<User>(USERS_URL + '/register', {
        email: user.email,
        password: user.password,
      })
      .pipe(
        tap(() => {
          this.isAuthenticated = true;
          this.userEmail = user.email;
          this.authStatus.next(true);
        })
      );
  }

  login(user: any) {
    return this.http
      .post<User>(USERS_URL + '/login', {
        email: user.email,
        password: user.password,
      })
      .pipe(
        tap(() => {
          this.isAuthenticated = true;
          this.userEmail = user.email;
          this.authStatus.next(true);
        })
      );
  }

  logout() {
    this.isAuthenticated = false;
    this.authStatus.next(false);
    localStorage.removeItem('message-board-user');
  }

  getAuthenticated() {
    return this.isAuthenticated;
  }

  getUserEmail() {
    return this.userEmail;
  }

  getToken() {
    const data = localStorage.getItem('message-board-user');
    if (data) {
      return JSON.parse(data).token;
    }
  }

  autoLogin() {
    const data = localStorage.getItem('message-board-user');
    if (data) {
      const user = JSON.parse(data);
      this.isAuthenticated = true;
      this.userEmail = user.email;
      this.authStatus.next(true);

      return user;
    }
  }
}
