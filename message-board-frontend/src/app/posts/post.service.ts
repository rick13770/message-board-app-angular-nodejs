import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

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

  readonly allPosts$ = this.postsSubject.asObservable();
  readonly selectedPost$ = this.selectedPostSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAllPosts(): void {
    this.http
      .get<AllPostsResponse>('http://localhost:3000/api/posts')
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
      });
  }

  fetchPost(postId: string): void {
    this.http
      .get<SinglePostResponse>(`http://localhost:3000/api/posts/${postId}`)
      .subscribe((response) => {
        const post = this.transformPost(response.post);
        this.selectedPostSubject.next(post);
      });
  }

  createPost(newPost: NewPost): void {
    this.http
      .post<SinglePostResponse>('http://localhost:3000/api/posts', newPost)
      .subscribe((response) => {
        const savedPost = this.transformPost(response.post);
        this.posts.unshift(savedPost);
        this.postsSubject.next([...this.posts]);
      });
  }

  updatePost(postId: string, editedPost: PostDTO): void {
    this.http
      .patch<SinglePostResponse>(
        `http://localhost:3000/api/posts/${postId}`,
        editedPost
      )
      .subscribe((response) => {
        const updatedPost = this.transformPost(response.post);
        const postIndex = this.posts.findIndex(
          (post) => post.id === updatedPost.id
        );
        this.posts[postIndex] = updatedPost;
        this.postsSubject.next([...this.posts]);
      });
  }

  deletePost(postId: string): void {
    this.http
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postsSubject.next([...this.posts]);
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
