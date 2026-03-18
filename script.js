document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const pages = document.querySelectorAll('.page');
    const sideNav = document.getElementById('side-nav');

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    // 1. Generate Nav Dots
    pages.forEach((page, index) => {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        if (index === 0) dot.classList.add('active');

        // Click to scroll
        dot.addEventListener('click', () => {
            page.scrollIntoView({ behavior: 'smooth' });
        });

        sideNav.appendChild(dot);
    });

    const dots = document.querySelectorAll('.nav-dot');

    if (!isMobile()) {
        // 2. Intersection Observer Logic
        const observerOptions = {
            root: container,
            threshold: 0.4 // Adjust this! 0.4 means "Snap when 40% of the section is visible"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(pages).indexOf(entry.target);

                    // Update dots
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[index].classList.add('active');

                    // Optional: Auto-snap behavior
                    // We use a small timeout to ensure we don't fight the user's finger/wheel
                    clearTimeout(window.scrollTimeout);
                    window.scrollTimeout = setTimeout(() => {
                        entry.target.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            });
        }, observerOptions);

        pages.forEach(page => observer.observe(page));
    }
    // 3. Keyboard Navigation
    window.addEventListener('keydown', (e) => {
        // Find the current active index from the dots
        const activeDot = document.querySelector('.nav-dot.active');
        const currentIndex = Array.from(dots).indexOf(activeDot);

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            if (currentIndex < pages.length - 1) {
                e.preventDefault(); // Stop the default "small" scroll
                pages[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (currentIndex > 0) {
                e.preventDefault();
                pages[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            pages[0].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            pages[pages.length - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme');

    // 1. Initial Theme Check
    if (currentTheme) {
        html.setAttribute('data-theme', currentTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        html.setAttribute('data-theme', 'light');
    }

    // find the theme toggle button and set its initial state
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.innerHTML = html.getAttribute('data-theme') === 'light' ? '🌙' : '☀️';

    themeBtn.addEventListener('click', () => {
        const isLight = html.getAttribute('data-theme') === 'light';
        const newTheme = isLight ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    });
});
