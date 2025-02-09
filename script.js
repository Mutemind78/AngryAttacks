const plane = document.getElementById("plane");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-button");
const gameOverDiv = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const playAgainButton = document.getElementById("play-again");

let planeX = 50;
let planeY = 250;
let gravity = 2;
let speed = 5;
let score = 0;
let keys = {};
let gameActive = false;
let bullets = [];
let birds = [];
const birdImages = ["black.png", "blue.png", "red.png", "white.png", "yellow.png"];

let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

// Keyboard event listeners
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// Touch event listeners for the game container
const gameContainer = document.getElementById("game-container");

gameContainer.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isTouching = true;
});

gameContainer.addEventListener("touchmove", (event) => {
    event.preventDefault();
    if (isTouching) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        // Move the plane based on touch movement
        planeX += deltaX / 5; // Adjust sensitivity
        planeY += deltaY / 5;

        // Update touch start position for smooth movement
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        // Keep plane within boundaries
        if (planeX < 0) planeX = 0;
        if (planeX > 350) planeX = 350;
        if (planeY < 0) planeY = 0;
        if (planeY > 550) planeY = 550;

        plane.style.left = planeX + "px";
        plane.style.top = planeY + "px";
    }
});

gameContainer.addEventListener("touchend", (event) => {
    event.preventDefault();
    isTouching = false;
    createBullet(); // Shoot bullet when touch ends
});

startButton.addEventListener("click", () => {
    if (!gameActive) {
        resetGame();
        gameActive = true;
        startButton.textContent = "Restart Game";
        gameLoop();
    } else {
        resetGame();
    }
});

playAgainButton.addEventListener("click", () => {
    resetGame();
    gameActive = true;
    gameOverDiv.style.display = "none";
    gameLoop();
});

function resetGame() {
    planeX = 50;
    planeY = 250;
    score = 0;
    speed = 5;
    scoreDisplay.textContent = "Score: 0";
    plane.style.top = planeY + "px";
    plane.style.left = planeX + "px";
    gameActive = false;

    // Remove all birds and bullets
    birds.forEach(bird => bird.remove());
    bullets.forEach(bullet => bullet.remove());
    birds = [];
    bullets = [];
}

function createBird() {
    if (!gameActive) return;

    const bird = document.createElement("img");
    bird.src = `/Assets/${birdImages[Math.floor(Math.random() * birdImages.length)]}`;
    bird.classList.add("bird");
    bird.style.width = "50px";
    bird.style.height = "auto";

    // Randomly choose a direction for the bird
    const direction = Math.floor(Math.random() * 3); // 0: up to down, 1: top-left to bottom-right, 2: top-right to bottom-left
    if (direction === 0) {
        // Up to down
        bird.style.left = Math.random() * 350 + "px";
        bird.style.top = "-50px";
        bird.dataset.direction = "down";
    } else if (direction === 1) {
        // Top-left to bottom-right
        bird.style.left = "-50px";
        bird.style.top = "-50px";
        bird.dataset.direction = "diagonal-right";
    } else if (direction === 2) {
        // Top-right to bottom-left
        bird.style.left = "450px";
        bird.style.top = "-50px";
        bird.dataset.direction = "diagonal-left";
    }

    document.getElementById("game-container").appendChild(bird);
    birds.push(bird);
}

function createBullet() {
    const bullet = document.createElement("img");
    bullet.src = "/Assets/bullet.png";
    bullet.classList.add("bullet");
    bullet.style.left = planeX + 20 + "px";
    bullet.style.top = planeY + "px";
    document.getElementById("game-container").appendChild(bullet);
    bullets.push(bullet);
}

function checkCollision(rect1, rect2) {
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

function gameLoop() {
    if (!gameActive) return;

    // Move plane with keyboard (optional)
    if (keys["ArrowUp"] || keys["w"]) planeY -= speed;
    if (keys["ArrowDown"] || keys["s"]) planeY += speed;
    if (keys["ArrowLeft"] || keys["a"]) planeX -= speed;
    if (keys["ArrowRight"] || keys["d"]) planeX += speed;

    // Apply gravity
    planeY += gravity;

    // Keep plane within boundaries
    if (planeY > 550) planeY = 550;
    if (planeY < 0) planeY = 0;
    if (planeX > 350) planeX = 350;
    if (planeX < 0) planeX = 0;

    plane.style.top = planeY + "px";
    plane.style.left = planeX + "px";

    // Move birds
    birds.forEach((bird, index) => {
        let birdX = parseFloat(bird.style.left) || 0;
        let birdY = parseFloat(bird.style.top) || 0;

        if (bird.dataset.direction === "down") {
            // Move down
            birdY += speed;
            bird.style.top = birdY + "px";

            // Remove bird if it goes off-screen
            if (birdY > 600) {
                bird.remove();
                birds.splice(index, 1);
            }
        } else if (bird.dataset.direction === "diagonal-right") {
            // Move diagonally (top-left to bottom-right)
            birdX += speed;
            birdY += speed;
            bird.style.left = birdX + "px";
            bird.style.top = birdY + "px";

            // Remove bird if it goes off-screen
            if (birdX > 450 || birdY > 600) {
                bird.remove();
                birds.splice(index, 1);
            }
        } else if (bird.dataset.direction === "diagonal-left") {
            // Move diagonally (top-right to bottom-left)
            birdX -= speed;
            birdY += speed;
            bird.style.left = birdX + "px";
            bird.style.top = birdY + "px";

            // Remove bird if it goes off-screen
            if (birdX < -50 || birdY > 600) {
                bird.remove();
                birds.splice(index, 1);
            }
        }

        // Check for collision with plane
        if (checkCollision(plane.getBoundingClientRect(), bird.getBoundingClientRect())) {
            gameOver();
        }
    });

    // Move bullets
    bullets.forEach((bullet, index) => {
        let bulletTop = parseFloat(bullet.style.top) || planeY;
        bulletTop -= 10; // Bullet speed
        bullet.style.top = bulletTop + "px";

        // Check for collision with birds
        birds.forEach((bird, birdIndex) => {
            if (checkCollision(bullet.getBoundingClientRect(), bird.getBoundingClientRect())) {
                bird.remove();
                birds.splice(birdIndex, 1);
                bullet.remove();
                bullets.splice(index, 1);
                score++;
                scoreDisplay.textContent = "Score: " + score;
            }
        });

        // Remove bullet if it goes off-screen
        if (bulletTop < -10) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    // Shoot bullet on spacebar press (optional)
    if (keys[" "]) {
        createBullet();
        keys[" "] = false; // Prevent continuous shooting
    }

    // Create new birds randomly
    if (Math.random() < 0.02) {
        createBird();
    }

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameActive = false;
    finalScoreDisplay.textContent = score;
    gameOverDiv.style.display = "block";
}

resetGame();