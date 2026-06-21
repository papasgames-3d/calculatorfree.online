# 🧮 Hướng Dẫn Cập Nhật Header & Footer - Calculator Website

## 📋 Tổng Quan
Hướng dẫn này giúp bạn duy trì tính nhất quán cho header và footer trên tất cả các trang calculator.

## 🎯 Cấu Trúc Header Chuẩn

### HTML Template:
```html
<header class="header">
    <div class="container">
        <div class="logo">
            <i class="fas fa-calculator"></i>
            <span>Calculator Tools</span>
        </div>
        <nav class="nav-menu">
            <a href="index.html" class="nav-link">Home</a>
            <a href="#financial" class="nav-link">Financial</a>
            <a href="#health" class="nav-link active">Health & Fitness</a>
            <a href="#math" class="nav-link">Math</a>
            <a href="#time" class="nav-link">Time & Date</a>
            <a href="#other" class="nav-link">Other Tools</a>
        </nav>
        <div class="mobile-menu-toggle">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</header>
```

**Lưu ý:** Thay đổi class `active` theo trang hiện tại:
- Financial calculators: `#financial` có class `active`
- Health calculators: `#health` có class `active`
- Math calculators: `#math` có class `active`
- Time tools: `#time` có class `active`
- Other tools: `#other` có class `active`

## 🦶 Cấu Trúc Footer Chuẩn

### HTML Template:
```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h4>Financial Calculators</h4>
                <ul>
                    <li><a href="finance-calculator.html">Finance Calculator</a></li>
                    <li><a href="mortgage-calculator.html">Mortgage Calculator</a></li>
                    <li><a href="loan-calculator.html">Loan Calculator</a></li>
                    <li><a href="compound-interest-calculator.html">Compound Interest Calculator</a></li>
                    <li><a href="investment-calculator.html">Investment Calculator</a></li>
                    <li><a href="retirement-calculator.html">Retirement Calculator</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Health & Fitness</h4>
                <ul>
                    <li><a href="bmi-calculator.html">BMI Calculator</a></li>
                    <li><a href="calorie-calculator.html">Calorie Calculator</a></li>
                    <li><a href="body-fat-calculator.html">Body Fat Calculator</a></li>
                    <li><a href="bmr-calculator.html">BMR Calculator</a></li>
                    <li><a href="pregnancy-calculator.html">Pregnancy Calculator</a></li>
                    <li><a href="target-heart-rate-calculator.html">Target Heart Rate Calculator</a></li>
                    <li><a href="pregnancy-weight-gain-calculator.html">Pregnancy Weight Gain Calculator</a></li>
                    <li><a href="protein-calculator.html">Protein Calculator</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Math Calculators</h4>
                <ul>
                    <li><a href="scientific-calculator.html">Scientific Calculator</a></li>
                    <li><a href="quadratic-formula-calculator.html">Quadratic Formula Calculator</a></li>
                    <li><a href="standard-deviation-calculator.html">Standard Deviation Calculator</a></li>
                    <li><a href="fraction-calculator.html">Fraction Calculator</a></li>
                    <li><a href="percentage-calculator.html">Percentage Calculator</a></li>
                    <li><a href="triangle-calculator.html">Triangle Calculator</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Other Tools</h4>
                <ul>
                    <li><a href="conversion-calculator.html">Conversion Calculator</a></li>
                    <li><a href="ip-subnet-calculator.html">IP Subnet Calculator</a></li>
                    <li><a href="age-calculator.html">Age Calculator</a></li>
                    <li><a href="password-generator.html">Password Generator</a></li>
                    <li><a href="unit-converter.html">Unit Converter</a></li>
                    <li><a href="tip-calculator.html">Tip Calculator</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2024 Calculator Tools. All rights reserved.</p>
        </div>
    </div>
</footer>
```

## 🔗 CSS Links Bắt Buộc

### Trong `<head>` section:
```html
<link rel="stylesheet" href="assets/css/styles.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

## 📚 Quy Trình Cập Nhật

### 🆕 Khi Thêm Calculator Mới:

#### Bước 1: Tạo file calculator với cấu trúc đúng
- Copy template header & footer từ hướng dẫn này
- Đặt class `active` cho navigation phù hợp

#### Bước 2: Cập nhật sitemap.html
```html
<!-- Tìm section category tương ứng và thêm -->
<div class="calculator-item">
    <a href="ten-calculator-moi.html" class="calculator-link available">Tên Calculator Mới</a>
    <span class="status-badge available-badge">Available</span>
