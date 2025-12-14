from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select, update
from sqlalchemy.orm import selectinload
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pathlib import Path
import shutil
import uuid

from db import get_async_session, create_db_and_tables, engine
from model import Post, Author
from schemas import (
    PostCreate, PostResponse, PostWithAuthor,
    AuthorCreate, AuthorResponse, AuthorWithPosts
)

# ========== TẠO THƯ MỤC UPLOADS ==========
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)  # Tạo thư mục nếu chưa có

# ========== LIFESPAN ==========
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Khởi động FastAPI...")
    await create_db_and_tables()
    print("✅ Database đã sẵn sàng!")
    yield
    print("🛑 Đang tắt FastAPI...")
    await engine.dispose()
    print("✅ Đã đóng database!")

# ========== APP ==========
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL của Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Mount thư mục uploads để truy cập ảnh qua URL
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ==========================================
# ENDPOINTS CHO AUTHOR
# ==========================================

# 1. TẠO AUTHOR (không có ảnh)
@app.post("/authors/", response_model=AuthorResponse)
async def create_author(
    author: AuthorCreate,
    session: AsyncSession = Depends(get_async_session)
):
    """Tạo tác giả mới (chưa có ảnh)"""
    stmt = insert(Author).values(name=author.name)
    result = await session.execute(stmt)
    await session.commit()
    
    new_id = result.inserted_primary_key[0]
    return AuthorResponse(id=new_id, name=author.name, image=None)


# 2. UPLOAD ẢNH CHO AUTHOR
@app.post("/authors/{author_id}/upload-image/")
async def upload_author_image(
    author_id: int,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_async_session)
):
    """Upload ảnh cho tác giả"""
    
    # Kiểm tra Author có tồn tại không
    stmt = select(Author).where(Author.id == author_id)
    result = await session.execute(stmt)
    author = result.scalar_one_or_none()
    
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    # Kiểm tra file có phải ảnh không
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Tạo tên file unique (tránh trùng)
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Lưu file vào thư mục uploads
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Cập nhật đường dẫn ảnh vào database
    image_url = f"/uploads/{unique_filename}"
    stmt = update(Author).where(Author.id == author_id).values(image=image_url)
    await session.execute(stmt)
    await session.commit()
    
    return {
        "message": "Image uploaded successfully",
        "image_url": image_url
    }


# 3. LẤY TẤT CẢ AUTHORS
@app.get("/authors/", response_model=list[AuthorResponse])
async def get_all_authors(session: AsyncSession = Depends(get_async_session)):
    """Lấy danh sách tất cả tác giả"""
    stmt = select(Author)
    result = await session.execute(stmt)
    authors = result.scalars().all()
    return authors


# 4. LẤY AUTHOR THEO ID (kèm danh sách Posts)
@app.get("/authors/{author_id}", response_model=AuthorWithPosts)
async def get_author_with_posts(
    author_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    """Lấy thông tin tác giả kèm danh sách bài viết"""
    stmt = select(Author).options(selectinload(Author.posts)).where(Author.id == author_id)
    result = await session.execute(stmt)
    author = result.scalar_one_or_none()
    
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    return author


# ==========================================
# ENDPOINTS CHO POST
# ==========================================

# 5. TẠO POST
@app.post("/posts/", response_model=PostResponse)
async def create_post(
    post: PostCreate,
    session: AsyncSession = Depends(get_async_session)
):
    """Tạo bài viết mới"""
    new_post_data = post.model_dump()
    stmt = insert(Post).values(**new_post_data)
    result = await session.execute(stmt)
    await session.commit()
    
    new_id = result.inserted_primary_key[0]
    return PostResponse(id=new_id, **new_post_data)


# 6. LẤY TẤT CẢ POSTS (kèm thông tin Author)
@app.get("/posts/", response_model=list[PostWithAuthor])
async def get_all_posts(session: AsyncSession = Depends(get_async_session)):
    """Lấy danh sách tất cả bài viết kèm thông tin tác giả"""
    stmt = select(Post).options(selectinload(Post.author))
    result = await session.execute(stmt)
    posts = result.scalars().all()
    return posts


# 7. LẤY POST THEO ID
@app.get("/posts/{post_id}", response_model=PostWithAuthor)
async def get_post(
    post_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    """Lấy bài viết theo ID kèm thông tin tác giả"""
    stmt = select(Post).options(selectinload(Post.author)).where(Post.id == post_id)
    result = await session.execute(stmt)
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return post


# ==========================================
# ENDPOINT TEST
# ==========================================

@app.get("/")
async def root():
    return {
        "message": "FastAPI with File Upload & Relationships",
        "endpoints": {
            "authors": "/authors/",
            "upload_image": "/authors/{author_id}/upload-image/",
            "posts": "/posts/"
        }
    }