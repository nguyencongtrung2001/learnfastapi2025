'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createAuthor, uploadAuthorImage } from '@/lib/api';

export default function CreateAuthorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh');
        return;
      }

      // Kiểm tra file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh tối đa 5MB');
        return;
      }

      setImageFile(file);
      setError(null);

      // Preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Vui lòng nhập tên tác giả');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Bước 1: Tạo author
      const newAuthor = await createAuthor({ name: name.trim() });

      // Bước 2: Upload ảnh (nếu có)
      if (imageFile) {
        await uploadAuthorImage(newAuthor.id, imageFile);
      }

      // Chuyển đến trang chi tiết author
      router.push(`/authors/${newAuthor.id}`);
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
            href="/authors"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">
            ➕ Tạo tác giả mới
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

          {/* Tên tác giả */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Tên tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên tác giả..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Upload ảnh */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Ảnh đại diện
            </label>

            {/* Preview ảnh */}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Input file */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Đang tạo...' : '✅ Tạo tác giả'}
            </button>

            <Link
              href="/authors"
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