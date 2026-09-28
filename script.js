/* ============================================
   FOR ANUSHKA — SPA Router + Interactions
   ============================================ */

// =============================================
// 1. SPA ROUTER
// =============================================
let currentPage = 'home';
const darkPages = ['quotes']; // pages that need dark navbar

function navigateTo(pageName) {
  if (currentPage === pageName) return;

  const oldPage = document.getElementById('page-' + currentPage);
  const newPage = document.getElementById('page-' + pageName);
  if (!newPage) return;

  // Fade out old page
  if (oldPage) {
    oldPage.classList.remove('visible');
    setTimeout(() => {
      oldPage.classList.remove('active');
    }, 300);
  }

  // Fade in new page
  setTimeout(() => {
    newPage.classList.add('active');
    // Small delay for the display:block to register before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newPage.classList.add('visible');
      });
    });
  }, 300);

  // Update navbar
  updateNavActive(pageName);
  updateNavTheme(pageName);

  // Reset No button position when navigating to chance page
  if (pageName === 'chance') {
    resetNoButton();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  currentPage = pageName;

  // Update URL hash
  history.pushState(null, '', '#' + pageName);
}

function navClick(event, pageName) {
  event.preventDefault();
  closeNav();
  navigateTo(pageName);
}

function updateNavActive(pageName) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    }
  });
}

function updateNavTheme(pageName) {
  const navbar = document.getElementById('navbar');
  if (darkPages.includes(pageName)) {
    navbar.classList.add('dark');
  } else {
    navbar.classList.remove('dark');
  }
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
  const hash = window.location.hash.substring(1) || 'home';
  navigateTo(hash);
});

// Initialize from URL hash on load
function initRouter() {
  const hash = window.location.hash.substring(1) || 'home';
  const page = document.getElementById('page-' + hash);
  if (page) {
    currentPage = hash;
    page.classList.add('active');
    requestAnimationFrame(() => {
      page.classList.add('visible');
    });
    updateNavActive(hash);
    updateNavTheme(hash);
  } else {
    // Default to home
    const homePage = document.getElementById('page-home');
    homePage.classList.add('active');
    requestAnimationFrame(() => {
      homePage.classList.add('visible');
    });
    updateNavActive('home');
  }
}


// =============================================
// 2. RESPONSE STORAGE
// =============================================
function sendEmail(subject, message) {
  const accessKey = "6af49cff-2d4f-4abf-b85a-960fddc63cba"; 
  if (accessKey !== "YOUR_ACCESS_KEY_HERE") {
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: subject,
        from_name: "Valentine App",
        message: message
      })
    })
    .then(response => console.log("Email sent successfully!"))
    .catch(error => console.error("Error sending email:", error));
  }
}

function beginJourney() {
  sendEmail("Journey Began 🚀", "She clicked the 'Begin the journey' button!");
  navigateTo('gallery');
}

function saveResponse(key, value) {
  // Save locally so UI state (like countdown) persists on refresh
  const responses = JSON.parse(localStorage.getItem('anushka-responses') || '{}');
  responses[key] = {
    value: value,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('anushka-responses', JSON.stringify(responses));
}

// Download local backup just in case
function downloadResponses() {
  const responses = JSON.parse(localStorage.getItem('anushka-responses') || '{}');
  let txt = '=== Responses from Anushka ===\nGenerated: ' + new Date().toLocaleString() + '\n\n';
  for (const [k, d] of Object.entries(responses)) {
    txt += `[${k}]\n  Response: ${d.value}\n  Time: ${d.timestamp}\n\n`;
  }
  const blob = new Blob([txt], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'responses.txt';
  a.click();
}

// Ctrl+Shift+D to download backup responses
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    downloadResponses();
  }
});


// =============================================
// 3. FLOATING PETALS
// =============================================
function createPetals() {
  const container = document.getElementById('petals');
  const petalTypes = ['🌸', '🩷', '✿', '❀', '💮'];

  for (let i = 0; i < 20; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = petalTypes[Math.floor(Math.random() * petalTypes.length)];
    petal.style.left = Math.random() * 100 + '%';
    petal.style.fontSize = (Math.random() * 12 + 10) + 'px';
    petal.style.animationDuration = (Math.random() * 10 + 12) + 's';
    petal.style.animationDelay = (Math.random() * 15) + 's';
    container.appendChild(petal);
  }
}


// =============================================
// 4. CURSOR SPARKLES
// =============================================
let sparkleThrottle = 0;
document.addEventListener('mousemove', (e) => {
  sparkleThrottle++;
  if (sparkleThrottle % 4 !== 0) return;

  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  const colors = ['#b76e79', '#d4a0a7', '#f7d1d5', '#d4a853', '#e8a5ad'];
  sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
  sparkle.style.left = e.clientX + 'px';
  sparkle.style.top = e.clientY + 'px';
  sparkle.style.setProperty('--dx', (Math.random() - 0.5) * 40 + 'px');
  sparkle.style.setProperty('--dy', (Math.random() - 0.5) * 40 + 'px');
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 800);
});


