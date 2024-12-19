// Import modul readline
const readline = require('readline');

// Impor chalk secara dinamis
let chalk;
(async () => {
    chalk = (await import('chalk')).default;
    main(); // Panggil main setelah chalk diimpor
})();

// Konfigurasi ukuran papan permainan
const SIZE = 25;
const WIDTH = SIZE;
const HEIGHT = SIZE;

// Konfigurasi kecepatan permainan
const SPEED_DELAY = 150;

// Inisialisasi variabel permainan
let gameover = false;
let score = 0;
let snake = [{ x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) }];
let snake_length = 1;
let food = { x: 0, y: 0 };
let dirX = 0;
let dirY = 1;

// Fungsi untuk mengatur permainan
function setup() {
    // Set posisi awal makanan secara acak
    food.x = 1 + Math.floor(Math.random() * (WIDTH - 2));
    food.y = 1 + Math.floor(Math.random() * (HEIGHT - 2));
}

// Fungsi untuk menggambar papan permainan
function render() {
    console.clear();
    for (let i = 0; i < HEIGHT; i++) {
        let row = '';
        for (let j = 0; j < WIDTH; j++) {
            if (i === 0 || i === HEIGHT - 1 || j === 0 || j === WIDTH - 1) {
                row += chalk.bgBlueBright('  '); // Gambar border dengan latar belakang biru
            } else if (i === snake[0].y && j === snake[0].x) {
                row += chalk.bgWhite(chalk.black('^^')); // Gambar kepala ular dengan mata ^^ berwarna hitam
            } else if (i === food.y && j === food.x) {
                row += chalk.bgRed('  '); // Gambar makanan dengan latar belakang merah
            } else {
                let isBody = false;
                for (let k = 1; k < snake_length; k++) {
                    if (snake[k].x === j && snake[k].y === i) {
                        row += chalk.bgGray('  '); // Gambar tubuh ular dengan latar belakang abu-abu
                        isBody = true;
                        break;
                    }
                }
                if (!isBody) {
                    row += '  '; // Gambar ruang kosong
                }
            }
        }
        console.log(row);
    }
    console.log(chalk.yellow(`SCORE: ${score}`)); // Tampilkan skor dengan warna kuning
    console.log(chalk.green('Gunakan WASD untuk bergerak')); // Tampilkan keterangan kontrol
}

// Fungsi untuk menangani input dari pengguna
function input(key) {
    switch (key) {
        case 'a':
            if (dirX !== 1) {
                dirX = -1;
                dirY = 0;
            }
            break;
        case 'd':
            if (dirX !== -1) {
                dirX = 1;
                dirY = 0;
            }
            break;
        case 'w':
            if (dirY !== 1) {
                dirX = 0;
                dirY = -1;
            }
            break;
        case 's':
            if (dirY !== -1) {
                dirX = 0;
                dirY = 1;
            }
            break;
    }
}

// Fungsi untuk memperbarui logika permainan
function logic() {
    let newHead = { x: snake[0].x + dirX, y: snake[0].y + dirY };

    // Teleportasi ular jika menabrak dinding
    if (newHead.x === 0) newHead.x = WIDTH - 2;
    else if (newHead.x === WIDTH - 1) newHead.x = 1;
    if (newHead.y === 0) newHead.y = HEIGHT - 2;
    else if (newHead.y === HEIGHT - 1) newHead.y = 1;

    // Tambahkan kepala baru ke ular
    snake.unshift(newHead);

    // Periksa apakah ular memakan makanan
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        snake_length++;
        food.x = 1 + Math.floor(Math.random() * (WIDTH - 2));
        food.y = 1 + Math.floor(Math.random() * (HEIGHT - 2));
    } else {
        snake.pop(); // Hapus ekor jika tidak memakan makanan
    }

    // Periksa tabrakan dengan tubuh sendiri
    for (let i = 1; i < snake_length; i++) {
        if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
            gameover = true;
            break;
        }
    }
}

// Fungsi utama untuk menjalankan permainan
function main() {
    setup();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else {
            input(key.name);
        }
    });

    function gameLoop() {
        if (!gameover) {
            render();
            logic();
            setTimeout(gameLoop, SPEED_DELAY);
        } else {
            console.log("GAME OVER! Tekan Ctrl+C untuk keluar.");
        }
    }

    gameLoop();
}