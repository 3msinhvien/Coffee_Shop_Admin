# Coffee_Shop_Admin
FE cho BTL python
Cách cài đặt:
- Bước 1: Tạo dự án Next.js mới: npx create-next-app coffee-shop-admin
Khi được hỏi các tuỳ chọn, chọn như sau:
    TypeScript: Yes
    ESLint: Yes
    Tailwind CSS: Yes
    App Router: Yes
    Import alias: Yes (mặc định là @/*)
- Bước 2: Di chuyển vào thư mục dự án: cd coffee-shop-admin
- Bước 3: Cài đặt các thư viện cần thiết: npm install lucide-react recharts date-fns next-themes
- Bước 4: Cài đặt shadcn/ui: npx shadcn@latest init  (khi được hỏi các tuỳ chọn, có thể chọn theo sở thích)
- Bước 5: Cài đặt các components shadcn/ui cần thiết:
npx shadcn@latest add button card form input label select textarea toast dialog dropdown-menu badge table alert-dialog sheet scroll-area separator popover switch tabs
- Bước 6: Sao chép mã nguồn: Tải mã nguồn dự án này về dưới dạng file zip, sau đó copy tất cả các file vào thư mục dự án đã tạo, nếu trùng thì replace luôn file gốc của dự án Next.js tự tạo.
- Cần đảm bảo đã có các thư mục:
- `app`
`app/(auth)`
`app/(dashboard)`
`components`
`components/dashboard`
`components/products`
`components/categories`
`components/orders`
`components/users`
`lib`
`types`
- Bước 7: Chạy dự án: npm run dev
  Sau khi chạy, mở trình duyệt và truy cập địa chỉ http://localhost:3000
   Nếu dự án bị lỗi, hạ cấp phiên bản React: npm install react@18.2.0 react-dom@18.2.0 --save
