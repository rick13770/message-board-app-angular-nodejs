import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  authSub?: Subscription;

  isLoggedIn = false;
  userEmail = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
