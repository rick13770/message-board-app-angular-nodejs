import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent {
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }

    const post: Post = {
      title: postForm.value.title,
      content: postForm.value.content,
    };

    this.postCreated.emit(post);

    postForm.resetForm();
  }
}
