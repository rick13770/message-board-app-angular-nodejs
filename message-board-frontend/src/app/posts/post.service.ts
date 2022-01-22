import { Injectable } from '@angular/core';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  posts: Post[] = [
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

  constructor() {}

  fetchAllPosts() {
    return [...this.posts];
  }
}
