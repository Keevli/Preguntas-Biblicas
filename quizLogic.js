const fadeOverlay = document.querySelector(".fade-overlay");
const quizContainer = document.querySelector(".quiz-container");
const preguntaText = document.getElementById("preguntaText");
const questionDiv = document.getElementById("question");
const optionsDiv = document.querySelector(".options");
const optionButtons = Array.from(document.querySelectorAll(".option-btn"));
const startBtn = document.getElementById("startBtn");
const instructionsOverlay = document.getElementById("instructionsOverlay");

const clickSound = new Audio('ClickButton.mp3');
const quizSound = new Audio('OnePlayfullAnswer.wav');
const CorrectSound = new Audio('CorrectSound.mp3');
const DisSound = new Audio('DisSound.mp3');

const countdownDiv = document.getElementById("countdown");

let questionTimer; // store the setInterval reference
let currentQuestionIndex = 0;
let questions = [];
let correctAnswersCount = 0;

// 20 Bible questions
const questionsByLevel = [
    { question: "¿Quién construyó el arca?", options: ["Moisés", "Noé", "Abraham"], answer: 1 },
    { question: "¿Quién fue el primer hombre?", options: ["Adán", "Caín", "Abel"], answer: 0 },
    { question: "¿Qué fruta comió Eva?", options: ["Manzana", "Higo", "Fruta prohibida"], answer: 2 },
    { question: "¿Quién fue lanzado al foso de los leones?", options: ["Daniel", "José", "David"], answer: 0 },
    { question: "¿Cuántos días y noches llovió en el diluvio?", options: ["30", "40", "50"], answer: 1 },
    { question: "¿Quién recibió los 10 mandamientos?", options: ["Moisés", "Josué", "Elías"], answer: 0 },
    { question: "¿Qué profeta fue tragado por un gran pez?", options: ["Jonás", "Isaías", "Jeremías"], answer: 0 },
    { question: "¿Dónde nació Jesús?", options: ["Nazaret", "Belén", "Jerusalén"], answer: 1 },
    { question: "¿Quién de estos personajes interpretó los sueños de Faraón?", options: ["José", "Moisés", "Daniel"], answer: 0 },
    { question: "¿Qué hizo David contra Goliat?", options: ["Lo ignoró", "Lo enfrentó", "Huyó"], answer: 1 },
    { question: "¿Quién fue vendido por sus hermanos?", options: ["José", "Moisés", "David"], answer: 0 },
    { question: "¿Qué ciudad fue destruida por fuego y azufre?", options: ["Sodoma", "Jericó", "Nínive"], answer: 0 },
    { question: "¿Quién fue el apóstol que negó a Jesús tres veces?", options: ["Pedro", "Juan", "Tomás"], answer: 0 },
    { question: "¿Cuántos discípulos tenía Jesús?", options: ["10", "12", "14"], answer: 1 },
    { question: "¿Dónde oró Jesús antes de ser arrestado?", options: ["Getsemaní", "Belén", "Nazaret"], answer: 0 },
    { question: "¿Qué río cruzó Israel para entrar en la Tierra Prometida?", options: ["Éufrates", "Nilo", "Jordán"], answer: 2 },
    { question: "¿Quién escribió la mayoría de las cartas del Nuevo Testamento?", options: ["Pedro", "Pablo", "Juan"], answer: 1 },
    { question: "¿Cuál es el último libro de la Biblia?", options: ["Apocalipsis", "Judas", "Hechos"], answer: 0 },
    { question: "¿Cuál personaje fue conocido por su paciencia?", options: ["Job", "Jonás", "Moisés"], answer: 0 },
    { question: "¿Quién fue la madre de Samuel?", options: ["Ana", "María", "Sara"], answer: 0 },
    { question: "¿Cuál es el primer milagro de Jesús?", options: ["Sanar a un ciego", "Convertir agua en vino", "Calmar una tormenta"], answer: 1 },
    { question: "¿Qué rey era famoso por su sabiduría?", options: ["David", "Salomón", "Saúl"], answer: 1 },
    { question: "¿Quién traicionó a Jesús por 30 piezas de plata?", options: ["Pedro", "Judas", "Tomás"], answer: 1 },
    { question: "¿Quién recibió la visión del valle de huesos secos?", options: ["Ezequiel", "Isaías", "Jeremías"], answer: 0 },
    { question: "¿Qué profeta desafió a los profetas de Baal?", options: ["Elías", "Isaías", "Jeremías"], answer: 0 },
    { question: "¿Qué discípulo dudó de la resurrección de Jesús hasta ver las heridas?", options: ["Tomás", "Pedro", "Juan"], answer: 0 },
    { question: "¿Quién fue salvado de un asesinato en Egipto, cuando era niño?", options: ["Moisés", "Jesús", "José"], answer: 1 },
    { question: "¿Quién ayudó a Jesús a cargar la cruz?", options: ["Simón de Cirene", "Pedro", "Juan"], answer: 0 },
    { question: "¿Cuántos panes y peces alimentaron a 5000 personas?", options: ["2 panes y 5 peces", "5 panes y 2 peces", "7 panes y 3 peces"], answer: 1 },
    { question: "¿Qué mujer se convirtió en sal por desobedecer a Dios?", options: ["La esposa de Jacob", "La esposa de Lot", "La esposa de Moises"], answer: 1 },
    { question: "¿Cuál fue el sueño de José, que molestó a sus hermanos?", options: ["Que se inclinaban ante él", "Que él era rey", "Que tenía alas"], answer: 0 },
    { question: "¿Quién escribió el libro de Apocalipsis?", options: ["Pedro", "Juan", "Pablo"], answer: 1 },
    { question: "¿Cuál profeta fue llevado al cielo en un carro de fuego?", options: ["Elías", "Enoc", "Moisés"], answer: 0 },
    { question: "¿Cuál fue el río que se convirtió en sangre por medio de Moisés?", options: ["Nilo", "Jordán", "Éufrates"], answer: 0 },
    { question: "¿Quién fue la esposa de Abraham?", options: ["Sara", "Rebeca", "Raquel"], answer: 0 },
    { question: "¿Quién construyó el templo en Jerusalén?", options: ["David", "Salomón", "Saúl"], answer: 1 },
    { question: "¿Qué animal habló a Balaam?", options: ["Un león", "Una serpiente", "Un burro"], answer: 2 },
    { question: "¿Cuántos días estuvo Jesús en el desierto?", options: ["30", "40", "50"], answer: 1 },
    { question: "¿Qué mar se abrió para que pasara Moisés y su pueblo?", options: ["Mar Rojo", "Mar Muerto", "Mar de Galilea"], answer: 0 },
    { question: "¿Quién subió a un árbol para ver a Jesús?", options: ["Bartimeo", "Zaqueo", "Nicodemo"], answer: 1 },
    { question: "¿Qué hizo Jesús cuando vio una venta en el templo?", options: ["Les habló con calma", "Los echó fuera", "Se fue del templo"], answer: 1 },
    { question: "¿Qué cayó del cielo para alimentar a los israelitas en el desierto?", options: ["Pan", "Maná", "Codornices"], answer: 1 },
    { question: "¿Qué hizo Caín a su hermano Abel?", options: ["Lo enseño", "Lo ignoró", "Lo mató"], answer: 2 },
    { question: "¿Qué nombre nuevo recibió Saulo después de convertirse?", options: ["Pedro", "Juan", "Pablo"], answer: 2 },
    { question: "¿Qué mujer escondió a los espías israelitas en Jericó?", options: ["Rut", "Ester", "Rahab"], answer: 2 },
    { question: "¿Qué día descansó Dios, después de crear el mundo?", options: ["El sexto día", "El séptimo día", "El octavo día"], answer: 1 },
    { question: "¿Cómo murió Goliat?", options: ["De una piedra", "De una lanza", "De una caída"], answer: 0 },
    { question: "¿Qué mujer fue suegra de Rut?", options: ["Rebeca", "Noemí", "Sara"], answer: 1 },
    { question: "¿Quién fue el rey antes de David?", options: ["Saúl", "Salomón", "Samuel"], answer: 0 },
    { question: "¿Qué apóstol caminó sobre el agua con Jesús?", options: ["Juan", "Pedro", "Santiago"], answer: 1 },
    { question: "¿Cuántos días estuvo Jesús muerto antes de resucitar?", options: ["1", "2", "3"], answer: 2 },
    { question: "¿Qué apóstol era recaudador de impuestos?", options: ["Mateo", "Lucas", "Andrés"], answer: 0 },
    { question: "¿Cómo se llamaba el padre de Juan el Bautista?", options: ["Zacarías", "José", "Simón"], answer: 0 },
    { question: "¿Quién interpretó el sueño del rey Nabucodonosor sobre una estatua?", options: ["Daniel", "José", "Ezequiel"], answer: 0 },
    { question: "¿Cómo se llamaba la madre de Jesús?", options: ["María", "Elisabet", "Marta"], answer: 0 },
    { question: "¿Quién ayudó a los israelitas a cruzar el Jordán después de Moisés?", options: ["Josué", "Aarón", "Caleb"], answer: 0 },
    { question: "¿Qué le paso a Zacarías por no creer el anuncio de un ángel?", options: ["Se quedó ciego", "Se quedó mudo", "Se murió"], answer: 1 },
    { question: "¿Qué joven mató a un león y un oso cuidando sus ovejas?", options: ["Sansón", "David", "Gedeón"], answer: 1 },
    { question: "¿Qué instrumento musical tocaba David?", options: ["Arpa", "Flauta", "Tambor"], answer: 0 },
    { question: "¿Cuál fue la señal del pacto de Dios con Noé?", options: ["Una paloma", "El arco iris", "Las nubes"], answer: 1 },
    { question: "¿Quién fue la reina que arriesgó su vida por su pueblo?", options: ["Ester", "Rut", "Débora"], answer: 0 },
    { question: "¿Cuál fue el nombre del jardín donde vivieron Adán y Eva?", options: ["Edén", "Getsemaní", "Hebrón"], answer: 0 },
];

