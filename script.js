/**
 * Clefsanté - Client-Side Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initDoshaQuiz();
    initRemediesModal();
    initBookingForm();
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

    // Close menu when clicking nav links
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
            
            // Manage active class
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ==========================================================================
   Interactive Dosha Quiz
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
        if (currentStep >= QUIZ_QUESTIONS.length) {
            showResults();
            return;
        }

        // Update progress bar
        const progressPercentage = (currentStep / QUIZ_QUESTIONS.length) * 100;
        progress.style.width = `${progressPercentage}%`;

        // Render Slide
        const qData = QUIZ_QUESTIONS[currentStep];
        let optionsHTML = qData.options.map((opt, index) => {
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

        // Add Click Handlers to options
        const optionEls = container.querySelectorAll('.quiz-option');
        optionEls.forEach(el => {
            el.addEventListener('click', () => {
                optionEls.forEach(item => item.classList.remove('selected'));
                el.classList.add('selected');
                selectedAnswers[currentStep] = el.getAttribute('data-type');
                nextBtn.disabled = false;
            });
        });

        // Set button visibility
        prevBtn.style.display = currentStep > 0 ? 'inline-flex' : 'none';
        nextBtn.innerText = currentStep === QUIZ_QUESTIONS.length - 1 ? 'Calculate Result' : 'Next Question';
        nextBtn.disabled = selectedAnswers[currentStep] === null;
    }

    function showResults() {
        // Hide control buttons & bar
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        progress.parentElement.style.display = 'none';

        // Calculate scores
        let counts = { vata: 0, pitta: 0, kapha: 0 };
        selectedAnswers.forEach(ans => {
            if (ans) counts[ans]++;
        });

        const total = QUIZ_QUESTIONS.length;
        const vataPct = Math.round((counts.vata / total) * 100);
        const pittaPct = Math.round((counts.pitta / total) * 100);
        const kaphaPct = Math.round((counts.kapha / total) * 100);

        // Determine dominant Dosha
        let dominant = 'Vata';
        let description = '';
        let advice = '';
        
        const maxVal = Math.max(counts.vata, counts.pitta, counts.kapha);
        if (maxVal === counts.vata) {
            dominant = 'Vata';
            description = 'Your dominant energy is Vata, representing the elements of Air and Ether. You are naturally creative, enthusiastic, energetic, and quick-thinking. However, you are also prone to dryness, anxiety, and irregular digestion.';
            advice = '<strong>Balancing tips:</strong> Focus on warm, grounding foods, stick to a regular sleeping routine, and practice gentle, calming yoga.';
        } else if (maxVal === counts.pitta) {
            dominant = 'Pitta';
            description = 'Your dominant energy is Pitta, representing the elements of Fire and Water. You possess strong focus, a sharp intellect, and a passionate, driven nature. When out of balance, you might suffer from inflammation, acidity, or irritability.';
            advice = '<strong>Balancing tips:</strong> Eat cooling, fresh foods, avoid heavy spices, schedule time to play and relax, and connect with natural bodies of water.';
        } else {
            dominant = 'Kapha';
            description = 'Your dominant energy is Kapha, representing the elements of Earth and Water. You are naturally calm, loving, loyal, stable, and strong. When imbalanced, you may experience lethargy, weight gain, congestion, or resistance to change.';
            advice = '<strong>Balancing tips:</strong> Stay active with dynamic exercises, favor warm, light and spicy foods, seek out new experiences, and wake up early.';
        }

        container.innerHTML = `
            <div class="results-container">
                <span class="badge">Your Assessment Result</span>
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
                <div class="dosha-card text-center" style="max-width: 550px; margin: 0 auto 3rem auto; padding: 2rem;">
                    <p style="margin: 0; color: var(--text-charcoal);">${advice}</p>
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

    // Initialize first question
    renderQuestion();
}

/* ==========================================================================
   Natural Remedies & Detail Modals
   ========================================================================== */
