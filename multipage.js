/**
 * Clefsanté - Multi-Page Client-Side Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initGlobalNav();
    initPageRouter();
});

/* ==========================================================================
   Global Layout Helpers (Navigation & Scroll)
   ========================================================================== */
function initGlobalNav() {
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            toggleBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

/* ==========================================================================
   Page Specific Router & Loader
   ========================================================================== */
function initPageRouter() {
    // 1. Home / Index Page
    if (document.getElementById('newsletter-form')) {
        initHomeNewsletters();
        // Initialize modals for blog cards on homepage
        if (document.querySelector('.blog-post-card')) {
            initBlogModals();
        }
    }

    // 2. Daily Rituals Page (Dinacharya)
    if (document.getElementById('timeline-card')) {
        initTimeline();
    }

    // 3. Herb Directory Page
    if (document.getElementById('herb-grid')) {
        initHerbEncyclopedia();
    }

    // 4. Standalone Dosha Quiz Page
    if (document.getElementById('quiz-container')) {
        initDoshaQuiz();
    }

    // 5. Blog page - initialize filters and modals
    if (document.querySelector('.blog-grid')) {
        initBlogFilters();
        if (document.querySelector('.blog-post-card')) {
            initBlogModals();
        }
    }

    // 6. Dynamic blog loader (if container exists)
    if (document.getElementById('blog-grid-container')) {
        loadBlogPosts();
    }

    // 7. Featured posts loader (if container exists)
    if (document.getElementById('featured-blog-container')) {
        loadFeaturedPosts();
    }

    // 8. General Newsletter Footer on subpages
    if (document.getElementById('footer-newsletter-form')) {
        initFooterNewsletter();
    }
}

/* ==========================================================================
   1. Homepage Newsletters
   ========================================================================== */
function initHomeNewsletters() {
    const form = document.getElementById('newsletter-form');
    const success = document.getElementById('newsletter-success');

    if (form && success) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.innerText = "Joining...";
            setTimeout(() => {
                form.style.display = 'none';
                success.style.display = 'block';
            }, 1000);
        });
    }
}

/* ==========================================================================
   2. Dinacharya Daily Rituals Timeline
   ========================================================================== */
const RITUALS_DATA = {
    morning: {
        title: "Rise With the Sun (Brahma Muhurta)",
        hour: "05:00 AM - 07:00 AM",
        icon: "🌅",
        description: "Waking before sunrise is key to absorbing the pure, active energy (Sattva) of nature. Cleanse your sensory organs: rinse eyes with cold water, scrape your tongue with a copper scraper to expel accumulated metabolic waste (Ama), and practice Gandusha (oil pulling) for gum health."
    },
    midday: {
        title: "Mitahara: Your Principle Meal",
        hour: "12:00 PM - 01:30 PM",
        icon: "☀️",
        description: "The solar energy is at its peak, aligning directly with your internal digestive fire (Agni). Make lunch the largest and most nourishing meal of the day. Focus on warm, cooked food. Allow 10 minutes of quiet rest on your left side post-meal to assist pancreatic secretion."
    },
    evening: {
        title: "Sandhya: Twilight Wind-Down",
        hour: "18:00 PM - 07:30 PM",
        icon: "🌇",
        description: "As day transitions into night, shift your nervous system into restorative modes. Enjoy a light supper (soups, stewed grains) at least 3 hours before sleep. Practice slow alternate-nostril breathing (Nadi Shodhana) or light stretching to ground wandering thoughts."
    },
    night: {
        title: "Nidra Prep: Rejuvenating Sleep",
        hour: "21:30 PM - 10:00 PM",
        icon: "🌙",
        description: "Align your pineal gland rhythms by turning off screens. Practice Padabhyanga (massaging the soles of your feet with warm sesame oil or ghee) to induce deep sleep. Aim to be asleep by 10:00 PM, when the body initiates active tissue detox."
    }
};

