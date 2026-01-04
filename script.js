import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. SMOOTH SCROLL (LENIS)
       ========================================= */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* =========================================
       2. CUSTOM CURSOR
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with lag (using generic animation for smoothness)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .scroll-indicator, .card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    /* =========================================
       3. TEXT SCRAMBLE DECODE EFFECT
       ========================================= */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    document.querySelectorAll("[data-scramble]").forEach(target => {
        let iteration = 0;
        const originalText = target.innerText;

        // Use IntersectionObserver to trigger scramble when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let interval = setInterval(() => {
                        target.innerText = originalText
                            .split("")
                            .map((letter, index) => {
                                if (index < iteration) {
                                    return originalText[index];
                                }
                                return letters[Math.floor(Math.random() * 26)];
                            })
                            .join("");

                        if (iteration >= originalText.length) {
                            clearInterval(interval);
                        }

                        iteration += 1 / 3;
                    }, 30);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(target);
    });

    /* =========================================
       4. GSAP ANIMATIONS
       ========================================= */

    // Fade In Elements (Replacing old observer)
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                }
            }
        );
    });

    // Metrics Animation using GSAP
    gsap.utils.toArray('.metric-item').forEach(item => {
        const bar = item.querySelector('.metric-bar');
        const width = bar.getAttribute('data-width');

        gsap.to(bar, {
            width: width,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
            }
        });
    });

    // Stagger Text in Ignition Section
    const staggerText = document.querySelector('.stagger-text');
    if (staggerText) {
        gsap.fromTo(staggerText.querySelectorAll('p'),
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: staggerText,
                    start: "top 75%",
                }
            }
        );
    }

    // Horizontal Reveal for Observations
    gsap.utils.toArray('.text-card').forEach((card, i) => {
        // Optional: Add a slight rotation or scale effect on scroll
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.1 // subtle delay stagger if they are sequential
        });
    });

    // Console Signature
    console.log("%c SYSTEM STATUS: VITE POWERED ", "background: #00ff41; color: #000; font-weight: bold;");
    console.log("Modules: LENIS + GSAP + AURA (Bundled)");
});
