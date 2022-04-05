import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post';
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
    this.fetchAll();
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.delete(id).subscribe((_response) => {
      this.fetchAll();
    });
  }

  private fetchAll() {
    this.loading = true;
    this.postsSubscription = this.postService.list().subscribe((posts) => {
      this.posts = posts;
      this.loading = false;
    });
  }
}
