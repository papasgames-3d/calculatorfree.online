// Mobile menu toggle functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    // Toggle menu khi click hamburger
    mobileMenuToggle.addEventListener('click', function() {
        // Show/hide menu với styling phù hợp
    });

    // Đóng menu khi click bên ngoài
    document.addEventListener('click', function(event) {
        if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.style.display = 'none';
        }
    });

    // Reset về desktop mode khi resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset tất cả styles
        }
    });
}