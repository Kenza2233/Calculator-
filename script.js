document.addEventListener('DOMContentLoaded', function () {
    // --- Main Navigation ---
    const navCalculator = document.getElementById('nav-calculator');
    const navStreak = document.getElementById('nav-streak');
    const calculatorSection = document.getElementById('calculator-section');
    const streakSection = document.getElementById('streak-calculator-section');
    const navSlider = document.querySelector('.nav-slider');

    function updateNavSlider() {
        const activeButton = document.querySelector('.main-nav button.active');
        if (activeButton) {
            navSlider.style.width = `${activeButton.offsetWidth}px`;
            navSlider.style.left = `${activeButton.offsetLeft}px`;
        }
    }

    navCalculator.addEventListener('click', () => {
        calculatorSection.classList.remove('is-hidden');
        streakSection.classList.add('is-hidden');
        navCalculator.classList.add('active');
        navStreak.classList.remove('active');
        updateNavSlider();
    });

    navStreak.addEventListener('click', () => {
        streakSection.classList.remove('is-hidden');
        calculatorSection.classList.add('is-hidden');
        navStreak.classList.add('active');
        navCalculator.classList.remove('active');
        updateNavSlider();
    });

    // --- Scientific Mode Toggle ---
    const sciToggleButton = document.getElementById('sci-toggle');
    const calculatorElement = document.querySelector('.calculator');

    sciToggleButton.addEventListener('click', () => {
        calculatorElement.classList.toggle('scientific-mode-active');
    });


    // --- Theme Selector ---
    const themeSelector = document.querySelector('.theme-selector');
    themeSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('theme-button')) {
            const gradient = e.target.dataset.gradient;
            document.body.style.background = gradient;
        }
    });

    // --- Initial Setup ---
    updateNavSlider();
    if (!streakSection.classList.contains('active')) {
        streakSection.classList.add('is-hidden');
    }
});

function display(val) {
    if (val === 'PI') {
        document.getElementById('result').value += Math.PI;
    } else if (val === 'E') {
        document.getElementById('result').value += Math.E;
    } else {
        document.getElementById('result').value += val;
    }
}

function clearScreen() {
    document.getElementById('result').value = '';
}

function del() {
    let x = document.getElementById('result').value;
    document.getElementById('result').value = x.slice(0, -1);
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calculate() {
    let expression = document.getElementById('result').value;

    try {
        let processedExpr = expression
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/\^/g, '**')
            .replace(/PI/g, 'Math.PI')
            .replace(/E/g, 'Math.E');

        processedExpr = processedExpr.replace(/(\d+)!/g, (match, number) => `factorial(${number})`);
        processedExpr = processedExpr.replace(/(\d+(\.\d+)?)%/g, (match, number) => `(${number}/100)`);

        const calculateFunction = new Function('factorial', `return ${processedExpr}`);
        const result = calculateFunction(factorial);

        if (isNaN(result) || !isFinite(result)) {
            document.getElementById('result').value = 'Error';
        } else {
            document.getElementById('result').value = result;
        }

    } catch (e) {
        document.getElementById('result').value = 'Error';
    }
}

function calculateStreak() {
    const currentStreakInput = document.getElementById('currentStreak');
    const resultsDiv = document.getElementById('streakResults');

    const currentStreak = parseInt(currentStreakInput.value);

    if (isNaN(currentStreak) || currentStreak < 0) {
        resultsDiv.innerHTML = '<p>Sila masukkan nombor streak yang sah.</p>';
        return;
    }

    const milestones = [100, 200, 300, 400, 500];
    const today = new Date();
    let resultsHTML = '';

    milestones.forEach(milestone => {
        if (currentStreak >= milestone) {
            resultsHTML += `<p>Anda telah melepasi ${milestone} hari streak!</p>`;
        } else {
            const daysNeeded = milestone - currentStreak;
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + daysNeeded);

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = futureDate.toLocaleDateString('ms-MY', options);

            resultsHTML += `<p>Anda akan capai <strong>${milestone}</strong> hari streak pada: <strong>${formattedDate}</strong> (${daysNeeded} hari lagi)</p>`;
        }
    });

    resultsDiv.innerHTML = resultsHTML;
}
