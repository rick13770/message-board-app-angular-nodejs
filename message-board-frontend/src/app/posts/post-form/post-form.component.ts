import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent {
  @Output() postCreated = new EventEmitter<Post>();

  enteredTitle = '';
  enteredContent = '';

  onAddPost() {
    const post: Post = {
      title: this.enteredTitle,
      content: this.enteredContent,
    };

    this.postCreated.emit(post);

    this.enteredTitle = '';
    this.enteredContent = '';
  }
}
