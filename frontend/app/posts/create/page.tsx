'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPost, getAllAuthors } from '@/lib/api';
import { Author } from '@/types';

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [numberofpage, setNumberofpage] = useState('');
  const [price, setPrice] = useState('');
  const [authorId, setAuthorId] = useState<number | null>(null);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const data = await getAllAuthors();
      setAuthors(data);
    } catch (err) {
      console.error('Không thể tải danh sách tác giả', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung');
      return;
    }
    if (!numberofpage || parseInt(numberofpage) <= 0) {
      setError('Số trang phải lớn hơn 0');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Giá phải lớn hơn 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newPost = await createPost({
        title: title.trim(),
        content: content.trim(),
        numberofpage: parseInt(numberofpage),
        price: parseFloat(price),
        author_id: authorId,
      });

      router.push(`/posts/${newPost.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">
            ➕ Tạo bài viết mới
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Tiêu đề */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Nội dung */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài viết..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Số trang & Giá */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Số trang <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={numberofpage}
                onChange={(e) => setNumberofpage(e.target.value)}
                placeholder="100"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Giá ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.99"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Tác giả */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Tác giả
            </label>
            <select
              value={authorId || ''}
              onChange={(e) => setAuthorId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">-- Không chọn tác giả --</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Đang tạo...' : '✅ Tạo bài viết'}
            </button>

            <Link
              href="/posts"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}