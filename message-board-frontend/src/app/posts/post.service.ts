import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

interface PostDTO {
  _id: string;
  title: string;
  content: string;
}

interface AllPostsResponse {
  message: string;
  posts: PostDTO[];
}

interface SinglePostResponse {
  message: string;
  post: PostDTO;
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
      .pipe(
        map((response) => {
          return response.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
            };
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsSubject.next([...this.posts]);
      });
  }

  createPost(post: Post) {
    this.http
      .post<SinglePostResponse>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        const savedPost = {
          id: response.post._id,
          title: response.post.title,
          content: response.post.content,
        };
        this.posts.unshift(savedPost);
        this.postsSubject.next([...this.posts]);
      });
  }
}