// =============================================
// 5. NAVBAR
// =============================================
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navToggle').classList.toggle('active');
}

function closeNav() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navToggle').classList.remove('active');
}


// =============================================
// 6. LIGHTBOX
// =============================================
function openLightbox(item) {
  const img = item.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = img.src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


// =============================================
// 7. YES / NO BUTTONS
// =============================================
let noButtonDodgeCount = 0;
let noBtnX = 0;
let noBtnY = 0;
let noBtnRotation = 0;

const noTexts = [
  'No',
  'Seriously? 😏',
  'Think again!',
  'You sure? 🤨',
  'Not happening!',
  'Nope, try Yes!',
  'Can\'t catch me!',
  'Just say Yes! 😄',
  'I\'m uncatchable!',
  'Give in already 💕',
  'Still trying? 😂',
  'You can\'t win this!',
  'Haha nice try 🫣',
  'I\'ll keep running!',
  'Accept it, say Yes!',
  'Ab toh haan bol do 🥺',
  'Kitna try karogi? 😄',
  'Main nahi rukunga!',
  'Yes is the way ➡️💕',
  'Okay last chance... YES!'
];

function resetNoButton() {
  const btn = document.getElementById('btnNo');
  if (btn) {
    btn.style.transform = '';
    btn.textContent = 'No';
    noButtonDodgeCount = 0;
    noBtnX = 0;
    noBtnY = 0;
    noBtnRotation = 0;

    const yesBtn = document.getElementById('btnYes');
    if (yesBtn) yesBtn.style.transform = '';
  }
}

function dodgeButton(btn) {
  noButtonDodgeCount++;

  // Generate a random dodge direction
  const angle = Math.random() * Math.PI * 2;
  const distance = 80 + Math.random() * 100; // Jump distance

  noBtnX += Math.cos(angle) * distance;
  noBtnY += Math.sin(angle) * distance;

  // Restrict movement to a bounding box around its original position
  // so it never goes too far down (behind footer) or off screen
  const maxOffsetX = window.innerWidth > 600 ? 250 : 100;
  const maxOffsetY = window.innerHeight > 600 ? 150 : 80;

  noBtnX = Math.max(-maxOffsetX, Math.min(maxOffsetX, noBtnX));
  noBtnY = Math.max(-maxOffsetY, Math.min(maxOffsetY, noBtnY));

  // If it hits the boundary, make it bounce back toward center next time
  if (Math.abs(noBtnX) >= maxOffsetX) noBtnX *= -0.5;
  if (Math.abs(noBtnY) >= maxOffsetY) noBtnY *= -0.5;

  // Apply smooth transform (NO rotation)
  btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s';
  btn.style.transform = `translate(${noBtnX}px, ${noBtnY}px)`;
  btn.style.zIndex = '100'; // Make sure it stays above footer/other elements
  btn.style.background = 'var(--cream)'; // Give it a solid background so it's readable if it overlaps things

  // Cycle through 20 quotes in circular manner
  const quoteIndex = noButtonDodgeCount % noTexts.length;
  btn.textContent = noTexts[quoteIndex];

  // Grow the Yes button slightly each time
  const yesBtn = document.getElementById('btnYes');
  const yesScale = 1 + (Math.min(noButtonDodgeCount, 15) * 0.03);
  yesBtn.style.transition = 'transform 0.4s ease';
  yesBtn.style.transform = `scale(${Math.min(yesScale, 1.4)})`;

  saveResponse('no-button-dodges', noButtonDodgeCount);
}

function handleNoClick() {
  dodgeButton(document.getElementById('btnNo'));

}

function handleYes() {
  saveResponse('one-more-chance', 'YES 💕');
  sendEmail("She clicked YES! 💖", "She clicked the YES button on the 'One More Chance' page!");

  document.getElementById('yesOverlay').classList.add('active');
  createHeartBurst();
  launchConfetti();
}

function closeYesOverlay() {
  const overlay = document.getElementById('yesOverlay');
  overlay.style.transition = 'opacity 0.6s ease';
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.classList.remove('active');
    overlay.style.opacity = '';
    overlay.style.transition = '';
    navigateTo('valentine');
  }, 600);
}

function createHeartBurst() {
  const hearts = ['❤️', '💕', '💖', '💗', '🌹', '✨', '🎉', '💝', '🩷'];
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart-burst';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.setProperty('--tx', (Math.random() - 0.5) * window.innerWidth + 'px');
    heart.style.setProperty('--ty', (Math.random() - 0.5) * window.innerHeight + 'px');
    heart.style.setProperty('--rot', (Math.random() * 360) + 'deg');
    heart.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}


