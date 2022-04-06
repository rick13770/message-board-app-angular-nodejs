import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.registerSub = this.authService
      .register({
        email: registerForm.value.email,
        password: registerForm.value.password,
      })
      .subscribe((response) => {
        this.isLoading = false;
      });
  }
}
