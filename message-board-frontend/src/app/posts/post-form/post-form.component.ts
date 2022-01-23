import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
  private mode: 'add' | 'edit' = 'add';
  private postId?: string;

  post?: Post;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.postId) {
        this.mode = 'edit';
        this.postService.fetchPost(params.postId);
        this.postService.selectedPost$.subscribe((post) => {
          this.post = post;
        });
      } else {
        this.mode = 'add';
      }
    });
  }

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
