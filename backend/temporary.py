from  fastapi import  FastAPI,HTTPException, Request, Depends
from typing import Optional, List, Dict
from  data import text_post
from schemas import BookPost, OutputPost

app = FastAPI()
# --- Endpoint GET /filtered-list/ (Sử dụng Request) ---
@app.get("/filtered-list/")
def read_list(request: Request):

    # Lấy toàn bộ query dưới dạng dictionary
    queries = dict(request.query_params)

    # Nếu không có query thì trả về "Hello, World!"
    if not queries:
        return {"message": "Hello, World!"}
    
    # Tạo danh sách các phần tử message
    messages = [f"{key}: {value}" for key, value in queries.items()]

    return {"message": "; ".join(messages)}
   
      

# --- Endpoint GET /posts/ (Lọc, Query Params) ---
@app.get("/posts/")
def get_all_posts(numberofpage:Optional[int]=None, price:Optional[float] = None,limit: Optional[int]=None):

    # 1. Lấy tất cả bài viết dưới dạng list các dictionary
    filtered_posts = list(text_post.values())
     
    # 2. Lọc theo numberofpage (ví dụ : chỉ lấy các bài có số trang >= giá trị truyền vào)
    if numberofpage is not None:
        filtered_posts = [post for post in filtered_posts if post["numberofpage"] >= numberofpage]
    
    # 3. Lọc theo price (ví dụ : chỉ lấy các bài có giá <= giá trị truyền vào)
    if price is not None:
        filtered_posts = [post for post in filtered_posts if post["price"] >= price]
    
    # 4. Giới hạn số lượng bài viết trả về (limit)
    if limit is not None:
        filtered_posts = filtered_posts[:limit]
    return filtered_posts
    

# --- Endpoint GET /posts/{post_id} (Path Params) ---
@app.get("/posts/{post_id}",response_model=OutputPost)
def get_post(post_id: int):
    if post_id not in text_post:
        raise HTTPException(status_code=404, detail="Product not found")   # dùng để báo cáo lỗi 
    return text_post[post_id]


# --- Endpoint POST /posts (Request Body) ---
@app.post("/posts")
def create_post(post: BookPost)->OutputPost:
    
    # 1. TÌM ID MỚI: Lấy ID lớn nhất hiện có và tăng thêm 1
    # SỬA LỖI: Cần list() để max() hoạt động trên dict_keys và dùng keys()
    if text_post:
        new_id = max(list(text_post.keys())) + 1
    else:
        new_id = 1 

    # 2. CHUẨN BỊ DỮ LIỆU: Chuyển Pydantic Model sang dictionary
    # model_dump() lấy TẤT CẢ dữ liệu mà client gửi lên
    new_post = post.model_dump()
    new_post["id"] = new_id

    # 3. LƯU VÀO DATABASE GIẢ LẬP
    text_post[new_id] = new_post

    # 4. TRẢ VỀ: Trả về bài viết vừa tạo
    return text_post[new_id]


@app.delete("/posts/{post_id}")
def delete_post(post_id:int):
    if post_id not in text_post:
        raise HTTPException(status_code=404,detail="post not found")
    del text_post[post_id]
    return {"message": "post deleted successfully"}