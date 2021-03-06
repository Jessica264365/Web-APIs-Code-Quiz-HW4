// Variables for Coding Quiz
let quizDescript = document.getElementById("quizDescipt");
let startBtn = document.getElementById("startBtn");
const questionContEl = document.getElementById("ques-container");
let randomQues;
let currentQuestionIndex;
const questionEl = document.getElementById("question");
const answerBtnEl = document.getElementById("answer-btns");
let timerStart = parseInt(46);
let timerInterval;
let timer = document.getElementById("timer");
let scoreForm = document.getElementById("scoreForm");
let quizDone = false;
let submitBtn = document.getElementById("submitBtn");
let userScore = document.getElementById("userScore");
let highScoreEl = document.getElementById("highscores");
let highscoreListEl = document.getElementById("scoreList");
let highScoreLink = document.getElementById("highScoreList");
let nav = document.getElementById("nav");

// Questions for Quiz
let questions = [
  {
    question: "What does () => stand for in JavaScript",
    answers: [
      { text: "A function", correct: true },
      { text: "A boolean", correct: false },
      { text: "An if statement", correct: false },
      { text: "An empty array", correct: false },
    ],
  },
  {
    question: "Which is NOT an event listener?",
    answers: [
      { text: "mouseover", correct: false },
      { text: "click", correct: false },
      { text: "keyclick", correct: true },
      { text: "submit", correct: false },
    ],
  },
  {
    question: "What is sometimes used as a shortcut for an if statement?",
    answers: [
      { text: "A ternary operator", correct: true },
      { text: "The spread operator", correct: false },
      { text: "There isn't one", correct: false },
      { text: "object literal notation", correct: false },
    ],
  },
  {
    question: "What does Array.from(); do?",
    answers: [
      { text: "Creates an array from a iterable object", correct: true },
      { text: "Creates an array from a string", correct: false },
      { text: "Creates an array from a list of variables", correct: false },
      { text: "Combines arrays", correct: false },
    ],
  },
  {
    question: "Which company developed JavaScript?",
    answers: [
      { text: "Netscape", correct: true },
      { text: "TECLA", correct: false },
      { text: "Digitegy", correct: false },
      { text: "Computer Usage Company", correct: false },
    ],
  },
];

// Event listeners for startBtn
startBtn.addEventListener("click", startQuiz);
startBtn.addEventListener("click", startTimer);

// Timer is started when startBtn is clicked
function startTimer() {
  if (!quizDone) {
    timerInterval = setInterval(function () {
      timerStart--;
      timer.textContent = "Timer: " + timerStart;

      if (
        timerStart === 0 &&
        confirm("Out of time! Would you like to try again?") === true
      ) {
        clearInterval(timerInterval);
        location.reload("./quiz.html");
      }
    }, 1000);
  }
}

// Quiz is started when startBtn is clicked
function startQuiz() {
  startBtn.classList.add("hide");
  // Questions are randomly chosen
  randomQues = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  quizDescript.classList.add("hide");
  questionContEl.classList.remove("hide");

  nextQuestion();
}

// The next question is displayed from the current random question index
function nextQuestion() {
  resetBtn();
  displayQues(randomQues[currentQuestionIndex]);
}

// Buttons are made for each possible answer and the question is displayed
function displayQues(question) {
  questionEl.innerText = question.question;
  question.answers.forEach(function (answer) {
    let button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.setAttribute("data-correct", true);
    }
    button.addEventListener("click", selectedAns);
    answerBtnEl.appendChild(button);
  });
}

// Buttons are reset for the next question
function resetBtn() {
  while (answerBtnEl.firstChild) {
    answerBtnEl.removeChild(answerBtnEl.firstChild);
  }
}

// Answer is selected. If it's correct the timer stays the same
function selectedAns(event) {
  let selectedAns = event.target;
  // If the answer is wrong 10 seconds is deducted from the timer
  let rightAns = selectedAns.dataset.correct;
  if (!rightAns) {
    timerStart = timerStart - 10;
  }

  Array.from(answerBtnEl.children).forEach(function (button) {
    btnClass(button, button.dataset.correct);
  });

  if (randomQues.length > currentQuestionIndex + 1) {
    currentQuestionIndex++;
    setTimeout(() => {
      nextQuestion();
    }, 500);
  } else if (
    confirm("Game over! Would you like to record your score?") === true
  ) {
    scoreForm.classList.remove("hide");
    questionContEl.classList.add("hide");
    clearInterval(timerInterval);

    // When all the questions are answered the user is prompted to record their score

    submitBtn.addEventListener("click", function (event) {
      event.preventDefault();
      highScoreEl.classList.remove("hide");
      scoreForm.classList.add("hide");
      nav.classList.add("hide");

      let finalScore = {
        user: userScore.value.trim(),
        score: timerStart,
      };
      // if the user does not put in a name an alert is displayed
      if (finalScore === "") {
        alert("You must enter a name!");
      }
      // The scores are saved in local storage
      let scoreArray = localStorage.getItem("finalScore")
        ? JSON.parse(localStorage.getItem("finalScore"))
        : [];
      scoreArray.push(finalScore);
      localStorage.setItem("finalScore", JSON.stringify(scoreArray));

      let showScores = JSON.parse(localStorage.getItem("finalScore"));
      let highScoreListMaker = function (scoreArray) {
        let li = document.createElement("li");
        li.textContent = scoreArray.user + ":  " + scoreArray.score;
        highscoreListEl.appendChild(li);
      };
      // A list is made from the stored scores
      showScores.forEach((scoreArray) => {
        highScoreListMaker(scoreArray);
      });
      // A restart button for the quiz is added
      let restartQuizBtn = document.createElement("button");
      highScoreEl.appendChild(restartQuizBtn);
      restartQuizBtn.textContent = "Restart Quiz";
      restartQuizBtn.addEventListener("click", function () {
        location.reload("./quiz.html");
      });
    });
  } else {
    location.reload("./quiz.html");
  }
}
// If the link to "Highscores" is clicked, the highscores are displayed to the user
highScoreLink.addEventListener("click", () => {
  highScoreEl.classList.remove("hide");
  startBtn.classList.add("hide");
  quizDescript.classList.add("hide");
  questionContEl.classList.add("hide");
  answerBtnEl.classList.add("hide");
  nav.classList.add("hide");
  clearInterval(timerInterval);
  let scoreArray = localStorage.getItem("finalScore")
    ? JSON.parse(localStorage.getItem("finalScore"))
    : [];
  let showScores = JSON.parse(localStorage.getItem("finalScore"));
  let highScoreListMaker = function (scoreArray) {
    let li = document.createElement("li");
    li.textContent = scoreArray.user + ":  " + scoreArray.score;
    highscoreListEl.appendChild(li);
  };

  showScores.forEach((scoreArray) => {
    highScoreListMaker(scoreArray);
  });
  // A button is created for the user to return to the quiz
  let returnToQuizBtn = document.createElement("button");
  highScoreEl.appendChild(returnToQuizBtn);
  returnToQuizBtn.textContent = "Return to Quiz";
  returnToQuizBtn.addEventListener("click", function () {
    location.reload("./quiz.html");
  });
});

// A class is added depending on if the answer was correct or wrong
function btnClass(element, correct) {
  clearBtnClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}
// The classes are cleared for the next set of possible answers
function clearBtnClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}
