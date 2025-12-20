// ========================================
// QUIET SUNSHINE — INTERACTIVE LOGIC
// ========================================

// State Management
let currentChapter = 0;
let revealIndex = 0;
let pauseTimer = null;

// DOM Elements
const chapters = document.querySelectorAll('.chapter');
const beginBtn = document.getElementById('begin-btn');
const replayBtn = document.getElementById('replay-btn');
const petalsContainer = document.getElementById('petals');

// ========================================
// FLOWER PETAL GENERATION
// ========================================

const petalColors = [
    'var(--color-petal-1)',
    'var(--color-petal-2)',
    'var(--color-petal-3)',
    'var(--color-petal-4)'
];

function createPetal(index, total) {
    const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    const angle = (360 / total) * index;
    const distance = 35;

    const cx = 100 + Math.cos((angle * Math.PI) / 180) * distance;
    const cy = 100 + Math.sin((angle * Math.PI) / 180) * distance;

    petal.setAttribute('cx', cx);
    petal.setAttribute('cy', cy);
    petal.setAttribute('rx', 25);
    petal.setAttribute('ry', 40);
    petal.setAttribute('fill', petalColors[index % petalColors.length]);
    petal.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
    petal.classList.add('petal');
    petal.style.animationDelay = `${index * 0.1}s`;

    return petal;
}

function bloomFlower(stage) {
    // Clear existing petals
    petalsContainer.innerHTML = '';

    // Add petals based on stage (1-10)
    const petalCount = Math.min(stage * 1, 10);

    for (let i = 0; i < petalCount; i++) {
        const petal = createPetal(i, 10);
        petalsContainer.appendChild(petal);
    }
}

// ========================================
// CHAPTER NAVIGATION
// ========================================

function transitionToChapter(nextChapter) {
    if (nextChapter < 0 || nextChapter >= chapters.length) return;

    const currentEl = chapters[currentChapter];
    const nextEl = chapters[nextChapter];

    // Exit current chapter
    currentEl.classList.add('exiting');

    setTimeout(() => {
        currentEl.classList.remove('active', 'exiting');

        // Enter next chapter
        nextEl.classList.add('active');
        currentChapter = nextChapter;

        // Bloom flower
        bloomFlower(currentChapter);

        // Update background warmth
        updateBackground(currentChapter);

        // Chapter-specific setup
        setupChapterInteractions(currentChapter);

    }, 600);
}

function updateBackground(chapter) {
    const warmthLevels = [
        'hsl(35, 100%, 95%)', // Chapter 0
        'hsl(30, 100%, 94%)', // Chapter 1
        'hsl(28, 100%, 93%)', // Chapter 2
        'hsl(25, 100%, 92%)', // Chapter 3
        'hsl(22, 100%, 91%)', // Chapter 4
        'hsl(20, 100%, 90%)', // Chapter 5
        'hsl(18, 100%, 89%)', // Chapter 6
        'hsl(15, 100%, 88%)', // Chapter 7
        'hsl(12, 100%, 87%)', // Chapter 8
        'hsl(10, 100%, 86%)', // Chapter 9
        'hsl(340, 100%, 95%)' // Chapter 10 (final - pink)
    ];

    document.body.style.background = `linear-gradient(135deg, ${warmthLevels[chapter]}, hsl(340, 100%, 95%))`;
}

// ========================================
// CHAPTER-SPECIFIC INTERACTIONS
// ========================================

function setupChapterInteractions(chapter) {
    // Reset reveal index for Chapter 4
    revealIndex = 0;

    switch (chapter) {
        case 1: // The Day - tap anywhere
        case 2: // How the World Feels - parallax + tap
        case 3: // Little Things - side notes + tap
        case 6: // Turning 18 - tap
        case 9: // The Bond - tap
            setupTapToContinue(chapter);
            break;

        case 2: // Parallax effect
            setupParallax(chapter);
            break;

        case 4: // Reveal paragraphs
            setupRevealParagraphs(chapter);
            break;

        case 5: // Breathing pause
            setupBreathingPause(chapter);
            break;

        case 7: // Highlightable text
            setupHighlightable(chapter);
            break;

        case 8: // Pause before continue
            setupPausedContinue(chapter);
            break;
    }
}

