import axios from 'axios';
import {
  Author,
  AuthorCreate,
  AuthorWithPosts,
  Post,
  PostCreate,
  PostWithAuthor,
  UploadImageResponse,
} from '@/types';

// Base URL của FastAPI backend
const API_BASE_URL = 'http://localhost:8000';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// API CHO AUTHORS
// ========================================

// Lấy tất cả authors
export const getAllAuthors = async (): Promise<Author[]> => {
  const response = await api.get<Author[]>('/authors/');
  return response.data;
};

// Lấy author theo ID (kèm posts)
export const getAuthorById = async (id: number): Promise<AuthorWithPosts> => {
  const response = await api.get<AuthorWithPosts>(`/authors/${id}`);
  return response.data;
};

// Tạo author mới
export const createAuthor = async (data: AuthorCreate): Promise<Author> => {
  const response = await api.post<Author>('/authors/', data);
  return response.data;
};

// Upload ảnh cho author
export const uploadAuthorImage = async (
  authorId: number,
  file: File
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadImageResponse>(
    `/authors/${authorId}/upload-image/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// ========================================
// API CHO POSTS
// ========================================

// Lấy tất cả posts (kèm author)
export const getAllPosts = async (): Promise<PostWithAuthor[]> => {
  const response = await api.get<PostWithAuthor[]>('/posts/');
  return response.data;
};

// Lấy post theo ID (kèm author)
export const getPostById = async (id: number): Promise<PostWithAuthor> => {
  const response = await api.get<PostWithAuthor>(`/posts/${id}`);
  return response.data;
};

// Tạo post mới
export const createPost = async (data: PostCreate): Promise<Post> => {
  const response = await api.post<Post>('/posts/', data);
  return response.data;
};

// ========================================
// HELPER: Tạo URL đầy đủ cho ảnh
// ========================================
export const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '/placeholder.jpg';
  return `${API_BASE_URL}${imagePath}`;
};