import Link from 'next/link';
import { Author } from '@/types';
import { getImageUrl } from '@/lib/api';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link href={`/authors/${author.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Ảnh tác giả */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={getImageUrl(author.image)}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thông tin tác giả */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {author.name}
          </h3>
          <p className="text-sm text-gray-600">ID: {author.id}</p>
        </div>
      </div>
    </Link>
  );
}