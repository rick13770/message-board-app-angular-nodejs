import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from './user';

const USERS_URL = environment.apiUrl + '/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post<User>(USERS_URL + '/register', {
      email: user.email,
      password: user.password,
    });
  }

  login(user: any) {
    return this.http.post<User>(USERS_URL + '/login', {
      email: user.email,
      password: user.password,
    });
  }
}
