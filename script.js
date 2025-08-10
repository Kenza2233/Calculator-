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
