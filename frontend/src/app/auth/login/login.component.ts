import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy, OnInit {
  isLoading = false;

  loginSub?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginSub = this.authService
      .login({
        email: loginForm.value.email,
        password: loginForm.value.password,
      })
      .subscribe(
        (response) => {
          this.isLoading = false;
          console.log(response);
          localStorage.setItem(
            'message-board-user',
            JSON.stringify({
              id: response.id,
              email: response.email,
              token: response.token,
            })
          );
          this.router.navigateByUrl('/');
        },
        (errorResponse) => {
          this.isLoading = false;
          console.log(errorResponse);
          alert(errorResponse.error.message);
        }
      );
  }
}
