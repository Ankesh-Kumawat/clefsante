/**
 * Clefsanté - Client-Side Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initDinacharyaTimeline();
    initHerbLibrary();
    initDetailsModal();
    initQuiz();
    initNewsletters();
});

/* ==========================================================================
   Header Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ==========================================================================
   Dinacharya Daily Rituals Timeline
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

function initDinacharyaTimeline() {
    const tabs = document.querySelectorAll('.timeline-tab');
    const cardContainer = document.getElementById('timeline-card');

    function updateTimelineCard(timeKey) {
        const data = RITUALS_DATA[timeKey];
        if (!data) return;

        // Apply a quick fade-in class for animation reset
        cardContainer.style.opacity = 0;
        
        setTimeout(() => {
            cardContainer.innerHTML = `
                <div class="timeline-ritual-icon">${data.icon}</div>
                <div class="timeline-ritual-text">
                    <span class="ritual-meta">${data.hour}</span>
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                </div>
            `;
            cardContainer.style.opacity = 1;
        }, 150);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const timeKey = tab.getAttribute('data-time');
            updateTimelineCard(timeKey);
        });
    });

    // Load initial Morning card
    updateTimelineCard('morning');
}

/* ==========================================================================
   Herb Library category filters
   ========================================================================== */
function initHerbLibrary() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const herbCards = document.querySelectorAll('#herb-grid .herb-card');
    const adCard = document.querySelector('#herb-grid .ad-card-grid');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            herbCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('fade-out');
                    card.classList.remove('fade-in');
                    
                    // Delay display:none to let fade-out animation play
                    setTimeout(() => {
                        if (card.classList.contains('fade-out')) {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });

            // Keep ad space card visible on general categories for better ad impressions
            if (adCard) {
                if (category === 'all' || category === 'immunity' || category === 'skin') {
                    adCard.style.display = 'flex';
                } else {
                    adCard.style.display = 'none';
                }
            }
        });
    });
}

/* ==========================================================================
   Encyclopedia Herb & Article Detail Modals
   ========================================================================== */
