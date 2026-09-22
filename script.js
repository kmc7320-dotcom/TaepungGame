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

// 💡 [자동화 핵심] 사진 번호별로 화면에 띄울 이름을 설정하는 표입니다.
// 번호가 바뀌거나 사진이 늘어나면 여기 이름만 수정/추가하시면 됩니다!
const photoNames = {
    1: "강태풍",
    2: "쿠크",
    3: "그레이블랙",
    4: "하루",
    5: "하이링",
    6: "하이",
    7: "오션",
    8: "카이",
    9: "시온",
    10: "보름달토끼",
    11: "감자",
    12: "율무",
    13: "가비치치",
    14: "티나쏠티",
    15: "뚜시",
    16: "루이시아",
    17: "바벨로우",
    18: "베니", // 18번 베니
    19: "쩜메이",
    20: "태풍쿠크페리",
    21: "하쿠",
    22: "호진탐",
    23: "흑곰",
    35: "보리"  // 35번 보리 (중간에 빈 번호가 있어도 알아서 버튼이 생성됩니다)
};

// 총 사진 개수 (나중에 사진이 늘어나면 이 숫자만 100 등으로 바꿔주세요!)
const totalPhotos = 35;

function openNormalPuzzleMenu() {
    playBGM();
    switchScreen('normal-puzzle-screen');
    document.getElementById('normal-select-menu').style.display = 'block';
    document.getElementById('normal-game-area').style.display = 'none';
    
    // 메뉴를 열 때 자동으로 버튼들을 생성합니다.
    generatePhotoButtons();
}

function generatePhotoButtons() {
    const container = document.getElementById('photo-button-container');
    container.innerHTML = ""; // 중복 생성 방지 초기화

    for (let i = 1; i <= totalPhotos; i++) {
        // photoNames에 등록된 번호만 버튼을 만듭니다. (중간에 비어있는 번호 스킵 가능)
        if (photoNames[i]) {
            let btn = document.createElement('button');
            btn.className = "photo-btn";
            btn.innerText = photoNames[i];
            btn.onclick = () => startNormalPuzzle(`${i}.jpg`);
            container.appendChild(btn);
        }
    }
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
const NORMAL_COLS = 4;
const NORMAL_ROWS = 4;
const NORMAL_TOTAL = 16;

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
// 2번 모드: 단일 images 폴더 랜덤 연속 퍼즐
// ==========================================
let randomGridSize = 6;
let currentRandomPhotoNum = 1;
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
    
    currentRandomPhotoNum = Math.floor(Math.random() * totalPhotos) + 1;
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
        piece.style.border = (normalFirstIndex === currentIndex) ? "2px solid #ffc107" : "0.5px solid #fff";
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
    if (currentRandomPhotoNum > totalPhotos) {
        currentRandomPhotoNum = 1;
    }
    loadRandomPuzzleStage();
}

function backToRandomMenu() {
    openRandomPuzzleMenu();
}

// 💡 [추가된 함수] 사용자가 업로드한 내 사진을 받아와서 퍼즐을 시작하는 함수
function loadCustomPhoto(event) {
    let file = event.target.files[0];
    if (!file) return;

    // 업로드한 이미지 파일을 임시 주소로 변환
    let reader = new FileReader();
    reader.onload = function(e) {
        let imageUrl = e.target.result;
        
        // 퍼즐 게임 화면으로 전환
        playBGM();
        document.getElementById('normal-select-menu').style.display = 'none';
        document.getElementById('normal-game-area').style.display = 'block';
        
        // 원본 사진 자리에 업로드한 사진 넣기
        document.getElementById('normal-original-img').src = imageUrl;
        document.getElementById('normal-puzzle-status').innerText = "";

        // 퍼즐 조각 섞기 및 보드 초기화
        do {
            normalOrder = Array.from({length: NORMAL_TOTAL}, (_, i) => i);
            normalOrder.sort(() => Math.random() - 0.5);
        } while (normalOrder.every((val, idx) => val === idx));

        normalFirstIndex = null;
        initCustomPuzzleBoard(imageUrl);
        renderNormalBoard();
    };
    reader.readAsDataURL(file);
}

// 💡 [추가된 함수] 업로드한 이미지 주소를 사용하는 퍼즐판 생성기
function initCustomPuzzleBoard(imageUrl) {
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
        piece.style.backgroundImage = `url('${imageUrl}')`;
        piece.style.backgroundSize = `${NORMAL_COLS * tileSize}px ${NORMAL_ROWS * tileSize}px`;
        piece.style.cursor = "pointer";
        piece.style.boxSizing = "border-box";
        
        piece.onclick = () => clickNormalPiece(i);
        board.appendChild(piece);
        normalPieces.push(piece);
    }
}