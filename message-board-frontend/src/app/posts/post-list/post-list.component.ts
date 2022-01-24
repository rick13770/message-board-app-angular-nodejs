import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = false;
  postsSubscription = new Subscription();

  constructor(private postService: PostService) {
    this.postService.allPosts$.subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnInit(): void {
    this.fetchAllPosts();
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe((_response) => {
      this.fetchAllPosts();
    });
  }

  private fetchAllPosts() {
    this.loading = true;
    this.postsSubscription = this.postService
      .fetchAllPosts()
      .subscribe((posts) => {
        this.posts = posts;
        this.loading = false;
      });
  }
}