// =============================================
// 8. CONFETTI
// =============================================
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = ['#b76e79', '#d4a0a7', '#f7d1d5', '#d4a853', '#e8a5ad', '#e8cc8a', '#ff69b4', '#ffd700'];

  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.1,
      drift: (Math.random() - 0.5) * 2
    });
  }

  let frames = 0;
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frames++;

    confetti.forEach(c => {
      c.y += c.speed;
      c.x += c.drift;
      c.angle += c.spin;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = Math.max(0, 1 - frames / 180);
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    });

    if (frames < 200) {
      requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animateConfetti();
}


// =============================================
// 9. VALENTINE DATE PICKER
// =============================================
let selectedDate = null;

function selectDate(element, date) {
  document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('selected'));
  element.classList.add('selected');
  selectedDate = date;
}

function confirmDate() {
  const timeSelect = document.getElementById('timeSelect');
  const time = timeSelect.value;

  if (!selectedDate) {
    shakeElement(document.getElementById('dateOptions'));
    return;
  }

  if (!time) {
    shakeElement(timeSelect);
    return;
  }

  const selectedOption = document.querySelector('.date-option.selected');
  const dayLabel = selectedOption.querySelector('.date-label').textContent;
  saveResponse('valentine-date', `${selectedDate} (${dayLabel})`);
  saveResponse('valentine-time', time);

  document.getElementById('datePickerCard').style.display = 'none';

  const countdownContainer = document.getElementById('countdownContainer');
  countdownContainer.classList.add('active');

  const dateObj = new Date(selectedDate);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('countdownDateDisplay').textContent =
    `${dateObj.toLocaleDateString('en-US', options)} at ${time} — Delhi, here we come! 🗺️`;

  createSmallHeartBurst();
  startCountdown(selectedDate, time);

  // Magic Email silently sent in the background using Web3Forms
  setTimeout(() => {
    sendEmail(
      "She said YES! ❤️ New Date Confirmed",
      `Hey! ❤️ I said YES!\n\nLet's meet on ${dayLabel}, ${dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} at ${time}.`
    );
  }, 1000);
}

function createSmallHeartBurst() {
  const hearts = ['🎉', '✨', '💕', '🌹'];
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart-burst';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = '50%';
    heart.style.top = '70%';
    heart.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
    heart.style.setProperty('--ty', (Math.random() - 0.8) * 400 + 'px');
    heart.style.setProperty('--rot', (Math.random() * 360) + 'deg');
    heart.style.animationDelay = (Math.random() * 0.3) + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}

function startCountdown(date, time) {
  const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hours = parseInt(timeParts[1]);
  const mins = parseInt(timeParts[2]);
  const ampm = timeParts[3].toUpperCase();

  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  const targetDate = new Date(date + 'T' + String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0') + ':00');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('countDays').textContent = '00';
      document.getElementById('countHours').textContent = '00';
      document.getElementById('countMinutes').textContent = '00';
      document.getElementById('countSeconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countDays').textContent = String(days).padStart(2, '0');
    document.getElementById('countHours').textContent = String(hrs).padStart(2, '0');
    document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.5s ease';
  setTimeout(() => el.style.animation = '', 500);
}

// Inject shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);


// =============================================
// 10. RESTORE STATE
// =============================================
function restoreState() {
  const responses = JSON.parse(localStorage.getItem('anushka-responses') || '{}');

  if (responses['valentine-date'] && responses['valentine-time']) {
    const dateVal = responses['valentine-date'].value;
    const timeVal = responses['valentine-time'].value;
    const dateMatch = dateVal.match(/\d{4}-\d{2}-\d{2}/);

    if (dateMatch) {
      document.getElementById('datePickerCard').style.display = 'none';
      const countdownContainer = document.getElementById('countdownContainer');
      countdownContainer.classList.add('active');

      const dateObj = new Date(dateMatch[0]);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('countdownDateDisplay').textContent =
        `${dateObj.toLocaleDateString('en-US', options)} at ${timeVal} — Delhi, here we come! 🗺️`;

      startCountdown(dateMatch[0], timeVal);
    }
  }
}


// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  initRouter();
  restoreState();
});

// =============================================
// 12. YOUTUBE VIDEO LIGHTBOX
// =============================================
function playVideo(videoId) {
  const lightbox = document.getElementById('videoLightbox');
  const player = document.getElementById('youtubePlayer');
  // Autoplay enabled
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  lightbox.classList.add('active');
}

function closeVideoLightbox(e) {
  // Close if they click the close button or the background (but not the video itself)
  if (!e || e.target.id === 'videoLightbox' || e.target.classList.contains('lightbox-close')) {
    const lightbox = document.getElementById('videoLightbox');
    const player = document.getElementById('youtubePlayer');
    lightbox.classList.remove('active');
    player.src = ''; // Stop the video
  }
}
