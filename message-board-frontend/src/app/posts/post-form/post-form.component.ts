import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent {
  constructor(private postService: PostService) {}

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }

    const post = {
      title: postForm.value.title,
      content: postForm.value.content,
    };

    this.postService.createPost(post);

    postForm.resetForm();
  }
}
