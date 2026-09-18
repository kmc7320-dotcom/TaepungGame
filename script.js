// --- 조각 퍼즐 게임 로직 (반응형 완벽 호환 버전) ---
let selectedPhoto = "1.jpg"; 
let puzzleBoard = document.getElementById("puzzle-board");
let firstIndex = null;
let puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let puzzlePieces = []; 

// 화면 크기에 따라 조각 크기 자동 설정 (모바일은 90px, PC는 100px)
function getTileSize() {
    return window.innerWidth <= 600 ? 90 : 100;
}

function startPuzzleWithPhoto(fileName) {
    selectedPhoto = fileName;
    document.getElementById("puzzle-select-menu").style.display = "none";
    document.getElementById("puzzle-game-area").style.display = "block";
    
    let originalImg = document.getElementById("puzzle-original-img");
    if (originalImg) {
        originalImg.src = `images/${selectedPhoto}`;
    }
    
    // 완벽하게 섞이되, 시작할 때 원본과 똑같이 섞이는 경우 방지
    do {
        puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        puzzleOrder.sort(() => Math.random() - 0.5);
    } while (puzzleOrder.every((val, idx) => val === idx));

    firstIndex = null;
    document.getElementById("puzzle-status").innerText = "";
    
    initPuzzleBoard();
    renderPuzzle();
}

// 퍼즐 조각 9개를 생성하는 함수
function initPuzzleBoard() {
    puzzleBoard = document.getElementById("puzzle-board");
    puzzleBoard.innerHTML = "";
    puzzlePieces = [];

    let size = getTileSize();
    let bgSize = size * 3;

    for (let i = 0; i < 9; i++) {
        let piece = document.createElement("div");
        piece.style.width = size + "px";
        piece.style.height = size + "px";
        piece.style.backgroundImage = `url('images/${selectedPhoto}')`;
        piece.style.backgroundSize = `${bgSize}px ${bgSize}px`;
        piece.style.cursor = "pointer";
        
        piece.onclick = () => clickPiece(i);
        puzzleBoard.appendChild(piece);
        puzzlePieces.push(piece);
    }
}

// 섞인 순서 및 화면 크기에 맞춰 좌표 실시간 반영
function renderPuzzle() {
    let size = getTileSize();
    let bgSize = size * 3;

    puzzleOrder.forEach((imgIndex, currentIndex) => {
        let piece = puzzlePieces[currentIndex];
        
        piece.style.width = size + "px";
        piece.style.height = size + "px";
        piece.style.backgroundSize = `${bgSize}px ${bgSize}px`;

        let x = (imgIndex % 3) * -size;
        let y = Math.floor(imgIndex / 3) * -size;
        
        piece.style.backgroundPosition = `${x}px ${y}px`;
        piece.style.border = (firstIndex === currentIndex) ? "3px solid #ffc107" : "1px solid #fff";
    });
}

function clickPiece(index) {
    if (firstIndex === null) {
        firstIndex = index;
        renderPuzzle(); 
    } else {
        let temp = puzzleOrder[firstIndex];
        puzzleOrder[firstIndex] = puzzleOrder[index];
        puzzleOrder[index] = temp;
        firstIndex = null;
        renderPuzzle(); 
        checkWin();
    }
}