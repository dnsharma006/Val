const wordDisplay = document.getElementById("word-display");
const screens = document.querySelectorAll(".screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const gameTitle = document.getElementById("game-title");
const gameArea = document.getElementById("game-area");
const finalMessage = document.getElementById("final-message");

const words = ["Will", "you", "be", "my", "valentine?"];
const gameTitles = [
    "Catch My Hearts 💕",
    "Love Memory Match 💌",
    "How Well Do You Know Me? 💭",
    "Touch me 6 times baby;)...I mean My Heart 💓",
    "Game 5"
];

let currentGame = 0;
let unlockedWords = [];

function showScreen(id) {
    screens.forEach(screen => screen.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

startBtn.addEventListener("click", () => {
    currentGame = 0;
    unlockedWords = [];
    loadGame();
    showScreen("game-screen");
});

nextBtn.addEventListener("click", () => {
    currentGame++;
    nextBtn.classList.add("hidden");

    if (currentGame < words.length) {
        loadGame();
    } else {
        showFinalMessage();
    }
});

function loadGame() {
    gameArea.innerHTML = "";

    // Set correct title
    gameTitle.textContent = gameTitles[currentGame];

    if (currentGame === 0) {
        startHeartGame();
    }
    else if (currentGame === 1) {
        startMemoryGame();
    }
    else if (currentGame === 2) {
        startQuizGame();
    }
    else if (currentGame === 3) {
        startReactionGame();
    }
    else if (currentGame === 4) {
        startFinalGame();
    }
    else {
        // Placeholder for future games
        const btn = document.createElement("button");
        btn.textContent = "Click to Win ❤️";
        btn.addEventListener("click", unlockWord);
        gameArea.appendChild(btn);
    }
}



function unlockWord() {
    const wordToAdd = words[currentGame];

    if (!unlockedWords.includes(wordToAdd)) {
        unlockedWords.push(wordToAdd);
    }
    // Update persistent sentence display
    wordDisplay.textContent = unlockedWords.join(" ");

    nextBtn.classList.remove("hidden");
}


function showFinalMessage() {
    showScreen("final-screen");
    finalMessage.textContent = unlockedWords.join(" ");
    finalMessage.classList.add("glow-title");  // <-- add the glow styling
}


function startHeartGame() {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 350;
    canvas.height = 500;

    gameArea.appendChild(canvas);

    let basket = {
        x: canvas.width / 2 - 40,
        y: canvas.height - 40,
        width: 80,
        height: 20
    };

    let hearts = [];
    let score = 0;
    const targetScore = 10;


    function spawnHeart() {
        hearts.push({
            x: Math.random() * (canvas.width - 20),
            y: -20,
            size: 20,
            speed: 2 + Math.random() * 2
        });
    }
    function drawHeart(x, y, size) {
        ctx.save();

        ctx.fillStyle = "#ff4d80";
        ctx.shadowColor = "#ff4d80";
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(x + size / 2, y + size);
        ctx.bezierCurveTo(x + size * 1.2, y + size * 0.6, x + size * 0.8, y - size * 0.2, x + size / 2, y + size * 0.3);
        ctx.bezierCurveTo(x + size * 0.2, y - size * 0.2, x - size * 0.2, y + size * 0.6, x + size / 2, y + size);
        ctx.fill();

        ctx.restore();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw basket
        ctx.fillStyle = "#ff2e63";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

        // Draw hearts
        ctx.fillStyle = "pink";
        hearts.forEach((heart, index) => {
            heart.y += heart.speed;

            drawHeart(heart.x, heart.y, heart.size);


            // Collision detection
            if (
                heart.y + heart.size > basket.y &&
                heart.x < basket.x + basket.width &&
                heart.x + heart.size > basket.x
            ) {
                hearts.splice(index, 1);
                score++;
            }

            // Remove if off screen
            if (heart.y > canvas.height) {
                hearts.splice(index, 1);
            }
        });

        // Draw score
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Hearts: " + score, 10, 20);

        if (score >= targetScore) {
            unlockWord();
            return;
        }

        requestAnimationFrame(update);
    }

    // Touch movement
    function moveBasket(clientX) {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        basket.x = x - basket.width / 2;

        if (basket.x < 0) basket.x = 0;
        if (basket.x + basket.width > canvas.width)
            basket.x = canvas.width - basket.width;
    }

    // Mouse support
    canvas.addEventListener("mousemove", (e) => {
        moveBasket(e.clientX);
    });

    // Touch support
    canvas.addEventListener("touchmove", (e) => {
        moveBasket(e.touches[0].clientX);
    });

    // Spawn hearts every 800ms
    const heartInterval = setInterval(spawnHeart, 800);

    update();
}
function startMemoryGame() {
    gameArea.innerHTML = "";

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(4, 70px)";
    grid.style.gridGap = "10px";
    grid.style.justifyContent = "center";
    gameArea.appendChild(grid);

    // Emoji pairs
    const emojis = ["❤️", "💌", "💕", "🌹"];
    const cards = [...emojis, ...emojis]; // duplicate for pairs

    // Shuffle
    cards.sort(() => Math.random() - 0.5);

    const cardElements = [];
    let firstCard = null;
    let secondCard = null;
    let matches = 0;

    cards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.style.width = "70px";
        card.style.height = "70px";
        card.style.background = "#ff2e63";
        card.style.borderRadius = "10px";
        card.style.display = "flex";
        card.style.justifyContent = "center";
        card.style.alignItems = "center";
        card.style.fontSize = "32px";
        card.style.cursor = "pointer";
        card.style.userSelect = "none";
        card.textContent = ""; // initially hidden
        grid.appendChild(card);

        card.addEventListener("click", () => {
            if (card.textContent !== "" || secondCard) return; // already revealed or two flipped

            card.textContent = emoji;

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;

                if (firstCard.textContent === secondCard.textContent) {
                    // match
                    firstCard = null;
                    secondCard = null;
                    matches++;
                    if (matches === emojis.length) {
                        // all matched
                        unlockWord();
                    }
                } else {
                    // no match, hide after short delay
                    setTimeout(() => {
                        firstCard.textContent = "";
                        secondCard.textContent = "";
                        firstCard = null;
                        secondCard = null;
                    }, 800);
                }
            }
        });

        cardElements.push(card);
    });
}
function startQuizGame() {
    gameArea.innerHTML = "";

    const questionPool = [
        {
            question: "What was OUR song at first?",
            options: ["Du & Ich", "Napiyosun Mesela", "Tujhe mein rab dikhta hai"],
            answer: "Tujhe mein rab dikhta hai"
        },
        {
            question: "What's my favorite food?",
            options: ["Burgers", "Cezu;)", "Pasta"],
            answer: "Cezu;)"
        },
        {
            question: "Why did you call me cute on our first night talking?",
            options: ["I offered to wish you happy birthday", "I said you have a beautiful name", "because I complimented you"],
            answer: "I offered to wish you happy birthday"
        },
        {
            question: "What was the first movie we watched together about?",
            options: ["A man is in love with a girl who doesn't love him at first", "A junior artist falls in love with a superstar and risks everything for her", "Two assassins are on two watch towers guarding a big unknown cliff, and they fall in love"],
            answer: "Two assassins are on two watch towers guarding a big unknown cliff, and they fall in love"
        },
        {
            question: "What do I love about you the most?",
            options: ["Your  smile", "Your big, massive, mommy TTs", "Your eyes"],
            answer: "Your eyes"
        },
        {
            question: "Who's my good girl?",
            options: ["Atesim", "Sassy-Cir", "Zehra"],
            answer: ["Atesim", "Sassy-Cir", "Zehra"] // All are correct
        },
        {
            question: "On June 6th, when we get home, where will I start first?",
            options: ["Your Delicious V", "Your Soft Neck", "Your Big, Massive, Mommy TTs"],
            answer: "Your Big, Massive, Mommy TTs"
        },
        {
            question: "What Round number are we on?",
            options: ["196", "180", "170"],
            answer: "180"
        },
        {
            question: "What was thename of the horror movie that scared us the most?",
            options: ["Smile 2", "Heriditary", "Insidious Series"],
            answer: "Heriditary"
        },
        {
            question: "Who do I love the most?",
            options: ["You", "You", "You"],
            answer: "You"
        }
    ];

    // Shuffle questions
    questionPool.sort(() => Math.random() - 0.5);

    let score = 0;
    let questionIndex = 0;
    const questionsToAnswer = 6;

    const container = document.createElement("div");
    container.style.textAlign = "center";
    gameArea.appendChild(container);

    function showQuestion() {
        if (score >= questionsToAnswer) {
            unlockWord();
            return;
        }

        if (questionIndex >= questionPool.length) {
            restartGame();
            return;
        }

        container.innerHTML = "";

        const current = questionPool[questionIndex];

        const q = document.createElement("h3");
        q.textContent = current.question;
        container.appendChild(q);

        current.options.forEach(option => {
            const btn = document.createElement("button");
            btn.textContent = option;
            btn.style.display = "block";
            btn.style.margin = "10px auto";
            btn.style.padding = "10px 20px";

            btn.addEventListener("click", () => {
                if (option === current.answer) {
                    score++;
                }

                questionIndex++;

                // If she just reached 6 correct
                if (score >= questionsToAnswer) {
                    container.innerHTML = "";

                    const winMsg = document.createElement("h3");
                    winMsg.textContent = `6 / 6 Correct ❤️`;
                    container.appendChild(winMsg);

                    const continueBtn = document.createElement("button");
                    continueBtn.textContent = "Continue 💕";
                    continueBtn.style.marginTop = "15px";

                    continueBtn.addEventListener("click", () => {
                        unlockWord();
                    });

                    container.appendChild(continueBtn);
                    return;
                }

                showQuestion();
            });


            container.appendChild(btn);
        });

        const progress = document.createElement("p");
        progress.textContent = `Correct: ${score} / ${questionsToAnswer}`;
        container.appendChild(progress);
    }

    function restartGame() {
        container.innerHTML = "";
        const fail = document.createElement("h3");
        fail.textContent = "Not good enough 😏 Try again!";
        container.appendChild(fail);

        const retry = document.createElement("button");
        retry.textContent = "Retry ❤️";
        retry.onclick = startQuizGame;
        container.appendChild(retry);
    }

    showQuestion();
}

