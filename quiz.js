// Correct answers for the 10 questions
const answers = {
    q1: ["html"],
    q2: ["url"],
    q3: ["b"],
    q4: ["a"],
    q5: ["c"],
    q6: ["a", "b", "c"],
    q7: ["b"],
    q8: ["a"],
    q9: ["c"],
    q10: ["b"]
};

// Correct answers shown after submitting
const correctAnswers = [
    "HTML",
    "URL",
    "Display websites",
    "Rendering engine",
    "HTTP",
    "Bookmarks, Tabs, Browsing history",
    "JavaScript",
    "Storing reusable website resources",
    "Find IP addresses for domain names",
    "Encrypted communication"
];

// Get the HTML elements
const form = document.getElementById("quizForm");
const timer = document.getElementById("timer");
const results = document.getElementById("results");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");

let startTime;
let timerInterval;
let submitted = false;

// Start the 10-minute timer
function startTimer() {
    clearInterval(timerInterval);

    startTime = Date.now();
    submitted = false;
    timer.textContent = "Time Left: 10:00";

    timerInterval = setInterval(function() {
        let elapsed = Math.floor(
            (Date.now() - startTime) / 1000
        );

        let remaining = Math.max(0, 600 - elapsed);
        let minutes = Math.floor(remaining / 60);
        let seconds = remaining % 60;

        timer.textContent = "Time Left: " +
            minutes + ":" +
            String(seconds).padStart(2, "0");

        // Automatically submit when time runs out
        if (remaining === 0) {
            submitQuiz();
        }
    }, 250);
}

// Check the answers and calculate the score
function submitQuiz() {
    if (submitted) return;

    submitted = true;
    clearInterval(timerInterval);

    let score = 0;
    let details = "";

    for (let i = 1; i <= 10; i++) {
        let question = "q" + i;
        let selected = [];

        // Get the answers for fill-in questions
        if (i <= 2) {
            let input = form.elements[question];

            selected = [
                input.value.trim().toLowerCase()
            ];
        } else {
            // Get selected radio buttons or checkboxes
            selected = Array.from(
                form.querySelectorAll(
                    'input[name="' + question + '"]:checked'
                )
            ).map(input => input.value);
        }

        let expected = answers[question];

        // Check if all answers match
        let correct =
            selected.length === expected.length &&
            selected.every(value => expected.includes(value));

        if (correct) {
            score++;
        }

        // Create results for each question
        details += `
            <div class="result-item ${correct ? "correct" : "incorrect"}">
                <h3>Question ${i}</h3>
                <p>
                    Result:
                    <strong>${correct ? "Correct" : "Incorrect"}</strong>
                </p>
                <p>Score: ${correct ? 1 : 0}/1</p>
                <p>Correct Answer: ${correctAnswers[i - 1]}</p>
            </div>
        `;
    }

    // Calculate time spent
    let timeSpent = Math.min(
        600,
        Math.floor((Date.now() - startTime) / 1000)
    );

    let minutes = Math.floor(timeSpent / 60);
    let seconds = timeSpent % 60;

    // Passing score is 7 out of 10
    let passed = score >= 7;

    // Display final results
    results.innerHTML = `
        <h2>Quiz Results</h2>

        <h3 class="${passed ? "pass" : "fail"}">
            ${passed ? "PASS" : "FAIL"}
        </h3>

        <p><strong>Total Score:</strong> ${score}/10</p>
        <p><strong>Percentage:</strong> ${score * 10}%</p>
        <p>
            <strong>Time Spent:</strong>
            ${minutes} minutes ${seconds} seconds
        </p>

        <h2>Individual Question Results</h2>
        ${details}
    `;

    results.hidden = false;

    // Disable answers after submission
    form.querySelectorAll("input").forEach(function(input) {
        input.disabled = true;
    });

    submitBtn.disabled = true;

    // Scroll to the results
    results.scrollIntoView({ behavior: "smooth" });
}

// Submit button event
form.addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});

// Reset button event
resetBtn.addEventListener("click", function() {
    clearInterval(timerInterval);

    // Clear all answers
    form.reset();

    // Clear previous results
    results.innerHTML = "";
    results.hidden = true;

    // Enable all inputs again
    form.querySelectorAll("input").forEach(function(input) {
        input.disabled = false;
    });

    submitBtn.disabled = false;

    // Restart the timer
    startTimer();
});

// Start the timer when the page loads
startTimer();
