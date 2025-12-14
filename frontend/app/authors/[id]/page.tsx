'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAuthorById, getImageUrl } from '@/lib/api';
import { AuthorWithPosts } from '@/types';
import PostCard from '@/components/PostCard';
import { AxiosError } from 'axios';

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = parseInt(params.id as string);

  const [author, setAuthor] = useState<AuthorWithPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthor = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAuthorById(authorId);
      setAuthor(data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.status === 404 ? 'Không tìm thấy tác giả' : 'Có lỗi xảy ra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/authors"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/authors"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Quay lại danh sách
        </Link>

        {/* Author Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Ảnh */}
            <div className="shrink-0">
              <div className="relative w-64 h-64 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(author.image)}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Thông tin */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {author.name}
              </h1>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-semibold">ID:</span> {author.id}
                </p>
                <p>
                  <span className="font-semibold">Số bài viết:</span>{' '}
                  {author.posts.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts của author */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            📝 Bài viết ({author.posts.length})
          </h2>

          {author.posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">
                Tác giả này chưa có bài viết nào
              </p>
              <Link
                href="/posts/create"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                + Tạo bài viết mới
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {author.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{ ...post, author }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}