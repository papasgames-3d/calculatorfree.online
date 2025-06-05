# 📁 Cấu Trúc Assets - Calculator Free Online

## 🎯 Mục tiêu
Tách CSS và JavaScript thành các file riêng biệt để:
- Tối ưu hiệu suất loading
- Dễ bảo trì và phát triển
- Tái sử dụng code hiệu quả
- Tối ưu SEO và cache

## 📂 Cấu Trúc Thư Mục

```
assets/
├── css/
│   ├── common.css          # CSS chung (header, footer, base styles)
│   ├── index.css           # CSS cho trang chủ (calculator + tools)
│   ├── lich-am.css         # CSS cho trang lịch âm
│   ├── age-calculator.css  # CSS cho máy tính tuổi
│   ├── date-calculator.css # CSS cho máy tính ngày tháng
│   └── ...                 # CSS cho các trang khác
├── js/
│   ├── common.js           # JavaScript chung (nếu cần)
│   ├── index.js            # JavaScript cho trang chủ
│   ├── lich-am.js          # JavaScript cho lịch âm
│   ├── age-calculator.js   # JavaScript cho máy tính tuổi
│   └── ...                 # JavaScript cho các trang khác
└── README.md               # File hướng dẫn này
```

## 🔗 Cách Sử Dụng

### 1. Trong HTML Header
```html
<!-- CSS Files - Luôn load common.css trước -->
<link rel="stylesheet" href="/assets/css/common.css">
<link rel="stylesheet" href="/assets/css/[page-name].css">
```

### 2. Trước closing body tag
```html
<!-- JavaScript Files -->
<script src="/assets/js/[page-name].js"></script>
</body>
```

## 📋 File CSS Chi Tiết

### `common.css` - Dùng Chung
- Reset CSS
- Base styles (body, container, typography)
- Header styles (language switch, navigation)
- Footer styles
- Utility classes (buttons, cards, grids)
- Responsive breakpoints chung

### `index.css` - Trang Chủ
- Calculator container và styles
- Calculator display và buttons
- Tools grid layout
- Tool cards
- Responsive cho calculator

### `lich-am.css` - Lịch Âm
- Calendar grid và navigation
- Day cells styling
- Lunar date display
- Zodiac information
- Holiday markers

## 🛠️ Template Tạo File Mới

### CSS Template
```css
/* ==============================================
   [PAGE NAME] STYLES - CHỈ DÀNH CHO TRANG [PAGE]
   ============================================== */

/* Page-specific variables */
:root {
    --page-color: #your-color;
}

/* Main content styles */
.page-container {
    /* styles */
}

/* Responsive styles */
@media (max-width: 768px) {
    /* mobile styles */
}
```

### JavaScript Template
```javascript
/* ==============================================
   [PAGE NAME] LOGIC - CHỈ DÀNH CHO TRANG [PAGE]
   ============================================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Page-specific initialization
}
```

## 🎨 CSS Variables Chung

Được định nghĩa trong `common.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-primary: #1a202c;
    --text-secondary: #4a5568;
    --shadow: 0 4px 12px rgba(0,0,0,0.15);
    --radius: 12px;
    --transition: 0.3s ease;
}
```

## 📱 Responsive Strategy

### Breakpoints Chuẩn
- Mobile: `max-width: 480px`
- Tablet: `max-width: 768px`
- Desktop: `min-width: 1024px`

### Mobile-First Approach
```css
/* Mobile styles first */
.element {
    /* mobile styles */
}

/* Then tablet and desktop */
@media (min-width: 768px) {
    .element {
        /* tablet+ styles */
    }
}
```

## 🚀 Performance Tips

1. **Critical CSS**: Inline critical styles nếu cần
2. **Preload**: Sử dụng `<link rel="preload">` cho fonts
3. **Minification**: Minify CSS/JS cho production
4. **Caching**: Set cache headers phù hợp
5. **CDN**: Sử dụng CDN cho external libraries

## 🔧 Maintenance Guidelines

1. **Naming Convention**: Sử dụng BEM methodology
2. **Comments**: Ghi chú rõ ràng cho complex styles
3. **Consistency**: Giữ consistent spacing và naming
4. **Testing**: Test trên multiple devices/browsers
5. **Documentation**: Update README khi thêm files mới

## 📝 Ví Dụ Thực Tế

### Trang Index
```html
<link rel="stylesheet" href="/assets/css/common.css">
<link rel="stylesheet" href="/assets/css/index.css">
<script src="/assets/js/index.js"></script>
```

### Trang Lịch Âm
```html
<link rel="stylesheet" href="/assets/css/common.css">
<link rel="stylesheet" href="/assets/css/lich-am.css">
<script src="/assets/js/lich-am.js"></script>
```

## 🎯 Next Steps

1. Tạo CSS/JS cho từng trang theo template
2. Test performance improvements
3. Implement build process để minify
4. Add more utility classes vào common.css
5. Create component-based CSS structure

---

**Cập nhật:** Đã hoàn thành tách CSS/JS cho trang chủ và lịch âm. Tiếp tục với các trang khác theo cùng pattern. 