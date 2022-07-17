const question = document.querySelector('#question');
const answers = Array.from(document.querySelectorAll('.answer'));
const questionCounterText = document.querySelector('#questionCounter');
const scoreText = document.querySelector('#score');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 20;

let questions = [];
fetch(
        'https://opentdb.com/api.php?amount=20&category=9&type=multiple'
    )
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['answer' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {

    if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {
        return window.location.assign("end.html");
    }

    questionCounter++;
    if (questionCounterText) {
        questionCounterText.innerHTML = `${questionCounter}/${MAX_QUESTIONS}`;
    }

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    if (question) {
        question.innerHTML = currentQuestion.question;
    }

    answers.forEach(answer => {
        const number = answer.dataset['number'];
        if (answer) {
            answer.innerHTML = currentQuestion['answer' + number];
        }
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

answers.forEach(answer => {
    answer.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedAnswer = e.target;
        const selectedCorrectAnswer = selectedAnswer.dataset["number"];

        const classToApply =
            selectedCorrectAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        getNewQuestion();
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
    localStorage.setItem('mostRecentScore', score);
};