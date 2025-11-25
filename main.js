// --- Question Pool (20 questions) ---
const questionPool = [
  { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language" },
  { question: "Which language is used for styling web pages?", options: ["HTML", "JQuery", "CSS", "XML"], answer: "CSS" },
  { question: "Which is not a JavaScript framework?", options: ["React", "Angular", "Vue", "Python"], answer: "Python" },
  { question: "Which HTML tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>", "<hyper>"], answer: "<a>" },
  { question: "Which symbol is used for comments in JavaScript?", options: ["//", "/* */", "#", "<!-- -->"], answer: "//" },
  { question: "Which CSS property controls text size?", options: ["font-size", "text-style", "size", "font-weight"], answer: "font-size" },
  { question: "Which company developed JavaScript?", options: ["Microsoft", "Netscape", "Google", "Oracle"], answer: "Netscape" },
  { question: "Which HTML element is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: "<h1>" },
  { question: "Which CSS property changes text color?", options: ["font-color", "color", "text-color", "background-color"], answer: "color" },
  { question: "Which HTML attribute specifies an image source?", options: ["src", "href", "link", "alt"], answer: "src" },
  { question: "Which JavaScript method writes to the console?", options: ["console.log()", "print()", "log()", "write()"], answer: "console.log()" },
  { question: "Which HTML tag creates a line break?", options: ["<break>", "<br>", "<lb>", "<hr>"], answer: "<br>" },
  { question: "Which CSS property sets background color?", options: ["bgcolor", "background-color", "color", "background"], answer: "background-color" },
  { question: "Which HTML element is used for lists with bullets?", options: ["<ul>", "<ol>", "<li>", "<list>"], answer: "<ul>" },
  { question: "Which HTML element is used for numbered lists?", options: ["<ul>", "<ol>", "<li>", "<list>"], answer: "<ol>" },
  { question: "Which JavaScript keyword declares a variable?", options: ["var", "let", "const", "All of the above"], answer: "All of the above" },
  { question: "Which CSS property makes text bold?", options: ["font-weight", "bold", "text-style", "font-bold"], answer: "font-weight" },
  { question: "Which HTML element is used for inserting a horizontal line?", options: ["<line>", "<hr>", "<br>", "<hline>"], answer: "<hr>" },
  { question: "Which HTML attribute provides alternative text for images?", options: ["alt", "src", "title", "href"], answer: "alt" },
  { question: "Which JavaScript operator is used for strict equality?", options: ["==", "===", "=", "!=="], answer: "===" }
];

// --- State ---
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let historyRecords = JSON.parse(localStorage.getItem("quizHistory")) || [];

// --- DOM Elements ---
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const quizScreen = document.getElementById("quiz-screen");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const historyBtn = document.getElementById("history-btn");
const resultContainer = document.getElementById("result");
const feedbackContainer = document.getElementById("feedback-container");
const timerContainer = document.getElementById("timer");
const historyDiv = document.getElementById("history");
const historyList = document.getElementById("history-list");

// --- Start Screen Logic ---
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  startQuiz();
});

// --- Quiz Functions ---
function startQuiz() {
  questions = shuffleArray(questionPool).slice(0, 5); // pick 5 random
  currentQuestionIndex = 0;
  score = 0;
  resultContainer.textContent = "";
  restartBtn.style.display = "none";
  historyBtn.style.display = "none";
  feedbackContainer.textContent = "";
  historyDiv.style.display = "none";

  // ✅ Hide Next button until answer is chosen
  nextBtn.style.display = "none";

  showQuestion();
  startTimer();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionContainer.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}: ${currentQuestion.question}`;

  currentQuestion.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.type = "button";
    button.addEventListener("click", () => selectAnswer(button, currentQuestion.answer));
    optionsContainer.appendChild(button);
  });
}

function resetState() {
  optionsContainer.innerHTML = "";
  feedbackContainer.textContent = "";
  nextBtn.style.display = "none"; // hide Next until answer chosen
}

function selectAnswer(selectedButton, correctAnswer) {
  const options = Array.from(optionsContainer.children);
  options.forEach(button => {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.classList.add("correct");
    }
  });

  if (selectedButton.textContent === correctAnswer) {
    score++;
    feedbackContainer.textContent = "Correct!";
    feedbackContainer.style.color = "limegreen";
  } else {
    selectedButton.classList.add("incorrect");
    feedbackContainer.textContent = `Incorrect! The correct answer is: ${correctAnswer}`;
    feedbackContainer.style.color = "red";
  }

  // ✅ Show Next button only after an answer is selected
  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

restartBtn.addEventListener("click", startQuiz);

function endQuiz() {
  const finalScore = `Your score: ${score} / ${questions.length}`;
  resultContainer.textContent = finalScore;

  // Save score to history
  historyRecords.push(finalScore);
  localStorage.setItem("quizHistory", JSON.stringify(historyRecords));

  // Hide quiz content
  questionContainer.textContent = "";
  optionsContainer.innerHTML = "";
  feedbackContainer.textContent = "";

  // Show only restart + history button
  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  historyBtn.style.display = "inline-block";

  clearInterval(timerInterval);
}

function updateHistory() {
  historyList.innerHTML = "";
  historyRecords.forEach((record, index) => {
    const li = document.createElement("li");
    li.textContent = `Attempt ${index + 1}: ${record}`;
    historyList.appendChild(li);
  });
}

// --- History Button Toggle ---
historyBtn.addEventListener("click", () => {
  if (historyDiv.style.display === "none") {
    updateHistory();
    historyDiv.style.display = "block";
    historyBtn.innerText = "Hide History";
  } else {
    historyDiv.style.display = "none";
    historyBtn.innerText = "Show History";
  }
});

// --- Timer ---
function startTimer() {
  let timeLeft = 60; // seconds
  timerContainer.textContent = `Time: ${timeLeft}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerContainer.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

// --- Utility: shuffle array ---
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}