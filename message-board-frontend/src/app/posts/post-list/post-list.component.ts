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
  postsSubscription = new Subscription();

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postsSubscription = this.postService.posts$.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );

    this.postService.fetchAllPosts();
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
