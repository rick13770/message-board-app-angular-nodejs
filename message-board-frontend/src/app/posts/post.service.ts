import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

interface AllPostsResponse {
  message: string;
  posts: Post[];
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPostsObservable() {
    return this.postsSubject.asObservable();
  }

  fetchAllPosts() {
    this.http
      .get<AllPostsResponse>('http://localhost:3000/api/posts')
      .subscribe(({ posts }) => {
        this.posts = posts;

        this.postsSubject.next([...this.posts]);
      });
  }

  createPost(post: Post) {
    this.posts.push(post);
  }
}
