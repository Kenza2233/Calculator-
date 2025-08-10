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
    // Replace constants immediately for better user experience
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
    if (n < 0) return NaN; // Factorial is not defined for negative numbers
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
        // --- Pre-processing the expression ---

        // Replace user-friendly symbols and functions with Math object equivalents
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

        // Handle factorial (e.g., "5!")
        processedExpr = processedExpr.replace(/(\d+)!/g, (match, number) => {
            return `factorial(${number})`;
        });

        // Handle percentage (e.g., "10%") -> becomes (10/100)
        processedExpr = processedExpr.replace(/(\d+(\.\d+)?)%/g, (match, number) => {
            return `(${number}/100)`;
        });

        // --- Safer evaluation using Function constructor ---
        // The 'factorial' function must be available in the scope
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
