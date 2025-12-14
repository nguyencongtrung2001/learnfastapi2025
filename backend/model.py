from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from db import Base # Import Base từ db.py

class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer,primary_key = True,autoincrement=True)
    name = Column(String(100),nullable=False)
    image = Column(String(255),nullable=False)
    posts = relationship("Post",back_populates="author")


class Post(Base):
    __tablename__ = "posts"

    # Sử dụng Integer tự động tăng (auto-increment) làm Khóa Chính
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False) # Nên chỉ định độ dài cho String trong MySQL
    numberofpage = Column(Integer, nullable=False)
    content = Column(String(500), nullable=False)
    price = Column(Float, nullable=False)
    author_id = Column(Integer, ForeignKey("authors.id"), nullable=False)
    author = relationship("Author", back_populates="posts")

