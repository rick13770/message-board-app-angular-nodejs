import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnDestroy, OnInit {
  isLoading = false;

  registerSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    if (
      registerForm.value.password !== registerForm.value.passwordConfirmation
    ) {
      this.snackBar.open('Passwords do not match', 'OK', {
        duration: 3000,
      });
      return;
    }

    this.isLoading = true;
    this.registerSub = this.authService
      .register({
        email: registerForm.value.email,
        password: registerForm.value.password,
      })
      .subscribe(
        (response) => {
          this.isLoading = false;
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
          this.snackBar.open(errorResponse.error.message, 'OK', {
            duration: 3000,
          });
        }
      );
  }
}
