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
    // 원반 5개와 공 3개를 모두 채우면 2단계(점프) 또는 친구 선택으로 연동
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

// 캔버스 업데이트 루프 (필요 시 그래픽 렌더링 용도)
function updateGame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 간단한 배경이나 태풍이 캐릭터 드로잉 공간
    ctx.fillStyle = "#e8f5e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#333";
    ctx.font = "14px sans-serif";
    ctx.fillText("🐾 태풍이 운동장 (어질리티 플레이 중)", 20, 30);
}