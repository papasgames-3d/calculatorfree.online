# 🧮 Header & Footer Template - Calculator Website

## 📋 Overview
Hướng dẫn này giúp duy trì tính nhất quán cho header và footer trên tất cả các trang calculator.

## 🎯 Cấu trúc Header Chuẩn

### HTML Structure:
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

### Lưu ý Header:
- ✅ Class `header` cho container chính
- ✅ Class `container` cho wrapper
- ✅ Class `logo` với icon và text
- ✅ Class `nav-menu` cho navigation
- ✅ Class `nav-link` cho từng link, `active` cho trang hiện tại
- ✅ Class `mobile-menu-toggle` cho responsive menu

## 🦶 Cấu trúc Footer Chuẩn

### HTML Structure:
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

### Lưu ý Footer:
- ✅ Class `footer` cho container chính
- ✅ Class `container` cho wrapper
- ✅ Class `footer-content` cho nội dung chính
- ✅ Class `footer-section` cho từng cột
- ✅ Class `footer-bottom` cho copyright

## 🔗 CSS Links Bắt Buộc

### Trong `<head>` section:
```html
<link rel="stylesheet" href="assets/css/styles.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

## 📚 Quy Trình Cập Nhật

### 1. Khi Thêm Calculator Mới:

#### Bước 1: Cập nhật sitemap.html
```html
<!-- Thêm vào category tương ứng -->
<div class="calculator-item">
    <a href="ten-calculator-moi.html" class="calculator-link available">Tên Calculator Mới</a>
    <span class="status-badge available-badge">Available</span>
</div>
```

#### Bước 2: Cập nhật index.html
```html
<!-- Thêm vào category list tương ứng -->
<li><a href="ten-calculator-moi.html">Tên Calculator Mới</a></li>
```

#### Bước 3: Cập nhật footer trên TẤT CẢ các trang
- Thêm link mới vào section tương ứng trong footer
- Đảm bảo tất cả trang có footer giống nhau

### 2. Khi Thay Đổi Header/Footer:

#### Bước 1: Xác định trang cần cập nhật
```bash
# Tìm tất cả file HTML
find . -name "*.html" -type f
```

#### Bước 2: Sử dụng Find & Replace 
- Tìm: HTML cũ
- Thay thế: HTML mới
- Áp dụng cho TẤT CẢ files

#### Bước 3: Kiểm tra tính nhất quán
- Kiểm tra 3-5 trang ngẫu nhiên
- Xác nhận header/footer hiển thị đúng
- Test responsive trên mobile

## 🎨 CSS Classes Quan Trọng

### Header Classes:
- `.header` - Main header container
- `.container` - Content wrapper  
- `.logo` - Brand logo area
- `.nav-menu` - Navigation links
- `.nav-link` - Individual nav links
- `.nav-link.active` - Current page indicator
- `.mobile-menu-toggle` - Mobile hamburger menu

### Footer Classes:
- `.footer` - Main footer container
- `.footer-content` - Content grid wrapper
- `.footer-section` - Individual columns
- `.footer-bottom` - Copyright area

## 🔧 Tools & Automation

### Recommended Workflow:
1. **VS Code Extensions:**
   - "Find and Replace" (Ctrl+H)
   - "Multi-cursor editing"
   - "Live Server" for testing

2. **Search Patterns:**
   ```regex
   <!-- Tìm header cũ -->
   <header class="header">.*?</header>
   
   <!-- Tìm footer cũ -->
   <footer class="footer">.*?</footer>
   ```

3. **Validation:**
   - Check HTML validity
   - Test responsive design
   - Verify all links work

## 📝 Checklist Cập Nhật

### Khi thêm calculator mới:
- [ ] Tạo file calculator mới với template đúng
- [ ] Thêm vào sitemap.html
- [ ] Thêm vào index.html category
- [ ] Cập nhật footer trên TẤT CẢ trang
- [ ] Kiểm tra links hoạt động
- [ ] Test trên mobile

### Khi sửa header/footer:
- [ ] Backup files quan trọng
- [ ] Cập nhật template trong file này
- [ ] Áp dụng thay đổi cho TẤT CẢ trang
- [ ] Kiểm tra tính nhất quán
- [ ] Test cross-browser
- [ ] Commit changes to version control

## 🚀 Best Practices

1. **Consistency First:** Tất cả trang phải có cấu trúc giống hệt nhau
2. **Mobile Responsive:** Luôn test trên mobile
3. **SEO Friendly:** Sử dụng semantic HTML
4. **Performance:** Tối ưu CSS và font loading
5. **Accessibility:** Đảm bảo keyboard navigation
6. **Version Control:** Backup trước khi thay đổi lớn

## 📞 Liên Hệ Support

Nếu gặp vấn đề khi cập nhật header/footer, hãy:
1. Kiểm tra file này trước
2. So sánh với index.html (file chuẩn)
3. Validate HTML structure
4. Test responsive design 