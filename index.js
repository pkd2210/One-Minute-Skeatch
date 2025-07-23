let canvas, ctx;
let gameStarted = false;
let isDrawing = false;
let xCord = 0;
let yCord = 0;

async function generatePrompt() {
    const request = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "messages": [{
                "role": "user",
                "content": `Give me a thing to draw, the first letter of the sentence must be ${randomLetterGenerator()}, It must be something that is fairly easy to recognize, also the number of characters in the sentence must be ${randomNumberGenerator()}, name only the thing, no other text, including no thinking process, if a word isn't good, put another one, NEVER! put anything that is not explicitly the thing to draw (including x is too long or x is too short), no thinking proccess writing!!!!.`
            }]
        })
    });
    if (!request.ok) {
        throw new Error (`Error ${request.status}`);
    }
    const response = await request.json();
    const content = response.choices[0].message.content;
    document.getElementById("prompt").innerText = "Prompt: " + content;
}

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generatePrompt();
    startTimer();
    document.getElementById("startButton").disabled = true;
    gameStarted = true;
}

function randomLetterGenerator() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

function randomNumberGenerator() {
    return Math.floor(Math.random() * 5) + 3;
}

function startTimer() {
    let timeLeft = 60;
    const timerDiv = document.getElementById("timer");
    const timer = setInterval(() => {
    timeLeft--;
    timerDiv.innerText = `Time Left: ${timeLeft} Seconds`
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}, 1000);
}

function endGame() {
    document.getElementById("startButton").disabled = false;
    gameStarted = false;
}

document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById("drawingCanvas");
    ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

canvas.addEventListener("mousedown", (e) => {
    if (!gameStarted) return;
    isDrawing = true;
    ctx.beginPath();
    [xCord, yCord] = [e.offsetX, e.offsetY];
    ctx.moveTo(xCord, yCord);
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing || !gameStarted) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [xCord, yCord] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gameStarted) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    isDrawing = true;
    ctx.beginPath();
    [xCord, yCord] = [x, y];
    ctx.moveTo(xCord, yCord);
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!isDrawing || !gameStarted) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    [xCord, yCord] = [x, y];
});

canvas.addEventListener("mouseout", () => {
    isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});

canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    isDrawing = false;
});
});

function changeColor(color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}