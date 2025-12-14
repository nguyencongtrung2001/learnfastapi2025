import Link from 'next/link';
import { PostWithAuthor } from '@/types';
import { getImageUrl } from '@/lib/api';

interface PostCardProps {
  post: PostWithAuthor;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Ảnh tác giả (nếu có) */}
        {post.author && (
          <div className="relative h-32 bg-gray-200">
            <img
              src={getImageUrl(post.author.image)}
              alt={post.author.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Thông tin bài viết */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
            {post.content}
          </p>

          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-600 font-semibold">
              ${post.price.toFixed(2)}
            </span>
            <span className="text-gray-500">
              {post.numberofpage} pages
            </span>
          </div>

          {post.author && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                By <span className="font-semibold">{post.author.name}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}