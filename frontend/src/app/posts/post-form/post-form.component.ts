import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  postForm?: FormGroup;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl({ value: '', disabled: this.loading }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      imageUrl: new FormControl({ value: '', disabled: this.loading }, [
        Validators.required,
      ]),
      content: new FormControl({ value: '', disabled: this.loading }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1000),
      ]),
    });

    this.activatedRoute.params.subscribe((params) => {
      if (params.postId) {
        this.id = params.postId;
        this.mode = 'edit';
        this.pageTitle = 'Edit Post';

        this.loading = true;
        this.postSub = this.postService.get(this.id).subscribe((post) => {
          this.post = post;
          this.loading = false;

          this.postForm?.setValue({
            title: this.post?.title,
            imageUrl: this.post?.imageUrl,
            content: this.post?.content,
          });
        });
      } else {
        this.mode = 'add';
      }
    });
  }

  ngOnDestroy(): void {
    this.postSub?.unsubscribe();
  }

  onSubmit() {
    if (this.postForm?.invalid) {
      return;
    }

    this.loading = true;
    let action = null;

    if (this.mode === 'add') {
      const post = {
        title: this.postForm?.value.title,
        imageUrl: this.postForm?.value.imageUrl,
        content: this.postForm?.value.content,
      };

      action = this.postService.create(post);
    } else {
      action = this.postService.update(this.id, this.postForm?.value);
    }

    this.postForm?.reset();

    action?.subscribe((_response) => {
      this.loading = false;
      this.router.navigateByUrl('/');
    });
  }
}
