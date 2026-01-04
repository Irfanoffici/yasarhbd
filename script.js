document.addEventListener('DOMContentLoaded', () => {

    // 1. Observer for Fade-in Elements
    const fadeObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only fade in once
            }
        });
    }, fadeObserverOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => fadeObserver.observe(el));


    // 2. Observer for Metrics Animation
    const metricsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.metric-bar');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const metricsSection = document.querySelector('.metrics-screen');
    if (metricsSection) {
        metricsObserver.observe(metricsSection);
    }

    // 3. Stagger Text Animation (Intersection Observer)
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const paragraphs = entry.target.querySelectorAll('p');
                paragraphs.forEach((p, index) => {
                    setTimeout(() => {
                        p.style.opacity = '1';
                        p.style.transform = 'translateX(0)';
                    }, index * 300); // 300ms delay between each line
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const staggerContainer = document.querySelector('.stagger-text');
    if (staggerContainer) {
        // Initial state for js animation
        const paragraphs = staggerContainer.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.opacity = '0';
            p.style.transform = 'translateX(-20px)';
            p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        staggerObserver.observe(staggerContainer);
    }

    // 4. Console Log Signature
    console.log("%c SYSTEM STATUS: ONLINE ", "background: #00ff41; color: #000; font-weight: bold;");
    console.log("Logged In: Yasar");
});
