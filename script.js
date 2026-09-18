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
    
    // 원본 사진 미리보기 이미지 경로 설정
    let originalImg = document.getElementById("puzzle-original-img");
    if (originalImg) {
        originalImg.src = `images/${selectedPhoto}`;
    }
    
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

function checkWin() {
    let isWin = puzzleOrder.every((val, idx) => val === idx);
    if (isWin) {
        document.getElementById("puzzle-status").innerText = "🎉 축하합니다! 퍼즐 완성! 🐾";
    }
}

// --- 어질리티(뛰어놀기) 게임 로직 ---
let canvas, ctx;
let frisbeeCount = 0;
let ballCount = 0;
let hurdleCount = 0;
let hearts = 0;

// 원반 던지기 버튼 클릭 시
function throwFrisbee() {
    if (frisbeeCount < 5) {
        frisbeeCount++;
        document.getElementById("frisbee-count").innerText = frisbeeCount;
        document.getElementById("taepung-dialog").innerText = "🥏 영차! 원반을 물어왔어요! 🐾";
        checkAgilityProgress();
    }
}

// 공놀이 하기 버튼 클릭 시
function throwBall() {
    if (ballCount < 3) {
        ballCount++;
        document.getElementById("ball-count").innerText = ballCount;
        document.getElementById("taepung-dialog").innerText = "🎾 신나게 공을 쫓아가는 태풍이! 🏃‍♂️";
        checkAgilityProgress();
    }
}

// 진행 상황 체크 및 다음 스테이지 전환
function checkAgilityProgress() {
    if (frisbeeCount >= 5 && ballCount >= 3) {
        document.getElementById("taepung-dialog").innerText = "✨ 대단해요! 장애물 뛰어넘기 스테이지 해제! 🚧";
        document.getElementById("stage-1-panel").style.display = "none";
        document.getElementById("stage-2-panel").style.display = "block";
    }
}

// 점프하기 버튼 액션
function jumpButtonAction() {
    if (hurdleCount < 3) {
        hurdleCount++;
        document.getElementById("hurdle-count").innerText = hurdleCount;
        if (hurdleCount >= 3) {
            document.getElementById("taepung-dialog").innerText = "🏆 어질리티 완료! 함께 놀 친구를 골라주세요! 🐾";
            document.getElementById("stage-2-panel").style.display = "none";
            document.getElementById("stage-3-panel").style.display = "block";
        } else {
            document.getElementById("taepung-dialog").innerText = `🚧 영차! 멋지게 점프 성공! (${hurdleCount}/3)`;
        }
    }
}

// 친구 선택 기능
function selectFriend(friendName) {
    document.getElementById("taepung-dialog").innerText = `🎉 태풍이와 ${friendName}(이)가 즐겁게 친구가 되었어요! 🦴`;
}

// --- 태풍이의 위치 변수 ---
let taepungX = 50; 

// --- 태풍이 운동장 애니메이션 루프 ---
function updateGame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. 초록색 잔디밭 배경 그리기
    ctx.fillStyle = "#e8f5e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. 운동장 트랙 라인 그리기
    ctx.strokeStyle = "#c8e6c9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(400, 150);
    ctx.stroke();

    // 3. 달리는 태풍이 표현
    ctx.fillStyle = "#ff9800"; 
    ctx.fillRect(taepungX, 110, 40, 30); 
    
    // 머리
    ctx.fillStyle = "#f57c00";
    ctx.fillRect(taepungX + 30, 95, 20, 20);
    
    // 꼬리 흔들기 효과
    ctx.strokeStyle = "#f57c00";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(taepungX, 120);
    ctx.lineTo(taepungX - 10, 110 + Math.sin(Date.now() / 100) * 10);
    ctx.stroke();

    // 4. 글씨 및 상태 안내
    ctx.fillStyle = "#333";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("🐾 태풍이 운동장 (어질리티 플레이 중)", 15, 25);
    
    // 원반이나 공을 누르기 시작하면 태풍이가 앞으로 달리기 시작!
    if (frisbeeCount > 0 || ballCount > 0) {
        taepungX += 1.5;
        if (taepungX > 330) taepungX = 40; 
    }
}