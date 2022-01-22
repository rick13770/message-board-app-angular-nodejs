import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from './post.model';

const DUMMY_POSTS: Post[] = [
  {
    title: 'First Post',
    content: 'This is the first post',
  },
  {
    title: 'Second Post',
    content: 'This is the second post',
  },
  {
    title: 'Third Post',
    content: 'This is the third post',
  },
];

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = DUMMY_POSTS;
  private postsSubject = new BehaviorSubject<Post[]>(this.posts);

  constructor() {}

  getPostsObservable() {
    return this.postsSubject.asObservable();
  }

  fetchAllPosts() {
    return [...this.posts];
  }

  createPost(post: Post) {
    this.posts.push(post);
  }
}