</div>
```

#### Bước 3: Cập nhật index.html
```html
<!-- Thêm vào danh sách category tương ứng -->
<li><a href="ten-calculator-moi.html">Tên Calculator Mới</a></li>
```

#### Bước 4: Cập nhật footer trên TẤT CẢ các trang
- Thêm link calculator mới vào footer section phù hợp
- Cập nhật trên tất cả .html files

### 🔄 Khi Thay Đổi Header/Footer Toàn Bộ:

#### Bước 1: Backup
```bash
# Tạo backup trước khi thay đổi
cp -r calculator2 calculator2_backup
```

#### Bước 2: Tìm tất cả files cần cập nhật
```bash
# Liệt kê tất cả file HTML
ls *.html
```

#### Bước 3: Sử dụng Find & Replace (Ctrl+H trong VS Code)
1. Mở VS Code
2. Nhấn `Ctrl+Shift+H` (Replace in Files)
3. Tìm HTML cũ
4. Thay bằng HTML mới
5. Chọn `*.html` để thay trong tất cả files
6. Nhấn "Replace All"

#### Bước 4: Kiểm tra thủ công
- Mở 3-5 trang ngẫu nhiên
- Xác nhận header/footer hiển thị đúng
- Test responsive trên mobile

## 🎨 Mapping Navigation Class "Active"

| Loại Calculator | Class Active | Examples |
|-----------------|-------------|----------|
| Financial | `#financial` | mortgage, loan, investment |
| Health & Fitness | `#health` | BMI, calorie, pregnancy |
| Math | `#math` | scientific, fraction, percentage |
| Time & Date | `#time` | timer, stopwatch, calendar |
| Other Tools | `#other` | unit converter, IP subnet, age |

## 🛠️ Troubleshooting

### ❌ Vấn đề thường gặp:

1. **Header không hiển thị đúng:**
   - Kiểm tra CSS links trong `<head>`
   - Đảm bảo có Font Awesome và Google Fonts
   - Xác nhận cấu trúc HTML đúng classes

2. **Footer bị lệch:**
   - Kiểm tra cấu trúc `footer-content` và `footer-section`
   - Đảm bảo có đủ 4 cột
   - Xác nhận `footer-bottom` nằm ngoài `footer-content`

3. **Mobile menu không hoạt động:**
   - Kiểm tra có `mobile-menu-toggle` div
   - Xác nhận JavaScript được load
   - Test trên thiết bị mobile thực tế

### ✅ Solutions:

1. **So sánh với index.html** (file chuẩn)
2. **Copy exact HTML structure** từ hướng dẫn này
3. **Validate HTML** bằng W3C validator
4. **Clear browser cache** và test lại

## 📝 Checklist Cập Nhật

### ✅ Khi thêm calculator mới:
- [ ] Tạo file .html mới với header/footer template
- [ ] Thêm link vào sitemap.html
- [ ] Thêm link vào index.html category
- [ ] Cập nhật footer trên ALL trang
- [ ] Test links hoạt động
- [ ] Test responsive design
- [ ] Validate HTML

### ✅ Khi sửa header/footer globally:
- [ ] Backup toàn bộ project
- [ ] Cập nhật template trong guide này
- [ ] Find & Replace trên ALL files .html
- [ ] Kiểm tra 5+ trang random
- [ ] Test cross-browser (Chrome, Firefox, Safari)
- [ ] Test mobile responsive
- [ ] Commit to git/version control

## 🚀 Tips & Best Practices

1. **Luôn luôn backup** trước khi thay đổi hàng loạt
2. **Test trên mobile** sau mỗi thay đổi
3. **Sử dụng VS Code Find & Replace** cho efficiency
4. **Keep footer links updated** khi thêm calculator mới
5. **Maintain consistent naming** cho files và links
6. **Validate HTML structure** định kỳ
7. **Monitor page load speed** sau khi thêm CSS/JS

## 📁 Files Quan Trọng Cần Cập Nhật

### Luôn cập nhật khi có thay đổi:
1. `index.html` - Trang chủ
2. `sitemap.html` - Danh sách tất cả calculators
3. Tất cả calculator files (*.html)

### Kiểm tra định kỳ:
1. `styles.css` - CSS chính
2. `script.js` - JavaScript chung
3. `manifest.json` - PWA config

## 🔍 Testing Checklist

### 📱 Responsive Test:
- [ ] Mobile (320px width)
- [ ] Tablet (768px width)  
- [ ] Desktop (1200px+ width)
- [ ] Navigation collapse/expand
- [ ] Footer columns stack properly

### 🌐 Cross-Browser Test:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### 🔗 Link Validation:
- [ ] All header nav links work
- [ ] All footer links work
- [ ] No 404 errors
- [ ] External links open in new tab

---

**💡 Lưu ý cuối:** Hướng dẫn này cần được cập nhật mỗi khi có thay đổi lớn về cấu trúc website! 