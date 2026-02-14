// ---------- LOADING SCREEN — FULL SCREEN + TYPING ANIMATION ----------
(function() {
  'use strict';

  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');
  const loadingPercent = document.getElementById('loading-percent');
  const loadingStatus = document.getElementById('loading-status');
  
  // Typing targets
  const line1 = document.getElementById('typing-line-1');
  const line2 = document.getElementById('typing-line-2');
  const moduleEls = [
    document.getElementById('module-1'),
    document.getElementById('module-2'),
    document.getElementById('module-3'),
    document.getElementById('module-4'),
    document.getElementById('module-5')
  ];

  // Text to type
  const texts = {
    line1: '// SYSTEM BOOT',
    line2: 'PORTFOLIO v2.4.1',
    modules: [
      '⌘ core.init()',
      '⎔ calculator.js',
      '⌇ gallery.js',
      '◈ cursor.js',
      '⍟ scroll.js'
    ]
  };

  // Add loading class
  document.body.classList.add('loading');

 // ---------- TYPING ANIMATION ----------
async function typeText(element, text, speed = 25) {
  if (!element) return;
  element.textContent = '';
  element.style.visibility = 'visible';
  element.classList.add('typing');
  
  for (let i = 0; i <= text.length; i++) {
    element.textContent = text.substring(0, i);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  
  element.classList.remove('typing');
}

async function runTypingSequence() {
  // Type line 1 
  await typeText(line1, texts.line1, 20); 
  
  // Type line 2 
  await typeText(line2, texts.line2, 20); 
  
  // Type modules 
  for (let i = 0; i < moduleEls.length; i++) {
    await typeText(moduleEls[i], texts.modules[i], 20); 
    moduleEls[i]?.classList.remove('typing');
  }
}

  // Start typing sequence
  runTypingSequence();

  // ---------- PROGRESS BAR ----------
  let progress = 0;
  const totalTime = 2200; // slightly longer to accommodate typing
  const interval = 50;
  const steps = totalTime / interval;
  const increment = 100 / steps;

  // Module load thresholds (progress %)
  const moduleLoadTimes = [25, 45, 65, 80, 95];

  const timer = setInterval(() => {
    progress += increment;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      
      // Mark all modules as loaded
      moduleEls.forEach(module => {
        if (module) {
          module.classList.add('loaded');
          module.classList.remove('typing');
        }
      });
      
      // Update UI
      if (loadingStatus) loadingStatus.innerText = '[ READY ]';
      if (loadingPercent) loadingPercent.innerText = '100%';
      if (loadingBar) loadingBar.style.width = '100%';
      
      // Hide loading screen
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        
        setTimeout(() => {
          if (loadingScreen) loadingScreen.style.display = 'none';
        }, 800);
      }, 600);
      
      return;
    }
    
    // Update progress
    if (loadingBar) loadingBar.style.width = `${progress}%`;
    if (loadingPercent) loadingPercent.innerText = `${Math.floor(progress)}%`;
    
    // Mark modules as loaded based on progress
    if (progress >= moduleLoadTimes[0] && moduleEls[0] && !moduleEls[0].classList.contains('loaded')) {
      moduleEls[0].classList.add('loaded');
    }
    if (progress >= moduleLoadTimes[1] && moduleEls[1] && !moduleEls[1].classList.contains('loaded')) {
      moduleEls[1].classList.add('loaded');
    }
    if (progress >= moduleLoadTimes[2] && moduleEls[2] && !moduleEls[2].classList.contains('loaded')) {
      moduleEls[2].classList.add('loaded');
    }
    if (progress >= moduleLoadTimes[3] && moduleEls[3] && !moduleEls[3].classList.contains('loaded')) {
      moduleEls[3].classList.add('loaded');
    }
    if (progress >= moduleLoadTimes[4] && moduleEls[4] && !moduleEls[4].classList.contains('loaded')) {
      moduleEls[4].classList.add('loaded');
    }
    
    // Update status text
    if (loadingStatus) {
      if (progress < 30) loadingStatus.innerText = '[ INIT ]';
      else if (progress < 60) loadingStatus.innerText = '[ LOADING ]';
      else if (progress < 90) loadingStatus.innerText = '[ RENDERING ]';
      else loadingStatus.innerText = '[ FINAL ]';
    }
    
  }, interval);

  // Fallback
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
      }
    }, 4000);
  });

})();

