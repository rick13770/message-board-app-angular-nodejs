export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  creator: any;
  creatorEmail: string;
  createdAt: Date;
  createdAtForHumans: string;
}
