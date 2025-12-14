from pydantic import BaseModel
from typing import Optional, List

# ========================================
# SCHEMAS CHO AUTHOR
# ========================================

# Schema để tạo Author (Request Body)
class AuthorCreate(BaseModel):
    name: str
    # image sẽ upload riêng, không cần ở đây

# Schema để trả về Author (Response)
class AuthorResponse(BaseModel):
    id: int
    name: str
    image: Optional[str] = None  # Đường dẫn ảnh (có thể null)
    
    class Config:
        from_attributes = True

# Schema Author với danh sách Posts
class AuthorWithPosts(AuthorResponse):
    posts: List["PostResponse"] = []  # Danh sách bài viết


# ========================================
# SCHEMAS CHO POST
# ========================================

# Schema để tạo Post (Request Body)
class PostCreate(BaseModel):
    title: str
    numberofpage: int
    content: str
    price: float
    author_id: Optional[int] = None  # ID của tác giả (có thể null)

# Schema để trả về Post (Response)
class PostResponse(BaseModel):
    id: int
    title: str
    numberofpage: int
    content: str
    price: float
    author_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# Schema Post với thông tin Author
class PostWithAuthor(PostResponse):
    author: Optional[AuthorResponse] = None  # Thông tin tác giả