// 🎲 Get 5 random questions (Fisher–Yates)
function getRandomQuestions() {
    const shuffled = [...questionsByLevel];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 5);
}
questions = getRandomQuestions();

window.addEventListener("load", () => {
    const instructionsOverlay = document.querySelector(".instructions-overlay");

    // Fade in instructions
    setTimeout(() => {
        instructionsOverlay.style.opacity = 1;
    }, 200); // small delay to let white overlay render
});

startBtn.addEventListener("click", () => {
    const instructionsOverlay = document.querySelector(".instructions-overlay");
    fadeOverlay.style.opacity = 1; 
    fadeOverlay.style.transition = "opacity 1s ease";

    // trigger fade
    setTimeout(() => { fadeOverlay.style.opacity = 0; }, 50);

    instructionsOverlay.style.transition = "opacity 0.8s";
    instructionsOverlay.style.opacity = 0;

    setTimeout(() => {
        instructionsOverlay.style.display = "none";
        fadeOverlay.style.display = "none";  // hide completely after fade
        quizSound.volume = 1;
        quizSound.play();
        showQuestion();
    }, 1000);
});


// Function to fade out and stop audio
function fadeOutAudio(audio, duration = 2000) {
    const step = 50;
    const fadeSteps = duration / step;
    const volumeStep = audio.volume / fadeSteps;

    const fadeInterval = setInterval(() => {
        if (audio.volume > volumeStep) {
            audio.volume -= volumeStep;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeInterval);
        }
    }, step);
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishQuiz();
        return;
    }

    clickSound.pause();
    clickSound.currentTime = 0;

    const qData = questions[currentQuestionIndex];

    // Show PreguntaText
    preguntaText.textContent = `Pregunta ${currentQuestionIndex + 1}`;
    preguntaText.style.opacity = 1;
    preguntaText.style.animation = "bounceIn 1s forwards";
    countdownDiv.classList.add("hidden");

    // Hide question and options for now
    questionDiv.classList.add("hidden");
    optionsDiv.classList.add("hidden");

    // Reset option buttons
    optionButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = "rgb(220,180,50)";
        btn.style.opacity = 1;
        btn.classList.remove("no-hover");
    });

    // Delay before showing question & options so PreguntaText animates first
    setTimeout(() => {
        // Show question
        questionDiv.textContent = qData.question;
        questionDiv.classList.remove("hidden");
        questionDiv.style.opacity = 1;
        questionDiv.style.animation = "slideUpFade 0.8s forwards";

        // Shuffle options
        const optionsWithIndex = qData.options.map((opt, idx) => ({ opt, idx }));
        for (let i = optionsWithIndex.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
        }

        const newCorrectIndex = optionsWithIndex.findIndex(o => o.idx === qData.answer);

        // Show options
        optionButtons.forEach((btn, i) => {
            btn.textContent = optionsWithIndex[i].opt;
            btn.onclick = () => {
                clearInterval(questionTimer); // stop countdown
                clickSound.pause();
                clickSound.currentTime = 0;
                clickSound.play();
                handleAnswer(i, newCorrectIndex);
            };
        });

        optionsDiv.classList.remove("hidden");
        optionsDiv.style.opacity = 1;
        optionsDiv.style.animation = "slideUpFade 0.8s forwards";

        // Start countdown
let timeLeft = 10;
countdownDiv.textContent = timeLeft;
countdownDiv.classList.remove("hidden");  // show it
countdownDiv.style.opacity = 1;

clearInterval(questionTimer);
questionTimer = setInterval(() => {
    timeLeft--;
    countdownDiv.textContent = timeLeft;

    if (timeLeft <= 0) {
    clearInterval(questionTimer);
    handleAnswer(null, newCorrectIndex); // show correct answer

    timeLeft = Math.max(timeLeft, 0);

}

}, 1000);

    }, 800); // delay so PreguntaText animates first
}


