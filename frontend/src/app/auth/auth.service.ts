import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthData } from './auth-data';

const USERS_URL = environment.apiUrl + '/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post<AuthData>(USERS_URL + '/register', {
      email: user.email,
      password: user.password,
    });
  }

  login(user: any) {
    return this.http.post<AuthData>(USERS_URL + '/login', {
      email: user.email,
      password: user.password,
    });
  }
}