const HERB_DETAILS = {
    ashwagandha: {
        title: "Ashwagandha",
        botanical: "Withania somnifera",
        type: "Root Powder / Extract",
        target: "Vata & Kapha Pacifying",
        description: "Known as the 'Indian Ginseng', Ashwagandha is an powerhouse adaptogen designed to build life force (Ojas). It calms the central nervous system, reduces stress hormone levels, improves memory, and bolsters immune pathways.",
        uses: "Mix 1/2 tsp of organic root powder with warm milk (or almond milk) and a dash of honey before bed to combat insomnia and racing thoughts."
    },
    turmeric: {
        title: "Turmeric (Haldi)",
        botanical: "Curcuma longa",
        type: "Rhizome Powder",
        target: "Pitta & Kapha Pacifying",
        description: "Turmeric is highly revered in Ayurveda as a blood purifier and tissue cleanser. Loaded with curcumin, it supports cell health, cleanses inflammatory channels, relieves painful joints, and provides a natural glow to the skin.",
        uses: "Boil 1/2 tsp in coconut milk or cow milk with black pepper and cardamom (Golden Milk) to maximize biological absorption."
    },
    triphala: {
        title: "Triphala",
        botanical: "Three Fruits Formula",
        type: "Composite Herbal Formula",
        target: "Tridoshic (Vata, Pitta, Kapha balancing)",
        description: "Triphala is composed of Amla (rejuvenative), Haritaki (cleansing), and Bibhitaki (structural support). It is the premier Ayurvedic colon cleanser that aids absorption, regulates bowel movements, and nourishes cells without depleting bodily fluids.",
        uses: "Stir 1/2 tsp into warm water. Steep for 5 minutes and drink first thing in the morning or right before bedtime on an empty stomach."
    },
    tulsi: {
        title: "Tulsi (Holy Basil)",
        botanical: "Ocimum sanctum",
        type: "Fresh / Dry Leaves",
        target: "Kapha & Vata Pacifying",
        description: "Regarded as the 'Queen of Herbs' or holy gateway, Tulsi balances the respiratory tract and expels excess Kapha (mucus/dampness). It clears pranic energy channels, aids stress adaptation, and enhances clarity of focus.",
        uses: "Infuse 5-7 fresh or dried leaves in hot water for 10 minutes. Enjoy as a herbal tea with raw lemon juice to lift brain fog."
    }
};

function initRemediesModal() {
    const modal = document.getElementById('herb-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const modalContent = document.getElementById('modal-body-content');
    const cards = document.querySelectorAll('.herb-card');

    function openModal(herbKey) {
        const data = HERB_DETAILS[herbKey];
        if (!data) return;

        modalContent.innerHTML = `
            <span class="badge">${data.type}</span>
            <h2 class="modal-herb-title">${data.title}</h2>
            <p class="modal-herb-botanical">${data.botanical}</p>
            
            <div class="modal-herb-meta">
                <div class="modal-meta-item">
                    <strong>Dosha Affinity</strong>
                    ${data.target}
                </div>
            </div>
            
            <div class="modal-body-text">
                <h3>Overview</h3>
                <p>${data.description}</p>
                
                <h3>Traditional Application</h3>
                <p>${data.uses}</p>
            </div>
        `;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Stop scroll background
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-herb');
            openModal(key);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   Booking & Consultation Form
   ========================================================================== */
function initBookingForm() {
    const form = document.getElementById('booking-form');
    const successMsg = document.getElementById('booking-success');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple animation loading indicator
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = "Requesting slot...";

        // Simulate network latency
        setTimeout(() => {
            // Hide all input groups inside the form wrapper
            const inputs = form.querySelectorAll('.form-group, .grid-2, h3, .form-sub');
            inputs.forEach(el => el.style.display = 'none');
            submitBtn.style.display = 'none';

            // Show success alert
            successMsg.style.display = 'block';
        }, 1500);
    });
}
