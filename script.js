document.addEventListener('DOMContentLoaded', function () {
    const navCalculator = document.getElementById('nav-calculator');
    const navStreak = document.getElementById('nav-streak');
    const calculatorSection = document.getElementById('calculator-section');
    const streakSection = document.getElementById('streak-calculator-section');

    navCalculator.addEventListener('click', () => {
        calculatorSection.classList.remove('hidden');
        streakSection.classList.add('hidden');
        navCalculator.classList.add('active');
        navStreak.classList.remove('active');
    });

    navStreak.addEventListener('click', () => {
        streakSection.classList.remove('hidden');
        calculatorSection.classList.add('hidden');
        navStreak.classList.add('active');
        navCalculator.classList.remove('active');
    });
});

function display(val) {
    document.getElementById('result').value += val;
}

function calculate() {
    let x = document.getElementById('result').value;
    try {
        let y = eval(x);
        document.getElementById('result').value = y;
    } catch (e) {
        document.getElementById('result').value = 'Error';
    }
}

function clearScreen() {
    document.getElementById('result').value = '';
}

function del() {
    let x = document.getElementById('result').value;
    document.getElementById('result').value = x.slice(0, -1);
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
