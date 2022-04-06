import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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

  totalPosts = 10;
  postsPerPage = 5;

  loading = false;

  postsSub = new Subscription();

  constructor(private postService: PostService) {
    // this.postService.allPosts$.subscribe((posts) => {
    //   this.posts = posts;
    // });
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.delete(id).subscribe((_response) => {
      this.fetchAll();
    });
  }

  onPageChange(page: PageEvent) {
    console.log(page);
    this.fetchAll();
  }

  private fetchAll() {
    this.loading = true;
    this.postsSub = this.postService.list().subscribe((posts) => {
      this.totalPosts = posts.length;
      this.posts = posts;
      this.loading = false;
    });
  }
}