function startReactionGame() {
    gameArea.innerHTML = "";

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.height = "400px";
    container.style.border = "2px solid pink";
    container.style.borderRadius = "10px";
    container.style.overflow = "hidden";
    gameArea.appendChild(container);

    let score = 0;
    let misses = 0;
    const targetScore = 6;
    const maxMisses = 3;

    let heartDuration = 650; // starts fast
    const minDuration = 420; // fastest it can go

    const status = document.createElement("p");
    status.style.textAlign = "center";
    status.textContent = `Hearts: ${score} | Misses: ${misses}`;
    gameArea.appendChild(status);

    function spawnHeart() {
        if (score >= targetScore) {
            unlockWord();
            return;
        }

        if (misses >= maxMisses) {
            restart();
            return;
        }

        const heartWrapper = document.createElement("div");
        heartWrapper.style.position = "absolute";
        heartWrapper.style.width = "100px";   // invisible hitbox width
        heartWrapper.style.height = "100px";  // invisible hitbox height
        heartWrapper.style.display = "flex";
        heartWrapper.style.alignItems = "center";
        heartWrapper.style.justifyContent = "center";
        heartWrapper.style.cursor = "pointer";
        
        const heart = document.createElement("div");
        heart.textContent = "💖";
        heart.style.fontSize = "40px";
        heart.style.userSelect = "none";
        
        heartWrapper.appendChild(heart);


        heartWrapper.style.left = Math.random() * 80 + "%";
        heartWrapper.style.top = Math.random() * 70 + "%";
        container.appendChild(heartWrapper);


        let clicked = false;

        heartWrapper.addEventListener("click", () => {
            clicked = true;
            score++;

            // Make game harder as she progresses
            heartDuration = Math.max(minDuration, heartDuration - 40);

            status.textContent = `Hearts: ${score} | Misses: ${misses}`;
            heartWrapper.remove();

            setTimeout(spawnHeart, 250);
        });

        setTimeout(() => {
            if (!clicked) {
                misses++;
                status.textContent = `Hearts: ${score} | Misses: ${misses}`;
                heartWrapper.remove();
                setTimeout(spawnHeart, 250);
            }
        }, heartDuration);
    }

    function restart() {
        container.innerHTML = "";

        const fail = document.createElement("h3");
        fail.textContent = "Too slow 😏 Try again!";
        gameArea.appendChild(fail);

        const retry = document.createElement("button");
        retry.textContent = "Retry 💕";
        retry.onclick = startReactionGame;
        gameArea.appendChild(retry);
    }

    spawnHeart();
}
function startFinalGame() {
    // Remove previous "valentine?" if already unlocked
    const finalWord = words[4]; // "valentine?"
    const finalIndex = unlockedWords.indexOf(finalWord);
    if (finalIndex !== -1) {
        unlockedWords.splice(finalIndex, 1);
    }

    let misses = 0;
    const maxMisses = 3;
    const maxSpeed = 4;
    let progressIndex = 0;
    let letters = [];
    const letterSize = 25;

    gameArea.innerHTML = "";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 350;
    canvas.height = 500;
    gameArea.appendChild(canvas);

    const basket = {
        x: canvas.width / 2 - 40,
        y: canvas.height - 40,
        width: 80,
        height: 20
    };

    const targetWord = "valentine"; // use exact word

    // --- Letter spawning ---
    function getRandomLetter() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz?'.split('');
        const nextLetter = targetWord[progressIndex].toLowerCase();
        const pool = [...alphabet, nextLetter, nextLetter, nextLetter, nextLetter]; // make correct letter more frequent
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function spawnLetter() {
        letters.push({
            x: Math.random() * (canvas.width - letterSize),
            y: -letterSize,
            speed: Math.min(6 + progressIndex * 0.3, maxSpeed),
            char: getRandomLetter()
        });
    }

    let spawnInterval = setInterval(spawnLetter, 700);

    // --- Basket movement ---
    function moveBasket(clientX) {
        const rect = canvas.getBoundingClientRect();
        basket.x = clientX - rect.left - basket.width / 2;
        if (basket.x < 0) basket.x = 0;
        if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
    }

    canvas.addEventListener("mousemove", e => moveBasket(e.clientX));
    canvas.addEventListener("touchmove", e => moveBasket(e.touches[0].clientX));

    // --- Restart function ---
    function restart() {
        clearInterval(spawnInterval); // stop previous letters
        letters = [];
        progressIndex = 0;
        misses = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before drawing

        // Show fail message
        ctx.fillStyle = "#ff4d80";
        ctx.font = "24px Arial";
        ctx.shadowColor = "#ff4d80";
        ctx.shadowBlur = 15;
        ctx.textAlign = "center";
        ctx.fillText("Too many misses! 😏 Try again!", canvas.width / 2, canvas.height / 2);

        // Restart after short delay
        setTimeout(() => {
            spawnInterval = setInterval(spawnLetter, 700);
            update();
        }, 1500);
    }

    // --- Main game loop ---
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw basket
        ctx.fillStyle = "#ff2e63";
        ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

        // Draw letters
        ctx.fillStyle = "#ff4d80";
        ctx.font = `${letterSize}px Arial`;
        ctx.textAlign = "left";
        letters.forEach((letter, index) => {
            letter.y += letter.speed;
            ctx.fillText(letter.char, letter.x, letter.y);

            // Collision detection
            if (
                letter.y + letterSize > basket.y &&
                letter.x < basket.x + basket.width &&
                letter.x + letterSize > basket.x
            ) {
                if (letter.char === targetWord[progressIndex].toLowerCase()) {
                    progressIndex++;
                } else {
                    misses++;
                    if (misses >= maxMisses) {
                        restart();
                        return;
                    }
                }
                letters.splice(index, 1);
            }

            // Remove off-screen letters
            if (letter.y > canvas.height) letters.splice(index, 1);
        });

        // Draw progress & misses
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.shadowColor = "#ff4d80";
        ctx.shadowBlur = 5;
        ctx.fillText(`Progress: ${targetWord.slice(0, progressIndex)} | Misses: ${misses}/${maxMisses}`, 10, 20);

        // Win condition
        if (progressIndex >= targetWord.length) {
            clearInterval(spawnInterval);
            unlockWord();
            return;
        }

        requestAnimationFrame(update);
    }

    update();
}








