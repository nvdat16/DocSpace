# Backend

Node.js + Express.js backend for DocSpace.

## Suggested structure

```text
backend/
├── src/
│   ├── config/          # Cấu hình app, database, env
│   ├── controllers/     # Controller chung
│   ├── middlewares/     # Auth, role, error handling, upload
│   ├── models/          # Schema / ORM models
│   ├── routes/          # Route tổng
│   ├── services/        # Business logic
│   ├── utils/            # Helpers dùng chung
│   ├── validations/     # Validate request
│   └── modules/
│       ├── auth/        # Đăng ký, đăng nhập, refresh token
│       ├── users/       # Người dùng, phân quyền, hồ sơ cá nhân
│       ├── documents/   # Upload, metadata, preview, versioning
│       ├── folders/     # Cây thư mục cha-con
│       ├── search/      # Tìm kiếm, lọc
│       ├── shares/      # Chia sẻ link, mật khẩu, thời hạn
│       ├── versions/    # Lịch sử phiên bản, khôi phục
│       └── trash/       # Xoá mềm, khôi phục, xoá vĩnh viễn
├── uploads/              # File upload tạm / lưu trữ
├── tests/                # Unit / integration tests
└── package.json
```

## Notes
- Tách theo module giúp dễ mở rộng theo từng chức năng.
- Nên bổ sung thêm `src/app.js` và `src/server.js` khi bắt đầu code.