function setupTapToContinue(chapter) {
    const chapterEl = chapters[chapter];

    const tapHandler = () => {
        chapterEl.removeEventListener('click', tapHandler);
        transitionToChapter(chapter + 1);
    };

    chapterEl.addEventListener('click', tapHandler);
}

function setupParallax(chapter) {
    const chapterEl = chapters[chapter];
    const panel = chapterEl.querySelector('.parallax-text');

    const mouseMoveHandler = (e) => {
        const rect = chapterEl.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        panel.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    };

    chapterEl.addEventListener('mousemove', mouseMoveHandler);

    // Also add tap to continue
    setupTapToContinue(chapter);
}

function setupRevealParagraphs(chapter) {
    const chapterEl = chapters[chapter];
    const paragraphs = chapterEl.querySelectorAll('.reveal-p');

    const revealNext = () => {
        if (revealIndex < paragraphs.length) {
            paragraphs[revealIndex].classList.add('visible');
            revealIndex++;

            if (revealIndex >= paragraphs.length) {
                // All revealed, wait then move to next chapter
                setTimeout(() => {
                    transitionToChapter(chapter + 1);
                }, 1500);
            }
        }
    };

    const tapHandler = () => {
        revealNext();
    };

    chapterEl.addEventListener('click', tapHandler);

    // Auto-reveal first paragraph
    setTimeout(revealNext, 500);
}

function setupBreathingPause(chapter) {
    const chapterEl = chapters[chapter];

    // Delay showing tap hint
    const hint = chapterEl.querySelector('.tap-hint');
    if (hint) {
        hint.style.animationDelay = '3s';
    }

    // Allow continue after breathing
    setTimeout(() => {
        setupTapToContinue(chapter);
    }, 3000);
}

function setupHighlightable(chapter) {
    const chapterEl = chapters[chapter];
    const highlightables = chapterEl.querySelectorAll('.highlightable');

    highlightables.forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            el.classList.toggle('highlighted');
        });
    });

    // Also add tap to continue (on panel, not text)
    const tapHandler = (e) => {
        if (!e.target.classList.contains('highlightable')) {
            chapterEl.removeEventListener('click', tapHandler);
            transitionToChapter(chapter + 1);
        }
    };

    chapterEl.addEventListener('click', tapHandler);
}

function setupPausedContinue(chapter) {
    const chapterEl = chapters[chapter];
    const hint = chapterEl.querySelector('.tap-hint');

    // Wait 2 seconds before allowing continue
    pauseTimer = setTimeout(() => {
        if (hint) {
            hint.textContent = 'Tap to continue';
            hint.style.opacity = '0.7';
        }

        setupTapToContinue(chapter);
    }, 2000);
}

// ========================================
// BUTTON HANDLERS
// ========================================

beginBtn.addEventListener('click', () => {
    transitionToChapter(1);
});

replayBtn.addEventListener('click', () => {
    // Reset to beginning
    chapters.forEach(ch => ch.classList.remove('active'));
    currentChapter = 0;
    chapters[0].classList.add('active');
    bloomFlower(0);
    updateBackground(0);
});

// ========================================
// INITIALIZATION
// ========================================

function init() {
    // Set initial state
    chapters[0].classList.add('active');
    bloomFlower(0);
    updateBackground(0);

    // Add subtle floating animation to flower
    const flowerContainer = document.querySelector('.flower-container');
    let floatOffset = 0;

    setInterval(() => {
        floatOffset += 0.01;
        const y = Math.sin(floatOffset) * 5;
        flowerContainer.style.transform = `translate(-50%, calc(-50% + ${y}px))`;
    }, 50);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// TOUCH SUPPORT
// ========================================

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ========================================
// ACCESSIBILITY
// ========================================

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const activeChapter = chapters[currentChapter];
        if (activeChapter) {
            activeChapter.click();
        }
    }
});
