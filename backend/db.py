from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from fastapi import Depends

# Cấu hình Kết nối MySQL Bất đồng bộ (Async)
ASYNC_DATABASE_URL = "mysql+aiomysql://root:@localhost:3306/fastapi_db"

# Lớp Cơ sở (Base Class)
class Base(DeclarativeBase):
    pass

# Khởi tạo Async Engine
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True, 
    pool_pre_ping=True
)
# Giải thích: Tạo "động cơ" kết nối database
# echo=True: Hiển thị tất cả câu lệnh SQL trong console (hữu ích khi học)
# pool_pre_ping=True: Kiểm tra xem kết nối còn "sống" không trước khi dùng
# Ví dụ thực tế: Giống như động cơ xe hơi - khởi động một lần, dùng nhiều lần


# Tạo Async Session Maker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)
# Giải thích: Công cụ tạo "phiên làm việc" với database
# bind=engine: Gắn với engine đã tạo ở trên
# class_=AsyncSession: Kiểu session (bất đồng bộ)
# expire_on_commit=False: Dữ liệu không bị "hết hạn" sau khi commit
# Ví dụ thực tế: Giống như "phiếu ra vào" siêu thị - mỗi lần vào cần 1 phiếu mới


# Hàm khởi tạo Database và Bảng
async def create_db_and_tables():
    """Tạo tất cả các bảng (tables) nếu chưa tồn tại"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
# Giải thích: Hàm tạo bảng trong database
# async with engine.begin(): Mở kết nối
# conn.run_sync(Base.metadata.create_all): Tạo tất cả bảng từ các models
# Ví dụ thực tế: Giống như xây dựng các căn phòng trong ngôi nhà (database) lần đầu


# Dependency Injection cho Session
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """Cung cấp Async Session cho mỗi request API"""
    async with AsyncSessionLocal() as session:
        yield session
# Giải thích: Hàm cung cấp session cho mỗi API request
# yield session: Trả về session, sau khi dùng xong sẽ tự động đóng
# AsyncGenerator: Hàm generator (tạo ra giá trị rồi tạm dừng)
# Ví dụ thực tế: Giống như thuê căn phòng khách sạn - vào dùng, ra trả chìa khóa