const MODAL_CONTENT_DB = {
    // Herbs
    ashwagandha: {
        type: "Stress & Energy Root Tonic",
        title: "Ashwagandha",
        meta: "Withania somnifera | Vata & Kapha Pacifying",
        description: "Known as the ultimate adaptogen, Ashwagandha supports chemical energy levels, reduces adrenal stress, and rebuilds muscular vigor (Ojas). It contains withanolides, which help regulate systemic inflammatory responses.",
        application: "Take 1/2 tsp of organic powder infused in warm almond milk or ghee right before sleeping to combat sleep onset anxiety."
    },
    turmeric: {
        type: "Immunity & Anti-inflammatory Herb",
        title: "Turmeric (Haldi)",
        meta: "Curcuma longa | Pitta & Kapha Pacifying",
        description: "A potent antiseptic and tissue cleanser. Curcumin, the active compound, modulates cellular pathways to ease inflammation, enhance immunity, and purify lymphatic flow.",
        application: "Mix with warm milk, black pepper (which increases curcumin absorption by 2000%), and a fat source like ghee or coconut oil."
    },
    triphala: {
        type: "Digestion & Colon Restorative",
        title: "Triphala Powder",
        meta: "Three Fruit Composite | Tridoshic (Vata, Pitta, Kapha Balancing)",
        description: "A blend of Amla, Haritaki, and Bibhitaki fruits. Triphala regulates intestinal muscular contractions, gently pulls toxins (Ama) from tissues, and acts as a powerful digestive detoxifier.",
        application: "Stir 1/2 tsp into hot water. Steep for 5 minutes and drink on an empty stomach right before sleeping."
    },
    tulsi: {
        type: "Respiratory & Heart Adaptogen",
        title: "Tulsi (Holy Basil)",
        meta: "Ocimum sanctum | Kapha & Vata Pacifying",
        description: "The 'Queen of Herbs'. Tulsi clears mucus blockages from the lungs, strengthens pulmonary defenses, and supports mental acuity under intense stress.",
        application: "Infuse dry or fresh leaves in boiling water for 8 minutes. Add honey after the liquid cools down slightly."
    },
    neem: {
        type: "Skin Rejuvenation & Pitta Coolant",
        title: "Neem",
        meta: "Azadirachta indica | Pitta Pacifying",
        description: "One of the most bitter, cooling herbs in the Ayurvedic system. Neem cools the blood, expels excess heat from the skin, and clears persistent acne or hives.",
        application: "Consume organic Neem leaf extract capsules or apply Neem oil mixed with coconut oil topically to irritated skin."
    },
    brahmi: {
        type: "Cognitive Power & Focus Tonic",
        title: "Brahmi",
        meta: "Bacopa monnieri | Tridoshic Balancing",
        description: "Brahmi stimulates cerebral circulation, improves memory retention, and relieves stress-induced headaches by lowering nervous excitability.",
        application: "Take as a tea in the morning or consume warm infused Brahmi ghee to enhance neurological sharpness."
    },
    amla: {
        type: "Antioxidant & Longevity Fruit",
        title: "Amla (Amalaki)",
        meta: "Phyllanthus emblica | Pitta Pacifying",
        description: "Highly rich in natural Vitamin C. Amla protects cells from oxidant damage, stimulates digestive juices, halts premature greying, and boosts collagen synthesis.",
        application: "Drink a small shot of fresh juice mixed with warm water in the morning or consume Chyawanprash jam daily."
    },

    // Blog Articles
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

function initDetailsModal() {
    const modal = document.getElementById('details-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const modalContent = document.getElementById('modal-body-content');
    
    // Select both herb cards and blog cards
    const herbCards = document.querySelectorAll('.herb-card');
    const blogCards = document.querySelectorAll('.blog-post-card');

    function openModal(key) {
        const data = MODAL_CONTENT_DB[key];
        if (!data) return;

        modalContent.innerHTML = `
            <span class="badge">${data.type}</span>
            <h2 class="modal-herb-title">${data.title}</h2>
            <p class="modal-herb-botanical">${data.meta}</p>
            
            <div class="modal-body-text">
                <h3>Detailed Profile</h3>
                <p>${data.description}</p>
                
                <h3>Practical Guideline</h3>
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

    herbCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-herb');
            openModal(key);
        });
    });

    blogCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-article');
            openModal(key);
        });
    });

    closeBtn.addEventListener('click', closeModal);
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
   Interactive Dosha Quiz (High Engagement)
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

function initQuiz() {
    const container = document.getElementById('quiz-container');
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');
    const progress = document.getElementById('quiz-progress');

    if (!container) return;

    let currentStep = 0;
    let selectedAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);

    function renderQuestion() {
        if (currentStep >= QUIZ_QUESTIONS.length) {
            showResults();
            return;
        }

        const progressPercentage = (currentStep / QUIZ_QUESTIONS.length) * 100;
        progress.style.width = `${progressPercentage}%`;

        const qData = QUIZ_QUESTIONS[currentStep];
        let optionsHTML = qData.options.map((opt) => {
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
                <h3>${qData.question}</h3>
                <div class="quiz-options">
                    ${optionsHTML}
                </div>
            </div>
        `;

        const optionEls = container.querySelectorAll('.quiz-option');
        optionEls.forEach(el => {
            el.addEventListener('click', () => {
                optionEls.forEach(item => item.classList.remove('selected'));
                el.classList.add('selected');
                selectedAnswers[currentStep] = el.getAttribute('data-type');
                nextBtn.disabled = false;
            });
        });

        prevBtn.style.display = currentStep > 0 ? 'inline-flex' : 'none';
        nextBtn.innerText = currentStep === QUIZ_QUESTIONS.length - 1 ? 'Calculate Constitution' : 'Next Question';
        nextBtn.disabled = selectedAnswers[currentStep] === null;
    }

    function showResults() {
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
        let description = '';
        let advice = '';
        
        const maxVal = Math.max(counts.vata, counts.pitta, counts.kapha);
        if (maxVal === counts.vata) {
            dominant = 'Vata';
            description = 'Your dominant energy is Vata, representing Air and Ether. You are creative, energetic, and quick-thinking. Balanced Vata promotes ease and communication. Imbalanced Vata leads to dry skin, anxiety, insomnia, and erratic digestion.';
            advice = '<strong>Recommended for you:</strong> Focus on grounding, warm stews, oils, regular sleeps, and adaptogens like Ashwagandha.';
        } else if (maxVal === counts.pitta) {
            dominant = 'Pitta';
            description = 'Your dominant energy is Pitta, representing Fire and Water. You possess focus, sharp intellect, and strong drive. Balanced Pitta brings wisdom. Imbalanced Pitta leads to acidity, rashes, anger, and heat sensitivity.';
            advice = '<strong>Recommended for you:</strong> Focus on cooling foods, limit hot peppers, rest in shaded areas, and take coolant purifiers like Neem.';
        } else {
            dominant = 'Kapha';
            description = 'Your dominant energy is Kapha, representing Earth and Water. You are calm, loving, stable, and strong. Balanced Kapha brings endurance. Imbalanced Kapha results in lethargy, congestion, and weight gain.';
            advice = '<strong>Recommended for you:</strong> Exercise daily, drink dry warm teas, wake up early, and take warming formulations like Tulsi.';
        }

        container.innerHTML = `
            <div class="results-container">
                <span class="badge">Your Constitutional Profile</span>
                <div class="results-verdict">
                    <h3>Your Body Type: ${dominant}</h3>
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

                <p class="results-description">${description}</p>
                <div class="dosha-card text-center" style="max-width: 550px; margin: 0 auto 3rem auto; padding: 2rem; border-radius: var(--border-radius-md);">
                    <p style="margin: 0; color: var(--text-charcoal); font-size: 0.95rem;">${advice}</p>
                </div>

                <button class="btn btn-primary" id="quiz-reset-btn">Retake Quiz</button>
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

    nextBtn.addEventListener('click', () => {
        currentStep++;
        renderQuestion();
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion();
        }
    });

    renderQuestion();
}

/* ==========================================================================
   Newsletter Signup Submissions
   ========================================================================== */
function initNewsletters() {
    const heroForm = document.getElementById('newsletter-form');
    const heroSuccess = document.getElementById('newsletter-success');
    
    const footerForm = document.getElementById('footer-newsletter-form');
    const footerSuccess = document.getElementById('footer-newsletter-success');

    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = heroForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "Joining...";
            
            setTimeout(() => {
                heroForm.style.display = 'none';
                heroSuccess.style.display = 'block';
            }, 1000);
        });
    }

    if (footerForm) {
        footerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = footerForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "Adding...";
            
            setTimeout(() => {
                footerForm.style.display = 'none';
                footerSuccess.style.display = 'block';
            }, 1000);
        });
    }
}
