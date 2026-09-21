// 🎵 배경 음악 재생 함수
function playBGM() {
    let audio = document.getElementById('bgm-audio');
    if (audio && audio.paused) {
        audio.play().catch(error => {
            console.log("브라우저 정책으로 인해 자동 재생 대기 중", error);
        });
    }
}

// 화면 전환 함수
function switchScreen(screenId) {
    playBGM();
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function goLobby() {
    playBGM();
    switchScreen('arcade-lobby');
}

function openNormalPuzzleMenu() {
    playBGM();
    switchScreen('normal-puzzle-screen');
    document.getElementById('normal-select-menu').style.display = 'block';
    document.getElementById('normal-game-area').style.display = 'none';
}

function openRandomPuzzleMenu() {
    playBGM();
    switchScreen('random-puzzle-screen');
    document.getElementById('random-select-menu').style.display = 'block';
    document.getElementById('random-game-area').style.display = 'none';
}

// ==========================================
// 1번 모드: 일반 조각 퍼즐 (3x3 고정)
// ==========================================
let normalPhoto = "";
let normalOrder = [];
let normalPieces = [];
let normalFirstIndex = null;
const NORMAL_COLS = 3;
const NORMAL_ROWS = 3;
const NORMAL_TOTAL = 9;

function startNormalPuzzle(fileName) {
    playBGM();
    normalPhoto = fileName;
    document.getElementById('normal-select-menu').style.display = 'none';
    document.getElementById('normal-game-area').style.display = 'block';
    
    document.getElementById('normal-original-img').src = `images/${normalPhoto}`;
    document.getElementById('normal-puzzle-status').innerText = "";

    do {
        normalOrder = Array.from({length: NORMAL_TOTAL}, (_, i) => i);
        normalOrder.sort(() => Math.random() - 0.5);
    } while (normalOrder.every((val, idx) => val === idx));

    normalFirstIndex = null;
    initNormalBoard();
    renderNormalBoard();
}

function initNormalBoard() {
    const board = document.getElementById('normal-puzzle-board');
    board.innerHTML = "";
    normalPieces = [];

    const tileSize = 90;
    board.style.gridTemplateColumns = `repeat(${NORMAL_COLS}, ${tileSize}px)`;
    board.style.gridTemplateRows = `repeat(${NORMAL_ROWS}, ${tileSize}px)`;

    for (let i = 0; i < NORMAL_TOTAL; i++) {
        let piece = document.createElement("div");
        piece.style.width = tileSize + "px";
        piece.style.height = tileSize + "px";
        piece.style.backgroundImage = `url('images/${normalPhoto}')`;
        piece.style.backgroundSize = `${NORMAL_COLS * tileSize}px ${NORMAL_ROWS * tileSize}px`;
        piece.style.cursor = "pointer";
        piece.style.boxSizing = "border-box";
        
        piece.onclick = () => clickNormalPiece(i);
        board.appendChild(piece);
        normalPieces.push(piece);
    }
}

function renderNormalBoard() {
    const tileSize = 90;
    normalOrder.forEach((imgIndex, currentIndex) => {
        let piece = normalPieces[currentIndex];
        let x = (imgIndex % NORMAL_COLS) * -tileSize;
        let y = Math.floor(imgIndex / NORMAL_COLS) * -tileSize;
        piece.style.backgroundPosition = `${x}px ${y}px`;
        piece.style.border = (normalFirstIndex === currentIndex) ? "3px solid #ffc107" : "1px solid #fff";
    });
}

function clickNormalPiece(index) {
    if (normalFirstIndex === null) {
        normalFirstIndex = index;
        renderNormalBoard();
    } else {
        let temp = normalOrder[normalFirstIndex];
        normalOrder[normalFirstIndex] = normalOrder[index];
        normalOrder[index] = temp;
        normalFirstIndex = null;
        renderNormalBoard();
        checkNormalWin();
    }
}

function checkNormalWin() {
    let isWin = normalOrder.every((val, idx) => val === idx);
    if (isWin) {
        document.getElementById('normal-puzzle-status').innerText = "🎉 퍼즐 완성! 멋져요 🐾";
    }
}

function backToNormalMenu() {
    openNormalPuzzleMenu();
}


// ==========================================
// 2번 모드: 단일 images 폴더 1~100장 랜덤 연속 퍼즐
// ==========================================
let randomGridSize = 6; // 6 또는 12
let currentRandomPhotoNum = 1;
let maxPhotosInFolder = 24; // 💡 나중에 사진이 100장으로 늘어나면 이 숫자를 100으로 변경하세요!
let randomOrder = [];
let randomPieces = [];
let randomFirstIndex = null;

function startRandomGame() {
    playBGM();
    
    let radios = document.getElementsByName('random-diff');
    for (let r of radios) {
        if (r.checked) {
            randomGridSize = parseInt(r.value);
        }
    }

    document.getElementById('random-select-menu').style.display = 'none';
    document.getElementById('random-game-area').style.display = 'block';
    
    currentRandomPhotoNum = Math.floor(Math.random() * maxPhotosInFolder) + 1;
    loadRandomPuzzleStage();
}

function loadRandomPuzzleStage() {
    document.getElementById('next-random-btn').style.display = 'none';
    document.getElementById('random-puzzle-status').innerText = "";

    let photoPath = `images/${currentRandomPhotoNum}.jpg`;
    document.getElementById('random-original-img').src = photoPath;

    let totalPieces = randomGridSize * randomGridSize;
    do {
        randomOrder = Array.from({length: totalPieces}, (_, i) => i);
        randomOrder.sort(() => Math.random() - 0.5);
    } while (randomOrder.every((val, idx) => val === idx));

    randomFirstIndex = null;
    initRandomBoard(photoPath);
    renderRandomBoard();
}

function initRandomBoard(photoPath) {
    const board = document.getElementById('random-puzzle-board');
    board.innerHTML = "";
    randomPieces = [];

    let tileSize = randomGridSize === 6 ? 45 : 22; 
    let boardPixelSize = randomGridSize * tileSize;

    board.style.gridTemplateColumns = `repeat(${randomGridSize}, ${tileSize}px)`;
    board.style.gridTemplateRows = `repeat(${randomGridSize}, ${tileSize}px)`;

    let totalPieces = randomGridSize * randomGridSize;
    for (let i = 0; i < totalPieces; i++) {
        let piece = document.createElement("div");
        piece.style.width = tileSize + "px";
        piece.style.height = tileSize + "px";
        piece.style.backgroundImage = `url('${photoPath}')`;
        piece.style.backgroundSize = `${boardPixelSize}px ${boardPixelSize}px`;
        piece.style.cursor = "pointer";
        piece.style.boxSizing = "box-sizing";
        
        piece.onclick = () => clickRandomPiece(i);
        board.appendChild(piece);
        randomPieces.push(piece);
    }
}

function renderRandomBoard() {
    let tileSize = randomGridSize === 6 ? 45 : 22;
    randomOrder.forEach((imgIndex, currentIndex) => {
        let piece = randomPieces[currentIndex];
        let x = (imgIndex % randomGridSize) * -tileSize;
        let y = Math.floor(imgIndex / randomGridSize) * -tileSize;
        piece.style.backgroundPosition = `${x}px ${y}px`;
        piece.style.border = (randomFirstIndex === currentIndex) ? "2px solid #ffc107" : "0.5px solid #fff";
    });
}

function clickRandomPiece(index) {
    if (randomFirstIndex === null) {
        randomFirstIndex = index;
        renderRandomBoard();
    } else {
        let temp = randomOrder[randomFirstIndex];
        randomOrder[randomFirstIndex] = randomOrder[index];
        randomOrder[index] = temp;
        randomFirstIndex = null;
        renderRandomBoard();
        checkRandomWin();
    }
}

function checkRandomWin() {
    let isWin = randomOrder.every((val, idx) => val === idx);
    if (isWin) {
        document.getElementById('random-puzzle-status').innerText = "🎉 성공! 다음 사진으로 넘어가세요!";
        document.getElementById('next-random-btn').style.display = 'inline-block';
    }
}

function loadNextRandomPhoto() {
    currentRandomPhotoNum++;
    if (currentRandomPhotoNum > maxPhotosInFolder) {
        currentRandomPhotoNum = 1;
    }
    loadRandomPuzzleStage();
}

function backToRandomMenu() {
    openRandomPuzzleMenu();
}