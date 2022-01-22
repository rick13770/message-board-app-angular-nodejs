import { Component } from '@angular/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent {
  newPost = 'DEFAULT CONTENT';

  onAddPost() {
    this.newPost = 'Nulla porttitor accumsan tincidunt.';
  }
}
