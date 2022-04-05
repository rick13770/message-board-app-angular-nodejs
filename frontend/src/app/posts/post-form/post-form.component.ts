import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
  pageTitle = 'Add Post';
  mode: 'add' | 'edit' = 'add';

  post?: Post;
  id: string = '';

  loading = false;
  postSub?: Subscription;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.postId) {
        this.id = params.postId;
        this.mode = 'edit';
        this.pageTitle = 'Edit Post';

        this.loading = true;
        this.postSub = this.postService.get(this.id).subscribe((post) => {
          this.post = post;
          this.loading = false;
        });
      } else {
        this.mode = 'add';
      }
    });
  }

  ngOnDestroy(): void {
    this.postSub?.unsubscribe();
  }

  onSubmit(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }

    this.loading = true;
    let action = null;

    if (this.mode === 'add') {
      const post = {
        title: postForm.value.title,
        imageUrl: postForm.value.imageUrl,
        content: postForm.value.content,
      };

      action = this.postService.create(post);
    } else {
      action = this.postService.update(this.id, postForm.value);
    }

    action?.subscribe((_response) => {
      this.loading = false;
      this.router.navigateByUrl('/');
    });
  }
}
