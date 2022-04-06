import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];

  totalPosts = 0;
  pageSize = 2;
  currentPage = 1;

  loading = false;

  authSub?: Subscription;
  postsSub?: Subscription;
  pageSizeSub?: Subscription;

  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.authStatus$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.pageSizeSub = this.postService.pageSize$.subscribe((pageSize) => {
      this.pageSize = pageSize;
      this.fetchAll();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.postsSub?.unsubscribe();
    this.pageSizeSub?.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.delete(id).subscribe((_response) => {
      this.fetchAll();
    });
  }

  onPageChange(page: PageEvent) {
    this.currentPage = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    // this.fetchAll();
    this.postService.changePageSize(this.pageSize);
  }

  private fetchAll() {
    this.loading = true;

    this.postsSub = this.postService
      .list(this.pageSize, this.currentPage)
      .subscribe((responseData) => {
        this.totalPosts = responseData.totalPosts;
        this.posts = responseData.posts;
        this.loading = false;
      });
  }
}
