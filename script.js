// --- 로비 및 화면 전환 함수 ---
function startRunningGame() {
    document.getElementById("arcade-lobby").style.display = "none";
    document.getElementById("play-screen").style.display = "block";
    if (!canvas) {
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        setInterval(updateGame, 20);
    }
}

function openPuzzleMenu() {
    document.getElementById("arcade-lobby").style.display = "none";
    document.getElementById("puzzle-screen").style.display = "block";
    document.getElementById("puzzle-select-menu").style.display = "block";
    document.getElementById("puzzle-game-area").style.display = "none";
    document.getElementById("puzzle-status").innerText = "";
}

function backToPhotoSelect() {
    document.getElementById("puzzle-select-menu").style.display = "block";
    document.getElementById("puzzle-game-area").style.display = "none";
    document.getElementById("puzzle-status").innerText = "";
}

function goLobby() {
    document.getElementById("play-screen").style.display = "none";
    document.getElementById("puzzle-screen").style.display = "none";
    document.getElementById("arcade-lobby").style.display = "block";
}

// --- 조각 퍼즐 게임 로직 ---
let selectedPhoto = "1.jpg"; // 기본 선택 사진
let puzzleBoard = document.getElementById("puzzle-board");
let firstIndex = null;
let puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function startPuzzleWithPhoto(fileName) {
    selectedPhoto = fileName;
    document.getElementById("puzzle-select-menu").style.display = "none";
    document.getElementById("puzzle-game-area").style.display = "block";
    
    // 퍼즐 섞기 및 시작
    puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    puzzleOrder.sort(() => Math.random() - 0.5);
    firstIndex = null;
    document.getElementById("puzzle-status").innerText = "";
    renderPuzzle();
}

function renderPuzzle() {
    puzzleBoard.innerHTML = "";
    puzzleOrder.forEach((imgIndex, currentIndex) => {
        let piece = document.createElement("div");
        piece.style.width = "100px";
        piece.style.height = "100px";
        // images 폴더 안에 있는 사용자가 선택한 사진 적용
        piece.style.backgroundImage = `url('images/${selectedPhoto}')`;
        piece.style.backgroundSize = "300px 300px";
        
        let x = (imgIndex % 3) * -100;
        let y = Math.floor(imgIndex / 3) * -100;
        piece.style.backgroundPosition = `${x}px ${y}px`;
        piece.style.cursor = "pointer";
        piece.style.border = (firstIndex === currentIndex) ? "2px solid #ffc107" : "1px solid #fff";
        
        piece.onclick = () => clickPiece(currentIndex);
        puzzleBoard.appendChild(piece);
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

function checkWin() {
    let isWin = puzzleOrder.every((val, idx) => val === idx);
    if (isWin) {
        document.getElementById("puzzle-status").innerText = "🎉 축하합니다! 퍼즐 완성! 🐾";
    }
}