function initTimeline() {
    const tabs = document.querySelectorAll('.timeline-tab');
    const container = document.getElementById('timeline-card');

    function updateCard(key) {
        const data = RITUALS_DATA[key];
        if (!data || !container) return;

        container.style.opacity = '0';
        setTimeout(() => {
            container.innerHTML = `
                <div class="timeline-ritual-icon">${data.icon}</div>
                <div class="timeline-ritual-text">
                    <span class="ritual-meta">${data.hour}</span>
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                </div>
            `;
            container.style.opacity = '1';
        }, 150);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateCard(tab.getAttribute('data-time'));
        });
    });

    updateCard('morning');
}

/* ==========================================================================
   3. Herb Directory search & filters
   ========================================================================== */
function initHerbEncyclopedia() {
    const searchInput = document.getElementById('herb-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#herb-grid .herb-card');
    const adCard = document.querySelector('#herb-grid .ad-card-grid');

    let currentCategory = 'all';
    let searchQuery = '';

    function filterCards() {
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            const cardName = card.querySelector('h3').textContent.toLowerCase();
            const cardBot = card.querySelector('.herb-botanical').textContent.toLowerCase();

            const matchesCategory = currentCategory === 'all' || cardCat === currentCategory;
            const matchesSearch = cardName.includes(searchQuery) || cardBot.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                card.classList.remove('fade-out');
                card.classList.add('fade-in');
            } else {
                card.classList.add('fade-out');
                card.classList.remove('fade-in');
                setTimeout(() => {
                    if (card.classList.contains('fade-out')) {
                        card.style.display = 'none';
                    }
                }, 400);
            }
        });

        // Toggle Ad banner in grid
        if (adCard) {
            if (searchQuery === '' && (currentCategory === 'all' || currentCategory === 'immunity')) {
                adCard.style.display = 'flex';
            } else {
                adCard.style.display = 'none';
            }
        }
    }

    // Category button click
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            filterCards();
        });
    });

    // Search input typing
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterCards();
        });
    }
}

/* ==========================================================================
   4. Standalone Dosha Quiz
   ========================================================================== */
const QUIZ_QUESTIONS = [
    {
        question: "How would you describe your physical build and body frame?",
        options: [
            { text: "Lightweight, thin, slender, or tall; struggle to gain weight", type: "vata" },
            { text: "Medium, athletic, well-proportioned; gain or lose weight easily", type: "pitta" },
            { text: "Solid, heavy frame, broad shoulders; tend to gain weight easily", type: "kapha" }
        ]
    },
    {
        question: "How does your skin look and feel most of the time?",
        options: [
            { text: "Dry, rough, thin, cool to the touch; prone to cracking", type: "vata" },
            { text: "Warm, reddish, sensitive, prone to freckles or acne", type: "pitta" },
            { text: "Thick, soft, smooth, oily, moist; pale or glowing complexion", type: "kapha" }
        ]
    },
    {
        question: "Which pattern best describes your sleep quality?",
        options: [
            { text: "Light, easily disrupted, prone to waking up with racing thoughts", type: "vata" },
            { text: "Sound, moderate length (6-7 hrs); feel refreshed quickly", type: "pitta" },
            { text: "Deep, heavy, long (8+ hrs); struggle to wake up in the morning", type: "kapha" }
        ]
    },
    {
        question: "How do you typically react to mental or emotional stress?",
        options: [
            { text: "Worry, anxiety, fear, or overthinking; mind jumps from thought to thought", type: "vata" },
            { text: "Anger, frustration, irritability, impatience, or fiery determination", type: "pitta" },
            { text: "Calm, steady, retreat to comfort, or exhibit stubbornness and denial", type: "kapha" }
        ]
    },
    {
        question: "What are your digestive habits and appetite like?",
        options: [
            { text: "Irregular; hungry one day, forget to eat the next; prone to bloating", type: "vata" },
            { text: "Intense appetite; get irritable if meals are delayed; strong digestion", type: "pitta" },
            { text: "Slow digestion; moderate appetite but love rich food; feel heavy after meals", type: "kapha" }
        ]
    }
];

