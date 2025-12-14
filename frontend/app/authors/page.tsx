'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllAuthors } from '@/lib/api';
import { Author } from '@/types';
import AuthorCard from '@/components/AuthorCard';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const data = await getAllAuthors();
      setAuthors(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách tác giả');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAuthors}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              👤 Danh sách Tác giả
            </h1>
            <p className="text-gray-600">
              Tổng số: {authors.length} tác giả
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              ← Trang chủ
            </Link>
            <Link
              href="/authors/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              + Tạo tác giả mới
            </Link>
          </div>
        </div>

        {/* Authors Grid */}
        {authors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl mb-4">
              Chưa có tác giả nào
            </p>
            <Link
              href="/authors/create"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Tạo tác giả đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}