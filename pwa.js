// PWA installation + service worker + deferred Facebook comments loading
let deferredPrompt;
let installButton;

function createInstallButton() {
  if (document.getElementById('pwa-install-btn')) return;

  const installBtn = document.createElement('button');
  installBtn.id = 'pwa-install-btn';
  installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
  installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    font-size: 14px;
  `;

  installBtn.addEventListener('mouseenter', () => {
    installBtn.style.transform = 'translateY(-2px)';
    installBtn.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
  });

  installBtn.addEventListener('mouseleave', () => {
    installBtn.style.transform = 'translateY(0)';
    installBtn.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
  });

  installBtn.addEventListener('click', installPWA);
  document.body.appendChild(installBtn);
  installButton = installBtn;

  setTimeout(() => {
    if (installButton && installButton.parentNode) {
      installButton.style.opacity = '0.7';
    }
  }, 10000);
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  createInstallButton();
});

async function installPWA() {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('PWA installed');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  deferredPrompt = null;
}

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  if (installButton) {
    installButton.style.display = 'none';
  }
  deferredPrompt = null;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
      z-index: 1001;
      max-width: 300px;
      font-size: 14px;
    ">
      <strong>App Updated!</strong><br>
      New features available. Refresh to apply.
      <button onclick="window.location.reload()" style="
        background: white;
        color: #28a745;
        border: none;
        padding: 5px 15px;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
        font-weight: 600;
      ">Refresh</button>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 10000);
}

function showIOSInstallPrompt() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone;

  if (isIOS && !isStandalone) {
    const prompt = document.createElement('div');
    prompt.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #007bff;
        color: white;
        padding: 15px;
        text-align: center;
        z-index: 1000;
        font-size: 14px;
      ">
        <strong>Install CalculatorFree App</strong><br>
        Tap <i class="fas fa-share"></i> and then "Add to Home Screen"
        <button onclick="this.parentNode.parentNode.remove()" style="
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        ">&times;</button>
      </div>
    `;
    document.body.appendChild(prompt);

    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.remove();
      }
    }, 15000);
  }
}

setTimeout(showIOSInstallPrompt, 3000);

if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Running as PWA');
  document.body.classList.add('pwa-mode');
}

let commentsLoaded = false;

function loadFacebookSdk() {
  return new Promise(resolve => {
    if (window.FB) {
      resolve();
      return;
    }

    const existingSdk = document.getElementById('facebook-jssdk');
    if (existingSdk) {
      existingSdk.addEventListener('load', () => resolve(), { once: true });
      return;
    }

    const sdkScript = document.createElement('script');
    sdkScript.id = 'facebook-jssdk';
    sdkScript.async = true;
    sdkScript.defer = true;
    sdkScript.crossOrigin = 'anonymous';
    sdkScript.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v12.0&appId=2017521198991078';
    sdkScript.onload = () => resolve();
    document.body.appendChild(sdkScript);
  });
}

async function loadFacebookComments() {
  if (commentsLoaded) return;
  commentsLoaded = true;

  const loadButton = document.getElementById('load-comments-btn');
  const commentsBox = document.getElementById('fbComments');

  if (loadButton) {
    loadButton.disabled = true;
    loadButton.textContent = 'Loading comments...';
  }

  try {
    await loadFacebookSdk();
    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse();
    }
    if (commentsBox) {
      commentsBox.classList.remove('fb-comments-pending');
    }
    if (loadButton) {
      loadButton.remove();
    }
  } catch (error) {
    commentsLoaded = false;
    if (loadButton) {
      loadButton.disabled = false;
      loadButton.textContent = 'Retry loading comments';
    }
    console.log('Failed to load Facebook comments:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const commentsSection = document.getElementById('commentsSection');
  const loadButton = document.getElementById('load-comments-btn');

  if (loadButton) {
    loadButton.addEventListener('click', loadFacebookComments);
  }

  if (commentsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadFacebookComments();
          obs.disconnect();
        }
      });
    }, { rootMargin: '250px 0px' });

    observer.observe(commentsSection);
  }
});
