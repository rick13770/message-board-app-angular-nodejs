import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user';

const USERS_URL = environment.apiUrl + '/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isReady = new ReplaySubject<boolean>(1);
  private currentUser = new ReplaySubject<User | null>(1);

  readonly isReady$ = this.isReady.asObservable();

  readonly currentUser$ = this.currentUser.asObservable().pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http
      .post<User>(USERS_URL + '/register', {
        email: user.email,
        password: user.password,
      })
      .pipe(
        tap((storedUser) => {
          this.isReady.next(true);
          this.currentUser.next(storedUser);
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
        tap((storedUser) => {
          this.isReady.next(true);
          this.currentUser.next(storedUser);
        })
      );
  }

  logout() {
    this.currentUser.next(null);
    localStorage.removeItem('message-board-user');
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

      this.currentUser.next(user);
    }
    this.isReady.next(true);
  }
}
