document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Scroll Reveal Animation (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.hidden');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Add visible class to trigger transition
            entry.target.classList.add('visible');
            // Stop observing once revealed
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- 4. Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Very basic toggle logic
    mobileBtn.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--glass-bg)';
            navLinks.style.padding = '1rem 0';
            navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';

            // Quick style fix for links in mobile
            const links = navLinks.querySelectorAll('li');
            links.forEach(li => {
                li.style.margin = '1rem 0';
                li.style.textAlign = 'center';
            });
        }
    });

    // --- 5. Gallery Auto Slider (Hiển thị nhiều mục) ---
    const track = document.querySelector('.gallery-track');
    const cards = Array.from(track.children);
    const dotsContainer = document.querySelector('.slider-dots');

    if (cards.length > 0) {
        let currentIndex = 0;
        let visibleCards = getVisibleCards();
        let maxIndex = Math.max(0, cards.length - visibleCards);

        // Lấy số card hiển thị dựa trên màn hình (theo CSS)
        function getVisibleCards() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        // Tạo dấu chấm
        function renderDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        renderDots();

        // Theo dõi thay đổi màn hình để cập nhật số biến
        window.addEventListener('resize', () => {
            const newVisible = getVisibleCards();
            if (newVisible !== visibleCards) {
                visibleCards = newVisible;
                maxIndex = Math.max(0, cards.length - visibleCards);
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                renderDots();
                updateSlider();
            }
        });

        function updateSlider() {
            // Gap đang setup trong CSS là 30px
            const gap = 30;
            const cardWidth = cards[0].offsetWidth;
            const moveAmount = cardWidth + gap;

            track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;

            // Xóa và thêm class active
            const dots = Array.from(dotsContainer.children);
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
            resetInterval();
        }

        function nextSlide() {
            currentIndex++;
            if (currentIndex > maxIndex) {
                currentIndex = 0; // Quay về đầu nếu tới cuối
            }
            updateSlider();
        }

        // Chạy tự động mỗi 5 giây
        let slideInterval = setInterval(nextSlide, 5000);

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
});
