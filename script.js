// --- 친구 선택 기능 ---
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

    // 3. 달리는 태풍이 (귀여운 강아지 캐릭터 표현)
    ctx.fillStyle = "#ff9800"; // 태풍이 털색 (주황빛)
    ctx.fillRect(taepungX, 110, 40, 30); // 몸통
    
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
        if (taepungX > 330) taepungX = 40; // 끝까지 가면 다시 앞으로 돌아와서 무한 질주
    }
}