(function() {
  "use strict";

  // ---------- 1. MOUSE COORDINATES TRACKER ----------
  const mouseXSpan = document.getElementById('mouse-x');
  const mouseYSpan = document.getElementById('mouse-y');

  function updateMouseCoords(e) {
    const x = e.clientX.toFixed(1);
    const y = e.clientY.toFixed(1);
    if (mouseXSpan) mouseXSpan.innerText = x;
    if (mouseYSpan) mouseYSpan.innerText = y;
  }

  document.addEventListener('mousemove', updateMouseCoords);

  // initial values (0.0)
  if (mouseXSpan) mouseXSpan.innerText = '0.0';
  if (mouseYSpan) mouseYSpan.innerText = '0.0';

  // ---------- 2. SMOOTH SCROLL (LENIS) + GSAP SYNC ----------
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 0.7,
    infinite: false,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    normalizeWheel: true,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // ---------- 3. GSAP SCROLLTRIGGER SETUP ----------
  gsap.registerPlugin(ScrollTrigger);

  // Reveal animations for .reveal-line elements
  document.querySelectorAll('.reveal-lines').forEach((container) => {
    const lines = container.querySelectorAll('.reveal-line');
    if (lines.length) {
      gsap.fromTo(lines, 
        { 
          y: 40, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            once: false
          }
        }
      );
    }
  });

  // ---------- 4. MAGNETIC CURSOR - PLUS SIGN (INSTANT FOLLOW) ----------
const cursor = document.getElementById('cursor');
const magneticElements = document.querySelectorAll('a, button, .magnetic-target, .theme-btn, .contact-email, .project-row, .stat-item, .skill-cloud span, .ingredient-item, .project-header');

// INSTANT follow - exact mouse position, accounting for center offset
window.addEventListener('mousemove', (e) => {
  // brute force exact positioning
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursor.style.transform = 'translate(-50%, -50%)';
});

// Magnetic hover effect - scale plus sign only, NO position pull
magneticElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover');
    
    // Scale up and rotate the plus sign
    gsap.to(cursor.querySelector('span'), {
      scale: 1.4,
      rotation: 90,
      duration: 0.2,
      ease: 'power2.out'
    });
  });

  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
    
    // Reset to normal
    gsap.to(cursor.querySelector('span'), {
      scale: 1,
      rotation: 0,
      duration: 0.2,
      ease: 'power2.out'
    });
  });
});

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', () => {
  gsap.to(cursor, { opacity: 0, duration: 0.2 });
});

document.addEventListener('mouseenter', () => {
  gsap.to(cursor, { opacity: 1, duration: 0.2 });
});

// ---------- 5. SINGLE BUTTON THEME TOGGLE ----------
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// check localStorage or default to dark
const stored = localStorage.getItem('theme');
if (stored === 'light') {
  body.classList.remove('dark');
} else {
  body.classList.add('dark');
  localStorage.setItem('theme', 'dark');
}

function toggleTheme() {
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

  // ---------- 6. REFRESH SCROLLTRIGGER ----------
  ScrollTrigger.refresh();

})();

// ---------- GALLERY ----------
const track = document.getElementById("image-track");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
  // 1. Check if mouse is down
  if(track.dataset.mouseDownAt === "0") return;
  
  // 2. Calculate movement math
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
  const maxDelta = window.innerWidth / 2;
  const percentage = (mouseDelta / maxDelta) * -100;
  
  // 3. Accumulate and Clamp values (0 represents start, -100 represents end)
  let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
  nextPercentage = Math.min(nextPercentage, 0);
  nextPercentage = Math.max(nextPercentage, -100);
  
  track.dataset.percentage = nextPercentage;
  
  // 4. Calculate Track Translation to strictly center first/last images
  const images = track.getElementsByClassName("image");
  if(images.length === 0) return;
  
  const imageWidth = images[0].getBoundingClientRect().width;
  const totalWidth = track.scrollWidth;
  
  // Distance to travel: From center of 1st image to center of last image.
  const traversableDist = totalWidth - imageWidth;
  
  // Current shift + Initial offset to center the first image
  const currentPosPx = (nextPercentage / 100) * traversableDist;
  const initialOffset = -(imageWidth / 2);
  const finalTransform = currentPosPx + initialOffset;

  // ---------- FIX 1: INSTANT TRACK MOVEMENT ----------
  // Remove .animate() – use direct transform (0ms, no lag)
  track.style.transform = `translate(${finalTransform}px, -50%)`;
  
  // ---------- FIX 2: INSTANT PARALLAX ----------
  for(const image of images) {
    const box = image.getBoundingClientRect();
    const centerOfImage = box.left + (box.width / 2);
    const centerOfViewport = window.innerWidth / 2;
    const distFromCenter = centerOfImage - centerOfViewport;
    
    let percentX = 50 + (distFromCenter / window.innerWidth) * -100;
    percentX = Math.max(0, Math.min(100, percentX));

    // Remove .animate() – use direct objectPosition
    image.style.objectPosition = `${percentX}% 50%`;
  }
}
// Prevent native drag on all gallery images
document.querySelectorAll('#image-track .image').forEach(img => {
  img.addEventListener('dragstart', (e) => e.preventDefault());
});

/* -- Event Listeners -- */
window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);

track.addEventListener('mousedown', (e) => {
  e.preventDefault();
  document.body.classList.add('dragging');
  mouseDownAt = e.clientX;
  track.dataset.mouseDownAt = mouseDownAt;
  track.dataset.prevPercentage = track.dataset.percentage || "0";
});

