document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const pageIndex = Array.from(pages).indexOf(targetElement);
            if (pageIndex > -1) {
                scrollToPage(pageIndex);
            }
        }
    });
});

const container = document.querySelector('.container');
const pages = document.querySelectorAll('.page');
const sideNav = document.getElementById('side-nav');
let navDots = [];
let currentPageIndex = 0;
let isScrolling = false;

function updateActiveNav() {
    navDots.forEach((dot, index) => {
        if (index === currentPageIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function createSideNav() {
    pages.forEach((page, index) => {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        dot.addEventListener('click', () => scrollToPage(index));
        sideNav.appendChild(dot);
        navDots.push(dot);
    });
    updateActiveNav();
}

// Fallback in case scrollend never fires (e.g. already at target position).
let scrollendFallback;

function scrollToPage(index) {
    if (index >= 0 && index < pages.length) {
        const targetTop = pages[index].offsetTop;

        // If already at the destination no scroll will occur and scrollend
        // will never fire — skip the lock entirely.
        if (Math.abs(container.scrollTop - targetTop) < 1) {
            currentPageIndex = index;
            updateActiveNav();
            return;
        }

        isScrolling = true;
        clearTimeout(scrollendFallback);
        // Safety net: release the lock after 1 s even if scrollend is missed.
        scrollendFallback = setTimeout(() => { isScrolling = false; }, 1000);

        container.scrollTo({ top: targetTop, behavior: 'smooth' });
        currentPageIndex = index;
        updateActiveNav();
    }
}

// Reset the flag only once the smooth scroll animation has truly finished,
// eliminating the fixed-timeout guesswork entirely.
container.addEventListener('scrollend', () => {
    clearTimeout(scrollendFallback);
    isScrolling = false;
});

container.addEventListener('wheel', (event) => {
    if (isScrolling) {
        event.preventDefault();
        return;
    }

    const contentSection = pages[currentPageIndex].querySelector('.content-section');
    const delta = event.deltaY;

    if (delta > 0) { // Scrolling down
        // Only advance to the next page when there is no overflowing content left
        // to scroll through, or when there is no scrollable section at all.
        if (contentSection) {
            const remainingScroll = contentSection.scrollHeight - contentSection.scrollTop - contentSection.clientHeight;
            if (remainingScroll > 1) return; // Let the internal section scroll naturally
        }
        if (currentPageIndex < pages.length - 1) {
            event.preventDefault();
            scrollToPage(currentPageIndex + 1);
        }
    } else { // Scrolling up
        // Only go back to the previous page once internal content is scrolled
        // all the way back to the top.
        if (contentSection && contentSection.scrollTop > 0) return;
        if (currentPageIndex > 0) {
            event.preventDefault();
            scrollToPage(currentPageIndex - 1);
        }
    }
}, { passive: false });

window.addEventListener('keydown', (event) => {
    if (isScrolling) return;

    if (event.key === 'ArrowDown') {
        if (currentPageIndex < pages.length - 1) {
            scrollToPage(currentPageIndex + 1);
        }
    } else if (event.key === 'ArrowUp') {
        if (currentPageIndex > 0) {
            scrollToPage(currentPageIndex - 1);
        }
    }
});

// Sync the active dot if the user reaches a page through a method other than
// the wheel / keyboard handlers above (e.g. dragging a visible scrollbar).
let scrollTimeout;
container.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (isScrolling) return;
        const newPageIndex = Math.round(container.scrollTop / window.innerHeight);
        if (newPageIndex !== currentPageIndex) {
            currentPageIndex = newPageIndex;
            updateActiveNav();
        }
    }, 150);
});

function handleInitialLoad() {
    const hash = window.location.hash;
    if (hash) {
        const targetPage = document.querySelector(hash);
        if (targetPage) {
            const pageIndex = Array.from(pages).indexOf(targetPage);
            if (pageIndex > -1) {
                setTimeout(() => {
                    scrollToPage(pageIndex);
                }, 100);
            }
        }
    }
}

createSideNav();
handleInitialLoad();
console.log("Website loaded.");
