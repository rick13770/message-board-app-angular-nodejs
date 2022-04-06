import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formatDistance } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Post } from './post';

const POSTS_URL = environment.apiUrl + '/posts';

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
  creator: any;
  creatorEmail: string;
  createdAt: Date;
}

interface AllPostsResponse {
  postCount: number;
  totalPosts: number;
  posts: PostWithId[];
  message: string;
}

interface SinglePostResponse {
  post: PostWithId;
  message: string;
}

interface PostsResponseData {
  postCount: number;
  totalPosts: number;
  posts: Post[];
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private responseData: PostsResponseData = {
    message: '',
    postCount: 0,
    totalPosts: 0,
    posts: [],
  };

  private responseDataSubject = new Subject<PostsResponseData>();
  private pageSizeSubject = new Subject<number>();

  readonly allPosts$ = this.responseDataSubject.asObservable();
  readonly pageSize$ = this.pageSizeSubject.asObservable();

  constructor(private http: HttpClient) {}

  list(pageSize: number, currentPage: number): Observable<any> {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;

    return this.http.get<AllPostsResponse>(POSTS_URL + queryParams).pipe(
      map((response) => {
        return {
          message: response.message,
          postCount: response.postCount,
          totalPosts: response.totalPosts,
          posts: response.posts.map((post) => {
            return this.transform(post);
          }),
        };
      }),
      tap((responseData) => {
        this.responseData = responseData;
        this.responseDataSubject.next(this.responseData);
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
        this.responseData.posts = this.responseData.posts.filter(
          (post) => post.id !== postId
        );
        this.responseDataSubject.next(this.responseData);
      })
    );
  }

  changePageSize(pageSize: number) {
    this.pageSizeSubject.next(pageSize);
  }

  private transform(post: PostWithId): Post {
    return {
      id: post._id,
      title: post.title,
      imageUrl: post.imageUrl,
      content: post.content,
      creator: post.creator,
      creatorEmail: post.creator.email,
      createdAt: post.createdAt,
      createdAtForHumans: formatDistance(new Date(post.createdAt), new Date(), {
        addSuffix: true,
      }),
    };
  }
}
