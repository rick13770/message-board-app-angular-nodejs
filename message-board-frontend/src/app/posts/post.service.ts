import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Post } from './post.model';

const POSTS_URL = 'http://localhost:3000/api/posts';

interface NewPost {
  title: string;
  content: string;
}

interface PostDTO extends NewPost {
  _id: string;
}

interface MessageResponse {
  message: string;
}

interface AllPostsResponse extends MessageResponse {
  posts: PostDTO[];
}

interface SinglePostResponse extends MessageResponse {
  post: PostDTO;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();

  readonly allPosts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAllPosts(): Observable<Post[]> {
    return this.http.get<AllPostsResponse>(POSTS_URL).pipe(
      map((response) => {
        return response.posts.map((post) => {
          return this.transformPost(post);
        });
      }),
      tap((posts) => {
        this.posts = posts;
        this.postsSubject.next(this.posts);
      })
    );
  }

  fetchPost(postId: string): Observable<Post> {
    return this.http.get<SinglePostResponse>(`${POSTS_URL}/${postId}`).pipe(
      map((response) => {
        return this.transformPost(response.post);
      })
    );
  }

  createPost(post: NewPost): Observable<Post> {
    return this.http.post<SinglePostResponse>(POSTS_URL, post).pipe(
      map((response) => {
        return this.transformPost(response.post);
      })
    );
  }

  updatePost(postId: string, post: PostDTO): Observable<Post> {
    return this.http
      .patch<SinglePostResponse>(`${POSTS_URL}/${postId}`, post)
      .pipe(
        map((response) => {
          return this.transformPost(response.post);
        })
      );
  }

  deletePost(postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${POSTS_URL}/${postId}`).pipe(
      tap((_response) => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postsSubject.next(this.posts);
      })
    );
  }

  private transformPost(post: PostDTO): Post {
    return {
      id: post._id,
      title: post.title,
      content: post.content,
    };
  }
}
