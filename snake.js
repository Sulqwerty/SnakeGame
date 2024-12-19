const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const box = 20;
const canvasSize = 25;
const SPEED = 150; // Konstanta untuk mengatur kecepatan permainan
let snake, direction, food, score, gameOver, game;

// Fungsi untuk menginisialisasi permainan
function init() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = 'RIGHT';
    food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
    score = 0;
    gameOver = false;
    restartButton.style.display = 'none'; // Sembunyikan tombol saat permainan dimulai
    startButton.style.display = 'none'; // Sembunyikan tombol saat permainan dimulai
    ctx.font = '10px Arial'; // Atur ulang ukuran font
    game = setInterval(draw, SPEED);
}

// Fungsi untuk menggambar elemen permainan
function draw() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 80, canvas.height / 2);
        restartButton.style.display = 'block'; // Tampilkan tombol saat game over
        clearInterval(game);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar ular
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'white' : 'gray';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        if (i === 0) {
            ctx.fillStyle = 'black';
            ctx.fillText('^ ^', snake[i].x + 5, snake[i].y + 15);
        }
    }

    // Gambar makanan
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Gambar skor
    ctx.fillStyle = 'yellow';
    ctx.fillText(`SCORE: ${score}`, box, box);

    // Posisi kepala ular
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Arah gerakan
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Teleportasi ular jika menabrak dinding
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY >= canvas.height) snakeY = 0;

    // Jika ular memakan makanan
    if (snakeX === food.x && snakeY === food.y) {
        score+=10;
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        snake.pop();
    }

    // Tambahkan kepala baru
    const newHead = { x: snakeX, y: snakeY };

    // Game over jika menabrak tubuh sendiri
    if (collision(newHead, snake)) {
        gameOver = true;
    }

    snake.unshift(newHead);
}

// Fungsi untuk mendeteksi tabrakan
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Fungsi untuk mengatur kontrol
document.addEventListener('keydown', event => {
    if ((event.key === 'ArrowLeft' || event.key === 'a') && direction !== 'RIGHT') direction = 'LEFT';
    if ((event.key === 'ArrowUp' || event.key === 'w') && direction !== 'DOWN') direction = 'UP';
    if ((event.key === 'ArrowRight' || event.key === 'd') && direction !== 'LEFT') direction = 'RIGHT';
    if ((event.key === 'ArrowDown' || event.key === 's') && direction !== 'UP') direction = 'DOWN';
});

// Event listener untuk tombol "Mainkan"
startButton.addEventListener('click', init);

// Event listener untuk tombol "Main Lagi"
restartButton.addEventListener('click', init);
