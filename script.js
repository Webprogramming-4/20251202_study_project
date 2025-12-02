const wordsList = [
    "apple", "banana", "cat", "dog", "egg", "fish", "gold", "hat", "ice", "jam",
    "kite", "lemon", "moon", "night", "orange", "pen", "queen", "rain", "sun", "tree",
    "umbrella", "violin", "water", "box", "yellow", "zebra", "cloud", "dream", "earth", "flower",
    "garden", "house", "island", "jungle", "king", "lion", "mouse", "nurse", "ocean", "party",
    "robot", "snake", "tiger", "train", "virus", "window", "xmas", "yacht", "zone",
    "brave", "clean", "dance", "enjoy", "fresh", "happy", "lucky", "magic", "power", "quick",
    "smart", "super", "sweet", "today", "voice", "watch", "young", "start", "world", "space",
    "galaxy", "planet", "comet", "orbit", "alien", "laser", "rocket", "future", "coding", "pixel",
    "script", "style", "html", "logic", "data", "value", "loop", "array", "class", "object"
];

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = document.getElementById('word-input');
        this.scoreEl = document.getElementById('score');
        this.finalScoreEl = document.getElementById('final-score');
        this.startModal = document.getElementById('start-modal');
        this.gameOverModal = document.getElementById('game-over-modal');

        this.words = [];
        this.score = 0;
        this.isPlaying = false;
        this.spawnRate = 2000;
        this.lastSpawnTime = 0;
        this.difficulty = 1;
        this.animationId = null;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 이벤트 리스너 설정
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawnWord() {
        const text = wordsList[Math.floor(Math.random() * wordsList.length)];
        const fontSize = Math.floor(Math.random() * 10) + 20; 
        
        const x = Math.random() * (this.canvas.width - 200) + 100;
        const y = -30;
        
        const speed = (Math.random() * 1 + 0.5) + (this.difficulty * 0.2);
        
        const hue = Math.floor(Math.random() * 360);
        const color = `hsl(${hue}, 100%, 75%)`;

        this.words.push({ text, x, y, speed, color, fontSize });
    }

    update(timestamp) {
        if (!this.isPlaying) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (timestamp - this.lastSpawnTime > this.spawnRate) {
            this.spawnWord();
            this.lastSpawnTime = timestamp;
            if (this.spawnRate > 500) this.spawnRate -= 10;
        }

        for (let i = 0; i < this.words.length; i++) {
            const word = this.words[i];
            word.y += word.speed;

            this.ctx.font = `bold ${word.fontSize}px 'Segoe UI', sans-serif`;
            this.ctx.fillStyle = word.color;
            this.ctx.shadowColor = "rgba(0,0,0,0.8)";
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(word.text, word.x, word.y);
            this.ctx.shadowBlur = 0;

            if (word.y > this.canvas.height - 10) {
                this.gameOver();
                return;
            }
        }

        this.animationId = requestAnimationFrame((ts) => this.update(ts));
    }

    handleInput(e) {
        if (e.key !== 'Enter') return;
        if (!this.isPlaying) return;

        const typedText = this.input.value.trim();
        const index = this.words.findIndex(w => w.text === typedText);

        if (index !== -1) {
            this.words.splice(index, 1);
            this.score += 10;
            this.updateScore();
            
            if (this.score % 50 === 0) {
                this.difficulty++;
            }
        }

        this.input.value = '';
    }

    updateScore() {
        this.scoreEl.innerText = this.score;
    }

    start() {
        this.score = 0;
        this.words = [];
        this.spawnRate = 2000;
        this.difficulty = 1;
        this.isPlaying = true;
        this.updateScore();
        this.input.value = '';

        this.startModal.classList.add('hidden');
        this.gameOverModal.classList.add('hidden');
        this.input.focus();

        this.lastSpawnTime = performance.now();
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.update(performance.now());
    }

    gameOver() {
        this.isPlaying = false;
        cancelAnimationFrame(this.animationId);
        this.finalScoreEl.innerText = this.score;
        this.gameOverModal.classList.remove('hidden');
    }
}

const game = new Game();