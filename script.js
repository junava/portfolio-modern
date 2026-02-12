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

/* -- Event Listeners -- */
window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);

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

// ---------- CALCULATOR  ----------
(function() {
  'use strict';

  const toggle = document.getElementById('calcToggle');
  const modal = document.getElementById('calculatorModal');
  const closeBtn = document.getElementById('calcClose');
  const display = document.getElementById('calcDisplay');
  const preview = document.getElementById('calcPreview');
  const buttons = document.querySelectorAll('.calc-btn');

  if (!toggle || !modal || !closeBtn || !display || !preview) return;

  // State
  let currentInput = '0';
  let previousInput = '';
  let operator = null;
  let resetDisplay = false;
  let expression = ''; // for preview

  // Toggle modal
  toggle.addEventListener('click', () => {
    modal.classList.toggle('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Click outside to close
  window.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !toggle.contains(e.target) && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });

  // --- UI Update ---
  function updateDisplay(value) {
    display.innerText = value;
  }

  function updatePreview() {
    if (operator && previousInput !== '') {
      // Show: "12 + 7" style
      preview.innerText = `${previousInput} ${operator} ${currentInput}`;
    } else {
      preview.innerText = ''; // empty when no pending operation
    }
  }

  // --- Number Input ---
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

  // --- Decimal Point ---
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

  // --- Operator ---
  function setOperator(op) {
    if (operator !== null && !resetDisplay) {
      calculate(); // perform pending operation first
    }
    previousInput = currentInput;
    operator = op;
    resetDisplay = true;
    updatePreview();
  }

  // --- Calculation ---
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
    
    // Format result
    if (typeof result === 'number') {
      result = parseFloat(result.toFixed(8)).toString();
    }
    
    // Store full expression for preview before clearing
    const fullExpression = `${previousInput} ${operator} ${currentInput} =`;
    
    // Update state
    currentInput = result.toString();
    previousInput = '';
    operator = null;
    resetDisplay = true;
    
    updateDisplay(currentInput);
    
    // Show completed operation in preview, then clear after 2 seconds
    preview.innerText = `${fullExpression} ${currentInput}`;
    setTimeout(() => {
      if (operator === null && previousInput === '') {
        preview.innerText = '';
      }
    }, 2000);
  }

  // --- Clear Functions ---
  function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    resetDisplay = false;
    expression = '';
    updateDisplay(currentInput);
    preview.innerText = '';
  }

  function clearEntry() {
    currentInput = '0';
    updateDisplay(currentInput);
    updatePreview();
  }

  // --- Button Event Listeners ---
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

  // --- Keyboard Support ---
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (!modal.classList.contains('active')) return; // only when visible
    
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