async function generatePrompt() {

    const request = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "messages": [{
                "role": "user",
                "content": `Give me a thing to draw, the first letter of the sentence must be ${randomLetterGenerator()}, It must be something that is fairly easy to recognize, also the number of characters in the sentence must be ${randomNumberGenerator()}, name only the thing, no other text`
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
    generatePrompt();
    startTimer();
    document.getElementById("startButton").disabled = true;
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
    timerDiv.innerText = `Time Left: ${timeLeft} Secends`
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}, 1000);
}

function endGame() {
    document.getElementById("startButton").disabled = false;
}