function handleAnswer(selectedIdx, correctIdx) {
    optionButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add("no-hover"); 
    });

    if (selectedIdx === null) {
        // Timer ran out, play nothing
    } else if (selectedIdx === correctIdx) {
        correctAnswersCount++;
        optionButtons[selectedIdx].style.backgroundColor = "green";

        // Play correct sound fresh each time
        new Audio('CorrectSound.mp3').play();
    } else {
        optionButtons[selectedIdx].style.backgroundColor = "red";
        optionButtons[correctIdx].style.backgroundColor = "green";

        // Play wrong sound fresh each time
        new Audio('DisSound.mp3').play();
    }

    optionButtons.forEach((btn, idx) => {
        if (idx !== selectedIdx && idx !== correctIdx) btn.style.opacity = 0.5;
    });

    setTimeout(() => nextQuestion(), 1500);
}

function nextQuestion() {
    preguntaText.style.opacity = 0;
    questionDiv.style.opacity = 0;
    optionsDiv.style.opacity = 0;

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 500);
}

function finishQuiz() {
    // Fade out the quiz sound smoothly
    fadeOutAudio(quizSound, 2000);

    // Calculate points
    let pointsEarned = Math.round((correctAnswersCount / 5) * 50);
    if (pointsEarned < 10) pointsEarned = 10;

    // Make sure fadeOverlay covers the screen and is visible
    fadeOverlay.style.display = "block";  
    fadeOverlay.style.position = "fixed";
    fadeOverlay.style.top = 0;
    fadeOverlay.style.left = 0;
    fadeOverlay.style.width = "100%";
    fadeOverlay.style.height = "100%";
    fadeOverlay.style.backgroundColor = "white";
    fadeOverlay.style.zIndex = 2000;
    fadeOverlay.style.opacity = 0;  // start transparent
    fadeOverlay.style.transition = "opacity 1s ease";

    // Trigger the fade
    requestAnimationFrame(() => {
        fadeOverlay.style.opacity = 1;
    });

    // Redirect after fade completes
    setTimeout(() => {
        localStorage.setItem("quizPoints", pointsEarned);
        window.location.href = "quizResults.html";
    }, 2200); // matches transition duration
}
