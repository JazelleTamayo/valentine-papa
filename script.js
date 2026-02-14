// Configuration for exactly 3 pictures
const TOTAL_PICTURES = 3;
let imagePaths = [];
let currentIndex = 0;

// DOM Elements
const flowerGarden = document.getElementById('flowerGarden');
const slideImg = document.getElementById('currentSlideImg');
const photoLabel = document.getElementById('photoLabel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotContainer = document.getElementById('dotContainer');

// Helper function for picture suffixes (1st, 2nd, 3rd)
function getPictureSuffix(num) {
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return num + "th";
}

// Load the 3 pictures
function loadPictures() {
    imagePaths = [];
    let extensions = ['.jpeg', '.jpg', '.png']; // Common image types
    
    // Try to load each of the 3 pictures
    for (let i = 1; i <= TOTAL_PICTURES; i++) {
        let suffix = getPictureSuffix(i);
        
        // Try different extensions
        for (let ext of extensions) {
            let path = `images/${suffix}pic${ext}`;
            let img = new Image();
            
            img.onload = function() {
                // Only add if not already added
                if (!imagePaths.includes(path)) {
                    imagePaths.push(path);
                    imagePaths.sort(); // Keep in order
                    
                    // If we've found all 3, initialize
                    if (imagePaths.length === TOTAL_PICTURES) {
                        initSlideshow();
                    }
                }
            };
            
            img.src = path;
        }
    }
    
    // Fallback - if after 1 second we have some but not all pictures
    setTimeout(function() {
        if (imagePaths.length > 0 && imagePaths.length < TOTAL_PICTURES) {
            console.log(`Found ${imagePaths.length} out of ${TOTAL_PICTURES} pictures`);
            initSlideshow();
        } else if (imagePaths.length === 0) {
            // No pictures found, use placeholder
            usePlaceholder();
        }
    }, 1000);
}

// Use placeholder if no pictures found
function usePlaceholder() {
    imagePaths = [];
    currentIndex = 0;
    renderDots(1);
    
    slideImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23fca5b6"/><text x="300" y="200" font-size="40" text-anchor="middle" fill="%23ffffff" font-family="Arial" dy=".3em">❤️ Papa ❤️</text><text x="300" y="260" font-size="24" text-anchor="middle" fill="%23ffe6f0">Shyne loves you</text></svg>';
    photoLabel.innerText = 'My Beautiful Papa ❤️';
}

// Update slide image, label, and active dot
function updateSlide(index) {
    if (imagePaths.length === 0) {
        return;
    }
    
    if (index < 0) index = imagePaths.length - 1;
    if (index >= imagePaths.length) index = 0;
    currentIndex = index;

    slideImg.src = imagePaths[currentIndex];
    
    let numberPart = (currentIndex + 1);
    let suffix = getPictureSuffix(numberPart);
    photoLabel.innerText = `Picture ${numberPart} ❤️`;

    // Update active dot
    let dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (i === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

// Generate dots
function renderDots(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        let activeClass = (i === currentIndex) ? 'active' : '';
        html += `<span class="dot ${activeClass}" data-index="${i}"></span>`;
    }
    dotContainer.innerHTML = html;
    
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', function(e) {
            let index = parseInt(this.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
                currentIndex = index;
                updateSlide(currentIndex);
            }
        });
    });
}

// Initialize slideshow
function initSlideshow() {
    if (imagePaths.length === 0) {
        renderDots(1);
    } else {
        renderDots(imagePaths.length);
    }
    currentIndex = 0;
    updateSlide(0);
}

// Flower animation
const flowerEmojis = ['🌹', '🌷', '🌸', '🌺', '🌼', '🌻'];

function createFlower() {
    const flowerDiv = document.createElement('div');
    flowerDiv.classList.add('flower');
    flowerDiv.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
    
    flowerDiv.style.left = Math.random() * 100 + '%';
    let size = 1.5 + Math.random() * 1.8;
    flowerDiv.style.fontSize = size + 'rem';
    
    const duration = 7 + Math.random() * 15;
    flowerDiv.style.animationDuration = duration + 's';
    flowerDiv.style.animationDelay = Math.random() * 8 + 's';
    
    flowerGarden.appendChild(flowerDiv);

    setTimeout(() => {
        if (flowerDiv && flowerDiv.parentNode) {
            flowerDiv.remove();
        }
    }, (duration + 5) * 1000);
}

// Event Listeners
prevBtn.addEventListener('click', function() {
    if (imagePaths.length === 0) return;
    currentIndex = (currentIndex - 1 + imagePaths.length) % imagePaths.length;
    updateSlide(currentIndex);
});

nextBtn.addEventListener('click', function() {
    if (imagePaths.length === 0) return;
    currentIndex = (currentIndex + 1) % imagePaths.length;
    updateSlide(currentIndex);
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// Error handling
slideImg.addEventListener('error', function() {
    if (imagePaths.length > 0) {
        // Try to reload
        this.src = imagePaths[currentIndex];
    }
});

// Start everything
window.addEventListener('load', function() {
    loadPictures();
    
    // Start flower animation
    for (let i = 0; i < 10; i++) {
        setTimeout(createFlower, i * 250);
    }
    setInterval(createFlower, 900);
});