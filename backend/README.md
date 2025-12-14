skip và limit (hoặc đôi khi là offset và limit) là cặp đôi không thể thiếu trong kỹ thuật phân trang (Pagination).
1. limit (hay size)
Ý nghĩa: Là số lượng bản ghi tối đa mà bạn muốn API trả về trong một lần gọi.

Vai trò: Kiểm soát kích thước của trang dữ liệu.

Ví dụ: limit=10 nghĩa là bạn muốn xem 10 sản phẩm.

2. skip (hay offset)
Ý nghĩa: Là số lượng bản ghi bạn muốn bỏ qua (hay nhảy qua) tính từ bản ghi đầu tiên trong toàn bộ tập dữ liệu.

Vai trò: Kiểm soát vị trí bắt đầu của trang dữ liệu.
Nếu bạn đặt skip=10: API sẽ bỏ qua 10 sản phẩm đầu tiên, và bắt đầu lấy từ sản phẩm thứ 11. (Trả về sản phẩm 11-20)

1. connection (Cơ bản):

Ý nghĩa: connection (Kết nối) là một kênh liên lạc tạm thời được thiết lập giữa ứng dụng Python (FastAPI của bạn) và hệ quản trị cơ sở dữ liệu (Database Management System - DBMS), ví dụ: PostgreSQL, MySQL, SQLite, v.v.

Vai trò: Kết nối này cho phép ứng dụng của bạn gửi các lệnh SQL (như SELECT, INSERT, UPDATE) và nhận dữ liệu phản hồi.

Tưởng tượng: Nó giống như một chiếc ống dẫn nước giữa vòi nước (ứng dụng của bạn) và bể nước (Database).

2. Base (SQLAlchemy Specific):

Trong ngữ cảnh của SQLAlchemy ORM (công cụ thường dùng nhất với FastAPI), đối tượng Base được import từ module connection.py thường đại diện cho Lớp cơ sở khai báo (Declarative Base Class).