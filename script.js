let checkButton = document.getElementById("checkButton");
let shuffleButton = document.getElementById("shuffleButton");
let resetButton = document.getElementById("resetButton");
let rapidFireButton = document.getElementById("rapidFireButton");
let testYourselfButton = document.getElementById("testYourselfButton");

let blanks = [];
let availableFields = [];
let revealedAnswers = new Set(); // Tracks revealed answers
let rapidFireRevealed = new Set(); // Tracks answers revealed by Rapid Fire
let checkMode = false; // To track if "Check Answers" has been pressed

// Shuffle Blanks Function: Only blanks 4-6 fields
function shuffleBlanks() {
    resetInteractive();  // Reset all interactive fields

    availableFields = Array.from(document.querySelectorAll("td")).filter(td => !revealedAnswers.has(td));
    
    // Randomly select 4-6 fields to be blanked
    let numBlanks = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
    let randomCells = availableFields.sort(() => Math.random() - 0.5).slice(0, numBlanks);

    randomCells.forEach(cell => {
        cell.innerHTML = `<input type="text" placeholder="____" value="">`; // Fillable by player
        cell.removeAttribute("data-click-revealed"); // Reset Rapid Fire reveal status
        blanks.push(cell);
    });

    checkButton.disabled = false; // Enable the check button
    shuffleButton.disabled = true; // Disable shuffle after one use
    checkMode = false; // Reset check mode
}

// Rapid Fire: Adds more blanks and allows reveal by click
function rapidFire() {
    availableFields = Array.from(document.querySelectorAll("td")).filter(td => !revealedAnswers.has(td) && !rapidFireRevealed.has(td));

    if (availableFields.length > 0) {
        let numBlanks = Math.min(Math.floor(Math.random() * (6 - 4 + 1)) + 4, availableFields.length);
        let randomCells = availableFields.sort(() => Math.random() - 0.5).slice(0, numBlanks);

        randomCells.forEach(cell => {
            cell.innerHTML = `<input type="text" placeholder="____" value="">`; // Allow player to fill blanks
            blanks.push(cell);

            // Mark the cells for Rapid Fire reveal and allow click to reveal only if not previously revealed
            cell.setAttribute("data-click-revealed", "true"); // Mark for Rapid Fire revealing
            cell.addEventListener("click", function() {
                if (cell.getAttribute("data-click-revealed") === "true") { // Only reveal if marked by Rapid Fire
                    revealAnswer(cell);
                }
            });
        });

        rapidFireRevealed.add(...randomCells); // Mark cells as revealed by Rapid Fire
    } else {
        rapidFireButton.disabled = true; // Disable when all fields are blanked
    }

    checkButton.disabled = false;
    resetButton.disabled = false; // Reset button available
}

// Reveal Answer Function: Shows the answer upon clicking (for Rapid Fire)
function revealAnswer(cell) {
    let answer = cell.getAttribute("data-answer");
    cell.innerHTML = answer; // Display the correct answer
    cell.classList.add("correct");
    cell.setAttribute("data-click-revealed", "false"); // Prevent further reveals after clicking
    revealedAnswers.add(cell); // Mark it as revealed
}

// Test Yourself: Make all fields blank but previously revealed ones should remain locked
function testYourself() {
    document.querySelectorAll("td").forEach(cell => {
        if (!revealedAnswers.has(cell)) {
            cell.innerHTML = `<input type="text" value="">`;  // Make fillable
            rapidFireRevealed.delete(cell);  // Allow cell to be reused after rapid fire
            cell.setAttribute("data-click-revealed", "false");  // Disable reveal ability after reset
        } else {
            cell.classList.add("correct");  // Keep revealed answers as locked
        }
    });

    checkButton.disabled = false;
    testYourselfButton.disabled = true;
}

// Check Answers: Validate all player inputs (case-insensitive comparison)
function checkAnswers() {
    document.querySelectorAll("td input").forEach(input => {
        let cell = input.parentElement;
        let userAnswer = input.value.trim().toLowerCase();  // Convert user's answer to lowercase and trim spaces
        let correctAnswer = cell.getAttribute("data-answer").trim().toLowerCase();  // Convert correct answer to lowercase

        if (userAnswer === correctAnswer) {  // Compare case-insensitively
            cell.innerHTML = cell.getAttribute("data-answer");  // Display correct answer with original case
            cell.classList.add("correct");
            revealedAnswers.add(cell); // Mark as revealed
        } else {
            cell.innerHTML = `<input type="text" value="${input.value}" class="incorrect">`;  // Show incorrect answer
            cell.classList.add("incorrect");
        }
    });

    // Switch "Check Answers" to "Show Answers"
    checkButton.innerHTML = "Show Answers";
    checkButton.onclick = showAnswers;
    resetButton.disabled = false; // Enable the reset button
    checkMode = true; // Mark check mode as active
}

// Show Answers: Reveals all correct answers for incorrect entries
function showAnswers() {
    document.querySelectorAll("td input.incorrect").forEach(input => {
        let cell = input.parentElement;
        let correctAnswer = cell.getAttribute("data-answer");
        cell.innerHTML = correctAnswer;
        cell.classList.add("correct");
        revealedAnswers.add(cell); // Mark as revealed
    });

    checkButton.disabled = true; // Disable after answers are revealed
    resetButton.disabled = false;
}

// Reset Game: Fully resets the game to its initial state
function resetGame() {
    document.querySelectorAll("td").forEach(cell => {
        let answer = cell.getAttribute("data-answer");
        cell.innerHTML = answer; // Restore original answers
        cell.classList.remove("correct", "incorrect"); // Reset cell classes
        cell.removeAttribute("data-click-revealed");  // Reset rapid fire reveal state
    });

    blanks = [];
    revealedAnswers.clear(); // Clear all revealed answers
    rapidFireRevealed.clear(); // Clear Rapid Fire revealed answers
    availableFields = [];

    checkButton.innerHTML = "Check Answers"; // Reset button to "Check Answers"
    checkButton.onclick = checkAnswers; // Reset to check functionality
    checkMode = false;

    checkButton.disabled = true;
    shuffleButton.disabled = false;
    rapidFireButton.disabled = false;
    resetButton.disabled = false;
    testYourselfButton.disabled = false;
}

// Resets interactivity so cells don't react unless they should
function resetInteractive() {
    document.querySelectorAll("td").forEach(cell => {
        cell.innerHTML = cell.getAttribute("data-answer");  // Revert to original answers
        cell.classList.remove("correct", "incorrect");

        // Reset rapid fire revealed status so blanks can be reused
        rapidFireRevealed.delete(cell);  // Ensure blank cells are usable again
        cell.removeAttribute("data-click-revealed");  // Remove revealed attribute for reuse
    });
}
