import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PostFormComponent } from './posts/post-form/post-form.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
    pathMatch: 'full',
  },
  {
    path: 'create-post',
    component: PostFormComponent,
    pathMatch: 'full',
  },
  {
    path: 'edit-post/:postId',
    component: PostFormComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
