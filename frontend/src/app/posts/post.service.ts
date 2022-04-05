import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Post } from './post';

const POSTS_URL = 'http://localhost:3000/api/posts';

interface PostData {
  title: string;
  imageUrl: string;
  content: string;
}

interface PostWithId {
  _id: string;
  title: string;
  imageUrl: string;
  content: string;
}

interface AllPostsResponse {
  posts: PostWithId[];
  message: string;
}

interface SinglePostResponse {
  post: PostWithId;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();

  readonly allPosts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {}

  list(): Observable<Post[]> {
    return this.http.get<AllPostsResponse>(POSTS_URL).pipe(
      map((response) => {
        return response.posts.map((post) => {
          return this.transform(post);
        });
      }),
      tap((posts) => {
        this.posts = posts;
        this.postsSubject.next(this.posts);
      })
    );
  }

  get(id: string): Observable<Post> {
    return this.http.get<SinglePostResponse>(`${POSTS_URL}/${id}`).pipe(
      map((response) => {
        return this.transform(response.post);
      })
    );
  }

  create(post: PostData): Observable<Post> {
    return this.http.post<SinglePostResponse>(POSTS_URL, post).pipe(
      map((response) => {
        return this.transform(response.post);
      })
    );
  }

  update(id: string, post: PostWithId): Observable<Post> {
    return this.http.put<SinglePostResponse>(`${POSTS_URL}/${id}`, post).pipe(
      map((response) => {
        return this.transform(response.post);
      })
    );
  }

  delete(postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${POSTS_URL}/${postId}`).pipe(
      tap((_response) => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postsSubject.next(this.posts);
      })
    );
  }

  private transform(post: PostWithId): Post {
    return {
      id: post._id,
      title: post.title,
      imageUrl: post.imageUrl,
      content: post.content,
    };
  }
}
