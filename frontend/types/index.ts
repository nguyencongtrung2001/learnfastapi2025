// ========================================
// TYPES CHO AUTHOR
// ========================================

export interface Author {
  id: number;
  name: string;
  image: string | null;
}

export interface AuthorCreate {
  name: string;
}

export interface AuthorWithPosts extends Author {
  posts: Post[];
}

// ========================================
// TYPES CHO POST
// ========================================

export interface Post {
  id: number;
  title: string;
  numberofpage: number;
  content: string;
  price: number;
  author_id: number | null;
}

export interface PostCreate {
  title: string;
  numberofpage: number;
  content: string;
  price: number;
  author_id?: number | null;
}

export interface PostWithAuthor extends Post {
  author: Author | null;
}

// ========================================
// TYPES CHO API RESPONSE
// ========================================

export interface UploadImageResponse {
  message: string;
  image_url: string;
}