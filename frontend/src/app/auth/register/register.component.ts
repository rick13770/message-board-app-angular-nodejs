import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  isLoading = false;

  constructor() {}

  ngOnInit(): void {}

  onRegister(registerForm: NgForm) {
    console.log('register');
  }
}
