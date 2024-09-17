
let checkButton = document.getElementById("checkButton");
let shuffleButton = document.getElementById("shuffleButton");
let resetButton = document.getElementById("resetButton");

function shuffleBlanks() {
    // Clear any existing blanks and reset inputs
    document.querySelectorAll("td").forEach(cell => {
        let answer = cell.getAttribute("data-answer");
        cell.innerHTML = answer;  // Reset to original answer
        cell.classList.remove("correct", "incorrect");
    });

    // Select all cells except for the header row (first row) to be blanked
    let allCells = Array.from(document.querySelectorAll("table tr td")).filter(input => input.parentElement.rowIndex > 0);

    // Randomly select 4 to 6 cells to be blanks
    let numBlanks = Math.floor(Math.random() * (6 - 4 + 1)) + 4;  // Generates a random number between 4 and 6
    let randomCells = allCells.sort(() => Math.random() - 0.5).slice(0, numBlanks);

    // Make the selected cells blank and editable
    randomCells.forEach(cell => {
        let answer = cell.getAttribute("data-answer");
        cell.innerHTML = `<input type="text" placeholder="____" value="">`;
    });

    // Enable the "Check Answers" button after shuffle
    checkButton.disabled = false;
    shuffleButton.disabled = true;  // Disable shuffle button after one shuffle
}

function checkAnswers() {
    document.querySelectorAll("td input").forEach(input => {
        let cell = input.parentElement;
        let userAnswer = input.value;
        let correctAnswer = cell.getAttribute("data-answer");

        if (userAnswer === correctAnswer) {
            cell.innerHTML = correctAnswer;
            cell.classList.add("correct");
            cell.classList.remove("incorrect");
        } else {
            cell.innerHTML = `<input type="text" value="${userAnswer}" class="incorrect">`;
            cell.classList.add("incorrect");
        }
    });

    // Change the button to "Show Answers"
    checkButton.innerHTML = "Show Answers";
    checkButton.onclick = showAnswers;
    resetButton.disabled = false;
}

function showAnswers() {
    document.querySelectorAll("td input.incorrect").forEach(input => {
        let cell = input.parentElement;
        let correctAnswer = cell.getAttribute("data-answer");
        cell.innerHTML = correctAnswer;
        cell.classList.add("correct");
        cell.classList.remove("incorrect");
    });

    // Disable further changes
    checkButton.disabled = true;
    resetButton.disabled = false;  // Enable reset after answers are shown
}

function resetGame() {
    // Re-enable the shuffle button and reset the game
    shuffleButton.disabled = false;
    checkButton.innerHTML = "Check Answers";
    checkButton.onclick = checkAnswers;
    checkButton.disabled = true;
    resetButton.disabled = true;

    // Reset all cells to their original values
    document.querySelectorAll("td").forEach(cell => {
        let answer = cell.getAttribute("data-answer");
        cell.innerHTML = answer;
        cell.classList.remove("correct", "incorrect");
    });
}
