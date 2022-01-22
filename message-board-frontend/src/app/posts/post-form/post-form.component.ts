import { Component } from '@angular/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent {
  enteredContent = '';
  postContent = '';

  onAddPost() {
    this.postContent = this.enteredContent;
    this.enteredContent = '';
  }
}
