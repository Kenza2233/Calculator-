document.addEventListener('DOMContentLoaded', function () {
    // --- Element Caching ---
    const navCalculator = document.getElementById('nav-calculator');
    const navStreak = document.getElementById('nav-streak');
    const navCountdown = document.getElementById('nav-countdown');

    const calculatorSection = document.getElementById('calculator-section');
    const streakSection = document.getElementById('streak-calculator-section');
    const countdownSection = document.getElementById('countdown-section');

    const navSlider = document.querySelector('.nav-slider');
    const sciToggleButton = document.getElementById('sci-toggle');
    const calculatorElement = document.querySelector('.calculator');
    const themeSelector = document.querySelector('.theme-selector');

    // --- State Variables ---
    let countdownInterval;
    let timerInterval;
    let timerTotalSeconds = 0;

    // --- Functions ---
    function updateNavSlider() {
        const activeButton = document.querySelector('.main-nav button.active');
        if (activeButton) {
            navSlider.style.width = `${activeButton.offsetWidth}px`;
            navSlider.style.left = `${activeButton.offsetLeft}px`;
        }
    }

    function showSection(sectionToShow) {
        calculatorSection.classList.add('is-hidden');
        streakSection.classList.add('is-hidden');
        countdownSection.classList.add('is-hidden');
        sectionToShow.classList.remove('is-hidden');

        [navCalculator, navStreak, navCountdown].forEach(nav => nav.classList.remove('active'));
        if (sectionToShow === calculatorSection) navCalculator.classList.add('active');
        else if (sectionToShow === streakSection) navStreak.classList.add('active');
        else if (sectionToShow === countdownSection) navCountdown.classList.add('active');

        updateNavSlider();
    }

    // --- Countdown to Date Logic ---
    function startCountdown() {
        const countdownInput = document.getElementById('countdown-date');
        const targetDate = new Date(countdownInput.value).getTime();
        if (isNaN(targetDate)) {
            alert("Sila pilih tarikh dan masa yang sah.");
            return;
        }
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById('countdown-display').innerHTML = "<h2>TAMAT!</h2>";
                return;
            }
            document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('minutes').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('seconds').innerText = Math.floor((distance % (1000 * 60)) / 1000);
        }, 1000);
    }

    // --- Timer Logic ---
    const timerDisplay = document.getElementById('timer-display');

    function updateTimerDisplay() {
        const hours = Math.floor(timerTotalSeconds / 3600);
        const minutes = Math.floor((timerTotalSeconds % 3600) / 60);
        const seconds = timerTotalSeconds % 60;
        timerDisplay.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        clearInterval(timerInterval); // Ensure no multiple intervals
        const h = parseInt(document.getElementById('timer-hours').value) || 0;
        const m = parseInt(document.getElementById('timer-minutes').value) || 0;
        const s = parseInt(document.getElementById('timer-seconds').value) || 0;
        timerTotalSeconds = h * 3600 + m * 60 + s;

        if (timerTotalSeconds <= 0) return;

        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timerTotalSeconds--;
            updateTimerDisplay();
            if (timerTotalSeconds <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "TAMAT!";
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerTotalSeconds = 0;
        updateTimerDisplay();
        document.getElementById('timer-hours').value = '';
        document.getElementById('timer-minutes').value = '';
        document.getElementById('timer-seconds').value = '';
    }

    // --- Event Listeners ---
    navCalculator.addEventListener('click', () => showSection(calculatorSection));
    navStreak.addEventListener('click', () => showSection(streakSection));
    navCountdown.addEventListener('click', () => showSection(countdownSection));

    sciToggleButton.addEventListener('click', () => calculatorElement.classList.toggle('scientific-mode-active'));

    themeSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('theme-button')) {
            document.body.style.background = e.target.dataset.gradient;
        }
    });

    document.getElementById('start-countdown').addEventListener('click', startCountdown);
    document.getElementById('timer-start').addEventListener('click', startTimer);
    document.getElementById('timer-pause').addEventListener('click', pauseTimer);
    document.getElementById('timer-reset').addEventListener('click', resetTimer);

    // --- Initial Setup ---
    showSection(calculatorSection);
});

// --- Calculator Functions ---
function display(val) {
    if (val === 'PI') document.getElementById('result').value += Math.PI;
    else if (val === 'E') document.getElementById('result').value += Math.E;
    else document.getElementById('result').value += val;
}
function clearScreen() { document.getElementById('result').value = ''; }
function del() { document.getElementById('result').value = document.getElementById('result').value.slice(0, -1); }
function factorial(n) {
    if (n < 0) return NaN; if (n === 0 || n === 1) return 1;
    let result = 1; for (let i = 2; i <= n; i++) result *= i; return result;
}
function calculate() {
    let expression = document.getElementById('result').value;
    try {
        let processedExpr = expression
            .replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan')
            .replace(/log/g, 'Math.log10').replace(/ln/g, 'Math.log').replace(/sqrt/g, 'Math.sqrt')
            .replace(/\^/g, '**').replace(/PI/g, 'Math.PI').replace(/E/g, 'Math.E');
        processedExpr = processedExpr.replace(/(\d+)!/g, (match, number) => `factorial(${number})`);
        processedExpr = processedExpr.replace(/(\d+(\.\d+)?)%/g, (match, number) => `(${number}/100)`);
        const calculateFunction = new Function('factorial', `return ${processedExpr}`);
        const result = calculateFunction(factorial);
        document.getElementById('result').value = (isNaN(result) || !isFinite(result)) ? 'Error' : result;
    } catch (e) { document.getElementById('result').value = 'Error'; }
}

// --- Streak Calculator Functions ---
function calculateStreak() {
    const currentStreakInput = document.getElementById('currentStreak');
    const resultsDiv = document.getElementById('streakResults');
    const currentStreak = parseInt(currentStreakInput.value);
    if (isNaN(currentStreak) || currentStreak < 0) {
        resultsDiv.innerHTML = '<p style="text-align: center;">Sila masukkan nombor streak yang sah.</p>';
        return;
    }
    const milestones = [100, 200, 300, 400, 500];
    const today = new Date();
    let resultsHTML = '';
    milestones.forEach(milestone => {
        if (currentStreak >= milestone) {
            resultsHTML += `<div class="streak-result-card achieved"><div class="milestone-number">${milestone}</div><div class="milestone-details"><span class="date">Tahniah! Anda telah melepasi</span><span class="days-remaining">${milestone} hari streak</span></div></div>`;
        } else {
            const daysNeeded = milestone - currentStreak;
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + daysNeeded);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = futureDate.toLocaleDateString('ms-MY', options);
            resultsHTML += `<div class="streak-result-card"><div class="milestone-number">${milestone}</div><div class="milestone-details"><span class="date">${formattedDate}</span><span class="days-remaining">${daysNeeded} hari lagi</span></div></div>`;
        }
    });
    resultsDiv.innerHTML = resultsHTML;
}