function initDoshaQuiz() {
    const container = document.getElementById('quiz-container');
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const progress = document.getElementById('quiz-progress');

    let currentStep = 0;
    let selectedAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);

    function renderQuestion() {
        if (!container || !progress || !nextBtn || !prevBtn) return;

        if (currentStep >= QUIZ_QUESTIONS.length) {
            showResults();
            return;
        }

        const pct = (currentStep / QUIZ_QUESTIONS.length) * 100;
        progress.style.width = `${pct}%`;

        const data = QUIZ_QUESTIONS[currentStep];
        let optionsHTML = data.options.map(opt => {
            const isSelected = selectedAnswers[currentStep] === opt.type;
            return `
                <div class="quiz-option ${isSelected ? 'selected' : ''}" data-type="${opt.type}">
                    <div class="quiz-option-indicator"></div>
                    <span class="quiz-option-text">${opt.text}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="quiz-question-slide">
                <span class="badge">Question ${currentStep + 1} of ${QUIZ_QUESTIONS.length}</span>
                <h3>${data.question}</h3>
                <div class="quiz-options">${optionsHTML}</div>
            </div>
        `;

        const options = container.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedAnswers[currentStep] = opt.getAttribute('data-type');
                nextBtn.disabled = false;
            });
        });

        prevBtn.style.display = currentStep > 0 ? 'inline-flex' : 'none';
        nextBtn.innerText = currentStep === QUIZ_QUESTIONS.length - 1 ? 'Show Results' : 'Next Question';
        nextBtn.disabled = selectedAnswers[currentStep] === null;
    }

    function showResults() {
        if (!prevBtn || !nextBtn || !progress || !container) return;
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        progress.parentElement.style.display = 'none';

        let counts = { vata: 0, pitta: 0, kapha: 0 };
        selectedAnswers.forEach(ans => {
            if (ans) counts[ans]++;
        });

        const total = QUIZ_QUESTIONS.length;
        const vataPct = Math.round((counts.vata / total) * 100);
        const pittaPct = Math.round((counts.pitta / total) * 100);
        const kaphaPct = Math.round((counts.kapha / total) * 100);

        let dominant = 'Vata';
        let desc = '';
        let advice = '';

        const maxVal = Math.max(counts.vata, counts.pitta, counts.kapha);
        if (maxVal === counts.vata) {
            dominant = 'Vata';
            desc = 'Your constitution is Vata-dominant (Air & Ether elements). Creative, lively, and thin-built. When out of balance, you might experience anxiety, insomnia, dry skin, and irregular bloating.';
            advice = '<strong>Grounding Tips:</strong> Sip warm liquids, eat grounding soups and rice, sleep by 10:00 PM, and support yourself with Ashwagandha root.';
        } else if (maxVal === counts.pitta) {
            dominant = 'Pitta';
            desc = 'Your constitution is Pitta-dominant (Fire & Water elements). Focused, intelligent, warm, and competitive. Out of balance, you are prone to acidity, inflammation, anger, and heat-rashes.';
            advice = '<strong>Cooling Tips:</strong> Choose cooling mint and cucumber, limit chilies and alcohol, practice self-compassion, and cleanse with Neem leaves.';
        } else {
            dominant = 'Kapha';
            desc = 'Your constitution is Kapha-dominant (Earth & Water elements). Calm, loyal, stable, and strong. When imbalanced, it manifests as sluggishness, congestion, depression, and metabolic weight gain.';
            advice = '<strong>Stimulating Tips:</strong> Wake up at 6:00 AM, seek dynamic physical exercise, consume warm herbal teas, and take Tulsi leaf infusions.';
        }

        container.innerHTML = `
            <div class="results-container">
                <span class="badge">Constitutional Summary</span>
                <div class="results-verdict">
                    <h3>Your dominant Dosha is: ${dominant}</h3>
                </div>
                <div class="results-chart">
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar-container">
                            <div class="chart-fill vata-fill" style="height: ${vataPct}%"></div>
                        </div>
                        <span class="stat-label">Vata</span>
                        <strong>${vataPct}%</strong>
                    </div>
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar-container">
                            <div class="chart-fill pitta-fill" style="height: ${pittaPct}%"></div>
                        </div>
                        <span class="stat-label">Pitta</span>
                        <strong>${pittaPct}%</strong>
                    </div>
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar-container">
                            <div class="chart-fill kapha-fill" style="height: ${kaphaPct}%"></div>
                        </div>
                        <span class="stat-label">Kapha</span>
                        <strong>${kaphaPct}%</strong>
                    </div>
                </div>
                <p class="results-description">${desc}</p>
                <div class="dosha-card text-center" style="max-width: 550px; margin: 0 auto 3rem auto; padding: 2rem; border-radius: var(--border-radius-md);">
                    <p style="margin: 0; color: var(--text-charcoal); font-size: 0.95rem;">${advice}</p>
                </div>
                <button class="btn btn-primary" id="quiz-reset-btn">Retake Assessment</button>
            </div>
        `;

        document.getElementById('quiz-reset-btn').addEventListener('click', () => {
            currentStep = 0;
            selectedAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
            prevBtn.style.display = 'inline-flex';
            nextBtn.style.display = 'inline-flex';
            progress.parentElement.style.display = 'block';
            renderQuestion();
        });
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentStep++;
        renderQuestion();
    });

    renderQuestion();
}

