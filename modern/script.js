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
  // This equals the total track width minus one image width.
  const traversableDist = totalWidth - imageWidth;
  
  // Current shift + Initial offset to center the first image relative to track container
  // Since track left:50%, we offset by half an image width to center the first image.
  const currentPosPx = (nextPercentage / 100) * traversableDist;
  const initialOffset = -(imageWidth / 2);
  const finalTransform = currentPosPx + initialOffset;

  // 5. Animate Track
  track.animate({
    transform: `translate(${finalTransform}px, -50%)`
  }, { duration: 1200, fill: "forwards" });
  
  // 6. Animate Parallax for each image
  for(const image of images) {
    // Relative position logic based on viewport center
    // Note: We use the anticipated position for smoother parallax during drag, 
    // or the current DOM rect which might lag slightly behind the physics animation (creating a sway effect).
    // Using the current DOM rect as requested:
    
    const box = image.getBoundingClientRect();
    const centerOfImage = box.left + (box.width / 2);
    const centerOfViewport = window.innerWidth / 2;
    const distFromCenter = centerOfImage - centerOfViewport;
    
    // Normalize distance to viewport width
    // Constraint: Center = 50%, Left -> 100%, Right -> 0%
    // Formula matches: 50 + (dist / range * -100)
    // If dist is negative (left), result adds to 50 (trends to 100).
    
    let percentX = 50 + (distFromCenter / window.innerWidth) * -100;
    
    // Clamp values
    percentX = Math.max(0, Math.min(100, percentX));

    image.animate({
      objectPosition: `${percentX}% 50%`
    }, { duration: 1200, fill: "forwards" });
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
handleOnMove({ clientX: 0 }); // Prevents jump on first click