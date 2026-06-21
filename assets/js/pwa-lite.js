// Lightweight PWA registration for calculator subpages
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function (err) {
            console.log('SW registration failed:', err);
        });
    });
}
