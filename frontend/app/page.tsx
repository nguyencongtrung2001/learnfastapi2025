import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📚 FastAPI + Next.js
          </h1>
          <p className="text-xl text-gray-600">
            Quản lý Tác giả và Bài viết
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Authors Card */}
          <Link href="/authors">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Tác giả
              </h2>
              <p className="text-gray-600 mb-6">
                Xem danh sách tác giả, tạo mới, và upload ảnh
              </p>
              <div className="flex gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Xem tất cả
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Tạo mới
                </span>
              </div>
            </div>
          </Link>

          {/* Posts Card */}
          <Link href="/posts">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Bài viết
              </h2>
              <p className="text-gray-600 mb-6">
                Quản lý bài viết, liên kết với tác giả
              </p>
              <div className="flex gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Xem tất cả
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Tạo mới
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            ✨ Tính năng
          </h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-2">🚀</div>
              <p className="font-semibold text-gray-800">FastAPI Backend</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-2">⚡</div>
              <p className="font-semibold text-gray-800">Next.js 15</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-2">📸</div>
              <p className="font-semibold text-gray-800">Upload Ảnh</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-2">🔗</div>
              <p className="font-semibold text-gray-800">Relationships</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}