/* ==========================================================================
   5. General Subpage Footer Newsletter
   ========================================================================== */
function initFooterNewsletter() {
    const form = document.getElementById('footer-newsletter-form');
    const success = document.getElementById('footer-newsletter-success');

    if (form && success) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.innerText = "Adding...";
            setTimeout(() => {
                form.style.display = 'none';
                success.style.display = 'block';
            }, 1000);
        });
    }
}

/* ==========================================================================
   6. Blog Article Modals
   ========================================================================== */
const BLOG_MODAL_DATA = {
    "warm-water": {
        type: "Digestive Science Publication",
        title: "The Science of Warm Water: Why Cold Drinks Slow Metabolism",
        meta: "By Clefsanté Wellness Editorial | 4 min read",
        description: "In Ayurvedic theory, digestive power is represented by Agni (fire). Drinking ice-cold water is akin to throwing water on a hot bonfire; it halts enzyme secretion, solidifies dietary fats, and delays nutrient breakdown.<br><br>Modern biological research confirms that cold liquids induce vasoconstriction in stomach lining vessels, slowing peristalsis. Warm or room-temperature water, conversely, dilates these capillaries, increases blood flow to the digestive organs, and supports natural detox (Kledaka Kapha).",
        application: "<strong>Ayurvedic Tip:</strong> Sip warm water from a copper vessel throughout the morning to naturally clear digestive sluggishness."
    },
    "vata-season": {
        type: "Seasonal Routine Guide",
        title: "Navigating Vata Season: How to Stay Grounded in Dry Winds",
        meta: "By Clefsanté Wellness Editorial | 6 min read",
        description: "During autumn and early winter, dry, windy, and cold elements dominate the environment, driving up Vata Dosha in our bodies. This leads to dry skin, bloating, anxiety, and sleeplessness.<br><br>Ayurveda's core principle is 'like increases like; opposites bring balance'. To counter the cold dryness, we must feed our body warm, heavy, oily, and well-spiced meals. Daily Abhyanga (self-massage) with warm sesame oil serves as a protective envelope for the nervous system, preventing stress hormones from spiking.",
        application: "<strong>Ayurvedic Tip:</strong> Avoid raw vegetables and dry snacks. Instead, eat warm stews, soups, cooked oats, and seasoned lentils."
    },
    "golden-milk": {
        type: "Herbal Chemistry Deep Dive",
        title: "Golden Milk: The Immunity Recipe Proven by Modern Science",
        meta: "By Clefsanté Wellness Editorial | 5 min read",
        description: "Traditional Haldi Doodh (Golden Milk) has been used for centuries to treat throat irritations and boost vitality. While turmeric is the hero, its active compound, curcumin, is poorly absorbed by the human body.<br><br>Science now reveals why the ancient recipe is perfect: black pepper contains piperine, which boosts curcumin bioavailability by 2000%. Furthermore, curcumin is fat-soluble; boiling it in whole milk (or adding ghee/coconut oil) allows the active compounds to dissolve and pass easily through the intestinal walls.",
        application: "<strong>Recipe:</strong> Warm 1 cup milk, add 1/2 tsp Turmeric, a pinch of crushed black pepper, a sliver of ginger, and 1/2 tsp organic ghee. Sweeten with raw honey."
    }
};

