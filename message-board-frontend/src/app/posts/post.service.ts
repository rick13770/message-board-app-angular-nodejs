import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

const POSTS_URL = 'http://localhost:3000/api/posts';

interface NewPost {
  title: string;
  content: string;
}

interface PostDTO extends NewPost {
  _id: string;
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
  private selectedPostSubject = new Subject<Post>();
  private loadingSubject = new BehaviorSubject<boolean>(false);

  readonly allPosts$ = this.postsSubject.asObservable();
  readonly selectedPost$ = this.selectedPostSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  fetchAllPosts(): void {
    this.loadingSubject.next(true);
    this.http
      .get<AllPostsResponse>(POSTS_URL)
      .pipe(
        map((response) => {
          return response.posts.map((post) => {
            return this.transformPost(post);
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsSubject.next([...this.posts]);
        this.loadingSubject.next(false);
      });
  }

  fetchPost(postId: string): void {
    this.loadingSubject.next(true);
    this.http
      .get<SinglePostResponse>(`${POSTS_URL}/${postId}`)
      .subscribe((response) => {
        const post = this.transformPost(response.post);
        this.selectedPostSubject.next(post);
        this.loadingSubject.next(false);
      });
  }

  createPost(newPost: NewPost): void {
    this.loadingSubject.next(true);
    this.http
      .post<SinglePostResponse>(POSTS_URL, newPost)
      .subscribe((response) => {
        const savedPost = this.transformPost(response.post);
        this.posts.unshift(savedPost);
        this.postsSubject.next([...this.posts]);
        this.loadingSubject.next(false);
        this.router.navigateByUrl('/');
      });
  }

  updatePost(postId: string, editedPost: PostDTO): void {
    this.loadingSubject.next(true);
    this.http
      .patch<SinglePostResponse>(`${POSTS_URL}/${postId}`, editedPost)
      .subscribe((response) => {
        const updatedPost = this.transformPost(response.post);
        const postIndex = this.posts.findIndex(
          (post) => post.id === updatedPost.id
        );
        this.posts[postIndex] = updatedPost;
        this.postsSubject.next([...this.posts]);
        this.loadingSubject.next(false);
        this.router.navigateByUrl('/');
      });
  }

  deletePost(postId: string): void {
    this.loadingSubject.next(true);
    this.http.delete(`${POSTS_URL}/${postId}`).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.postsSubject.next([...this.posts]);
      this.loadingSubject.next(false);
      this.router.navigateByUrl('/');
    });
  }

  private transformPost(post: PostDTO): Post {
    return {
      id: post._id,
      title: post.title,
      content: post.content,
    };
  }
}
