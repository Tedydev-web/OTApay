### Flow lập trình chức năng logic: Quản lý hiển thị sidebar theo roles và permissions

**1. Xác định yêu cầu:**
- Sidebar hiển thị các tính năng dựa trên quyền của user (roles & permissions).
- Các tính năng được quản lý thông qua API `Feature`, `Feature permission`, và `Feature role`.
- Cần đảm bảo rằng user chỉ thấy các chức năng họ được phép truy cập.

---

**2. Các bước thực hiện:**

#### Bước 1: Xác định quyền của user
- **API sử dụng**:
  - `/user/get-user-by-token`: Lấy thông tin user hiện tại dựa trên access token.
  - `/permission/get-permissions-roles`: Lấy danh sách permissions liên quan đến role của user.

- **Logic**:
  - Khi user đăng nhập, frontend gọi API `/user/get-user-by-token` để lấy thông tin user, bao gồm `roleId`.
  - Sử dụng API `/permission/get-permissions-roles` với `roleId` để lấy danh sách các permission của user.

#### Bước 2: Lấy danh sách tính năng
- **API sử dụng**:
  - `/feature/get-features`: Lấy danh sách tất cả các features.
  - `/feature/get-feature-by-role/:id`: Lấy danh sách các features được phép dựa trên `roleId`.

- **Logic**:
  - Backend hoặc frontend sử dụng API `/feature/get-feature-by-role/:id` với `roleId` của user để lọc danh sách các features được hiển thị.

#### Bước 3: Kết nối features và permissions
- **API sử dụng**:
  - `/feature/get-permission-by-feature/:id`: Lấy danh sách các permissions liên quan đến một feature cụ thể.

- **Logic**:
  - Với mỗi feature, kiểm tra permissions bằng cách gọi API `/feature/get-permission-by-feature/:id`.
  - Đối chiếu danh sách permissions của user với permissions của feature để xác định quyền truy cập.

#### Bước 4: Hiển thị sidebar
- **Logic frontend**:
  - Chỉ hiển thị các features mà user có quyền truy cập.
  - Nếu cần, nhóm features theo category hoặc độ ưu tiên.

---

**3. Quy trình chi tiết sử dụng API:**

1. **Đăng nhập user**:
   - Gọi API `/user/get-user-by-token` để lấy thông tin user, bao gồm `roleId`.
   - Gọi API `/permission/get-permissions-roles` với `roleId` để lấy permissions.

2. **Lấy danh sách features**:
   - Gọi API `/feature/get-feature-by-role/:id` với `roleId` để lấy danh sách các features được phép.
   - Đối với từng feature, gọi `/feature/get-permission-by-feature/:id` để lấy thông tin permissions.

3. **Hiển thị sidebar**:
   - Render danh sách features được phép hiển thị.

---

**4. Các API liên quan và cách sử dụng:**

| **Chức năng**                  | **API sử dụng**                                        | **Tham số**                              |
|---------------------------------|-------------------------------------------------------|-------------------------------------------|
| Lấy thông tin user              | `/user/get-user-by-token`                             | Access token                              |
| Lấy roles và permissions        | `/permission/get-permissions-roles`                  | `roleId`, `offset`, `limit`, `status`     |
| Lấy danh sách features          | `/feature/get-feature-by-role/:id`                   | `roleId`                                  |
| Lấy permissions của feature     | `/feature/get-permission-by-feature/:id`             | `featureId`                               |
| Hiển thị features theo role     | `/feature/get-feature-by-role/:id`                   | `roleId`                                  |

---

**5. Gợi ý mở rộng:**
- **Caching**: Cache danh sách features và permissions để giảm tải API.
- **Dynamic updates**: Nếu role hoặc permission của user thay đổi, sidebar tự động cập nhật.
- **Logging**: Ghi log các lần truy cập vào API để phân tích hành vi user và phát hiện lỗi.
