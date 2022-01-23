import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

interface AllPostsResponse {
  message: string;
  posts: Post[];
}

interface SinglePostResponse {
  message: string;
  post: Post;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();

  readonly posts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAllPosts() {
    this.http
      .get<AllPostsResponse>('http://localhost:3000/api/posts')
      .subscribe((response) => {
        this.posts = response.posts;
        this.postsSubject.next([...this.posts]);
      });
  }

  createPost(post: Post) {
    this.http
      .post<SinglePostResponse>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        this.posts.unshift(response.post);
        this.postsSubject.next([...this.posts]);
      });
  }
}