track.addEventListener('touchstart', (e) => {
  e.preventDefault();
  document.body.classList.add('dragging');
  handleOnDown(e.touches[0]);
});

window.addEventListener('touchend', () => {
  document.body.classList.remove('dragging');
  handleOnUp();
});

window.addEventListener('mouseup', () => {
  document.body.classList.remove('dragging');
  mouseDownAt = 0;
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage || "0";
});

// Initial call to set positions correctly on load
handleOnMove({ clientX: 0 });

// ---------- GALLERY SCROLL REVEAL (GSAP) ----------
(function() {
  'use strict';

  const galleryReveal = document.getElementById('gallery-reveal');
  if (!galleryReveal) return;

  gsap.fromTo(galleryReveal, 
    {
      y: 40,
      opacity: 0,
      visibility: 'hidden'
    },
    {
      y: 0,
      opacity: 1,
      visibility: 'visible',
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: galleryReveal,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        once: false
      }
    }
  );

})();

// ---------- cALCULATOR ----------
(function() {
  'use strict';

  const display = document.getElementById('liveCalcDisplay');
  const preview = document.getElementById('liveCalcPreview');
  const buttons = document.querySelectorAll('.live-calc-btn');

  if (!display || !buttons.length) return;

  // State
  let currentInput = '0';
  let previousInput = '';
  let operator = null;
  let resetDisplay = false;

  // Update display
  function updateDisplay(value) {
    display.innerText = value;
  }

  function updatePreview() {
    if (operator && previousInput !== '') {
      preview.innerText = `${previousInput} ${operator} ${currentInput}`;
    } else {
      preview.innerText = '';
    }
  }

  // Number input
  function inputNumber(num) {
    if (resetDisplay) {
      currentInput = num;
      resetDisplay = false;
    } else {
      if (currentInput === '0' && num !== '.') {
        currentInput = num;
      } else {
        if (currentInput.replace('.','').length < 12) {
          currentInput += num;
        }
      }
    }
    updateDisplay(currentInput);
    updatePreview();
  }

  // Decimal point
  function inputDecimal() {
    if (!currentInput.includes('.')) {
      if (resetDisplay) {
        currentInput = '0.';
        resetDisplay = false;
      } else {
        currentInput += '.';
      }
      updateDisplay(currentInput);
      updatePreview();
    }
  }

  // Operator
  function setOperator(op) {
    if (operator !== null && !resetDisplay) {
      calculate();
    }
    previousInput = currentInput;
    operator = op;
    resetDisplay = true;
    updatePreview();
  }

  // Calculation
  function calculate() {
    if (operator === null || resetDisplay) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) return;
    
    switch (operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/': 
        if (curr === 0) {
          result = 'ERR:0';
        } else {
          result = prev / curr;
        }
        break;
      default: return;
    }
    
    if (typeof result === 'number') {
      result = parseFloat(result.toFixed(8)).toString();
    }
    
    const fullExpression = `${previousInput} ${operator} ${currentInput} =`;
    
    currentInput = result.toString();
    previousInput = '';
    operator = null;
    resetDisplay = true;
    
    updateDisplay(currentInput);
    
    preview.innerText = `${fullExpression} ${currentInput}`;
    setTimeout(() => {
      if (operator === null && previousInput === '') {
        preview.innerText = '';
      }
    }, 2000);
  }

  // Clear functions
  function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    resetDisplay = false;
    updateDisplay(currentInput);
    preview.innerText = '';
  }

  function clearEntry() {
    currentInput = '0';
    updateDisplay(currentInput);
    updatePreview();
  }

  // Button event listeners
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.dataset.value;
      
      if (!val) return;
      
      if (!isNaN(val) || val === '.') {
        if (val === '.') inputDecimal();
        else inputNumber(val);
      } else if (val === 'C') clearAll();
      else if (val === 'CE') clearEntry();
      else if (val === '=') calculate();
      else setOperator(val);
    });
  });

  // Keyboard support (only when projects section is in view)
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    const projectsSection = document.getElementById('projects-reveal');
    
    // only handle keyboard if projects section is visible
    if (!projectsSection) return;
    const rect = projectsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;
    
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      inputNumber(key);
    }
    if (key === '.') {
      e.preventDefault();
      inputDecimal();
    }
    if (key === '+') { e.preventDefault(); setOperator('+'); }
    if (key === '-') { e.preventDefault(); setOperator('-'); }
    if (key === '*') { e.preventDefault(); setOperator('*'); }
    if (key === '/') { e.preventDefault(); setOperator('/'); }
    if (key === '=' || key === 'Enter') {
      e.preventDefault();
      calculate();
    }
    if (key === 'Escape') {
      e.preventDefault();
      clearAll();
    }
    if (key === 'Delete' || key === 'Backspace') {
      e.preventDefault();
      clearEntry();
    }
  });

})();