import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
  post?: Post;
  postId: string = '';

  mode: 'add' | 'edit' = 'add';
  pageTitle = 'Add Post';

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.postId) {
        this.postId = params.postId;
        this.mode = 'edit';
        this.pageTitle = 'Edit Post';

        this.postService.fetchPost(this.postId);
        this.postService.selectedPost$.subscribe((post) => {
          this.post = post;
        });
      } else {
        this.mode = 'add';
      }
    });
  }

  onSubmit(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }

    if (this.mode === 'add') {
      const post = {
        title: postForm.value.title,
        content: postForm.value.content,
      };

      this.postService.createPost(post);
    } else {
      this.postService.updatePost(this.postId, postForm.value);
    }

    postForm.resetForm();
    this.router.navigateByUrl('/');
  }
}