function initBlogModals() {
    const modal = document.getElementById('details-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const modalContent = document.getElementById('modal-body-content');
    const blogCards = document.querySelectorAll('.blog-post-card[data-article]');

    function openModal(key) {
        const data = BLOG_MODAL_DATA[key];
        if (!data) return;

        modalContent.innerHTML = `
            <span class="badge">${data.type}</span>
            <h2 class="modal-herb-title">${data.title}</h2>
            <p class="modal-herb-botanical">${data.meta}</p>
            
            <div class="modal-body-text">
                <h3>Full Article</h3>
                <p>${data.description}</p>
                
                <h3>Practical Application</h3>
                <p>${data.application}</p>
            </div>
        `;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    blogCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const key = card.getAttribute('data-article');
            openModal(key);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   7. Blog Page Category Filters
   ========================================================================== */
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-post-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');

            blogCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('fade-out');
                    card.classList.remove('fade-in');
                    setTimeout(() => {
                        if (card.classList.contains('fade-out')) {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });
}

/* ==========================================================================
   8. Dynamic Blog Loader from JSON
   ========================================================================== */
async function loadBlogPosts() {
    const container = document.getElementById('blog-grid-container');
    if (!container) return;

    try {
        const response = await fetch('data/blog-posts.json');
        const posts = await response.json();

        container.innerHTML = posts.map(post => `
            <a href="${post.url}" class="blog-post-card" data-category="${post.category}">
                <div class="blog-post-img-placeholder">${post.emoji}</div>
                <div class="blog-post-body">
                    <span class="blog-post-category">${post.categoryLabel}</span>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="blog-post-meta">
                        <span class="read-time">${post.readTime}</span>
                        <span class="btn-link font-sm">Read Article →</span>
                    </div>
                </div>
            </a>
        `).join('');

        // Re-initialize filters and modals after loading
        initBlogFilters();
        initBlogModals();

    } catch (error) {
        console.error('Failed to load blog posts:', error);
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Unable to load articles. Please try again later.</p>';
    }
}

/* ==========================================================================
   9. Featured Blog Loader (for homepage)
   ========================================================================== */
async function loadFeaturedPosts() {
    const container = document.getElementById('featured-blog-container');
    if (!container) return;

    try {
        const response = await fetch('data/blog-posts.json');
        const posts = await response.json();
        const featured = posts.filter(post => post.featured);

        container.innerHTML = featured.map(post => `
            <div class="blog-post-card" data-article="${post.id}">
                <div class="blog-post-img-placeholder">${post.emoji}</div>
                <div class="blog-post-body">
                    <span class="blog-post-category">${post.categoryLabel}</span>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <div class="blog-post-meta">
                        <span class="read-time">${post.readTime}</span>
                        <span class="btn-link font-sm">Read Article →</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-initialize modals after loading
        initBlogModals();

    } catch (error) {
        console.error('Failed to load featured posts:', error);
    }
}
