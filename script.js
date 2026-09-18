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
let selectedPhoto = "1.jpg"; 
let puzzleBoard = document.getElementById("puzzle-board");
let firstIndex = null;
let puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function startPuzzleWithPhoto(fileName) {
    selectedPhoto = fileName;
    document.getElementById("puzzle-select-menu").style.display = "none";
    document.getElementById("puzzle-game-area").style.display = "block";
    
    let originalImg = document.getElementById("puzzle-original-img");
    if (originalImg) {
        originalImg.src = `images/${selectedPhoto}`;
    }
    
    // 완벽하게 섞이도록 하되, 시작할 때 우연히 원본과 똑같이 섞이는 경우 방지
    do {
        puzzleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        puzzleOrder.sort(() => Math.random() - 0.5);
    } while (puzzleOrder.every((val, idx) => val === idx));

    firstIndex = null;
    document.getElementById("puzzle-status").innerText = "";
    renderPuzzle();
}

function renderPuzzle() {
    puzzleBoard = document.getElementById("puzzle-board");
    puzzleBoard.innerHTML = "";
    puzzleOrder.forEach((imgIndex, currentIndex) => {
        let piece = document.createElement("div");
        piece.style.width = "100px";
        piece.style.height = "100px";
        piece.style.backgroundImage = `url('images/${selectedPhoto}')`;
        piece.style.backgroundSize = "300px 300px";
        
        let x = (imgIndex % 3) * -100;
        let y = Math.floor(imgIndex / 3) * -100;
        piece.style.backgroundPosition = `${x}px ${y}px`;
        piece.style.cursor = "pointer";
        piece.style.border = (firstIndex === currentIndex) ? "3px solid #ffc107" : "1px solid #fff";
        
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

// 원본 사진과 완전히 일치하는지 정확히 검사하는 함수
function checkWin() {
    let isWin = puzzleOrder.every((val, idx) => val === idx);
    if (isWin) {
        document.getElementById("puzzle-status").innerHTML = "🎉 원본 사진과 완벽히 일치합니다! 퍼즐 성공! 🐾<br><button onclick='goLobby()' style='margin-top:10px; background:#4caf50; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:bold;'>🏠 메인(로비)로 가기</button>";
    }
}

// --- 어질리티(뛰어놀기) 게임 로직 ---
let canvas, ctx;
let frisbeeCount = 0;
let ballCount = 0;
let hurdleCount = 0;
let taepungX = 50; 
let isRunning = false;

function throwFrisbee() {
    if (frisbeeCount < 5) {
        frisbeeCount++;
        document.getElementById("frisbee-count").innerText = frisbeeCount;
        document.getElementById("taepung-dialog").innerText = "🥏 신나게 원반을 쫓아 전력 질주하는 태풍이! 🐾";
        isRunning = true;
        checkAgilityProgress();
    }
}

function throwBall() {
    if (ballCount < 3) {
        ballCount++;
        document.getElementById("ball-count").innerText = ballCount;
        document.getElementById("taepung-dialog").innerText = "🎾 공을 향해 영차영차 계속 달리는 태풍이! 🏃‍♂️";
        isRunning = true;
        checkAgilityProgress();
    }
}

function checkAgilityProgress() {
    if (frisbeeCount >= 5 && ballCount >= 3) {
        document.getElementById("taepung-dialog").innerText = "✨ 대단해요! 장애물 뛰어넘기 스테이지 해제! 🚧";
        document.getElementById("stage-1-panel").style.display = "none";
        document.getElementById("stage-2-panel").style.display = "block";
    }
}

function jumpButtonAction() {
    if (hurdleCount < 3) {
        hurdleCount++;
        document.getElementById("hurdle-count").innerText = hurdleCount;
        isRunning = true;
        if (hurdleCount >= 3) {
            document.getElementById("taepung-dialog").innerHTML = "🏆 어질리티 완료! 친구와 함께 완벽하게 완주했어요! 🐾<br><button onclick='goLobby()' style='margin-top:8px; background:#4caf50; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:bold;'>🏠 메인(로비)로 가기</button>";
            document.getElementById("stage-2-panel").style.display = "none";
            document.getElementById("stage-3-panel").style.display = "block";
        } else {
            document.getElementById("taepung-dialog").innerText = `🚧 영차! 멋지게 점프 성공 후 계속 달리는 중! (${hurdleCount}/3)`;
        }
    }
}

function selectFriend(friendName) {
    document.getElementById("taepung-dialog").innerHTML = `🎉 태풍이와 ${friendName}(이)가 함께 즐겁게 뛰어놀고 있어요! 🦴<br><button onclick='goLobby()' style='margin-top:8px; background:#4caf50; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:bold;'>🏠 메인(로비)로 가기</button>`;
}

// --- 태풍이 운동장 애니메이션 루프 (그레이, 블랙, 화이트 조합) ---
function updateGame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. 초록색 잔디밭 배경
    ctx.fillStyle = "#e8f5e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. 트랙 라인
    ctx.strokeStyle = "#c8e6c9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(400, 150);
    ctx.stroke();

    // 3. 소품(공 또는 원반)
    if (frisbeeCount > 0 || ballCount > 0) {
        ctx.fillStyle = frisbeeCount > 0 ? "#ff9800" : "#e91e63";
        ctx.beginPath();
        ctx.arc(320, 130, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    // 4. 장애물(허들)
    if (hurdleCount > 0 || document.getElementById("stage-2-panel").style.display === "block") {
        ctx.fillStyle = "#9c27b0";
        ctx.fillRect(250, 110, 10, 40); 
        ctx.fillRect(230, 110, 50, 8);  
    }

    // 5. 달리는 태풍이 캐릭터 (그레이, 블랙, 화이트 조합)
    ctx.fillStyle = "#78909c"; 
    ctx.fillRect(taepungX, 110, 40, 30); 
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(taepungX + 25, 115, 12, 20);

    ctx.fillStyle = "#37474f";
    ctx.fillRect(taepungX + 30, 95, 20, 20);
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(taepungX + 37, 98, 5, 15);

    ctx.strokeStyle = "#37474f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(taepungX, 120);
    ctx.lineTo(taepungX - 10, 110 + Math.sin(Date.now() / 80) * 10);
    ctx.stroke();

    ctx.fillStyle = "#333";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("🐾 태풍이 운동장 (어질리티 플레이 중)", 15, 25);
    
    if (isRunning) {
        taepungX += 2.0;
        if (taepungX > 420) taepungX = -40;
    }
}