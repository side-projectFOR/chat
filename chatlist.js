document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    const userId = localStorage.getItem('userId');
    const userNickname = localStorage.getItem('userNickname');
    
    if (!userId) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }
    
    // 사용자 정보 표시
    document.getElementById('user-name').textContent = userNickname || userId;
    
    // API URL 설정
    const API_URL = "http://192.168.100.152:9221";
    const chatList = document.getElementById('chat-list');
    const userSelect = document.getElementById('user-select');
    
    // 로그아웃 기능
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('userIdx');
        localStorage.removeItem('userNickname');
        alert('로그아웃 되었습니다.');
        window.location.href = 'login.html';
    });
    
    // 프로필 버튼
    document.getElementById('profile-btn').addEventListener('click', function() {
        window.location.href = 'updateMembers.html';
    });
    
    // 채팅 시작 버튼
    document.getElementById('start-chat-btn').addEventListener('click', function() {
        const selectedUserId = userSelect.value;
        if (!selectedUserId) {
            alert('채팅할 사용자를 선택하세요.');
            return;
        }
        
        // 채팅 페이지로 이동
        window.location.href = `chat.html?targetId=${selectedUserId}`;
    });
    
    // 사용자 목록 로드 (ID 1-10까지)
    function loadUsers() {
        // 1부터 10까지의 사용자 ID 생성
        for (let i = 1; i <= 10; i++) {
            // 현재 로그인한 사용자는 제외
            if (i.toString() === userId) continue;
            
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `사용자 ${i}`;
            userSelect.appendChild(option);
        }
    }
    
    // 채팅 목록 로드
    function loadChatList() {
        // 1부터 10까지의 사용자와의 채팅 표시
        for (let i = 1; i <= 10; i++) {
            // 현재 로그인한 사용자는 제외
            if (i.toString() === userId) continue;
            
            // 이 예제에서는 각 사용자와의 채팅 항목을 생성합니다
            createChatItem(`사용자 ${i}`, i);
        }
    }
    
    // 채팅 항목 생성
    function createChatItem(name, targetId) {
        const link = document.createElement('a');
        link.href = `chat.html?targetId=${targetId}`;
        
        const chatItem = document.createElement('li');
        chatItem.classList.add('chat-item');
        chatItem.dataset.user = name;
        
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile');
        
        const img = document.createElement('img');
        img.src = 'profile-placeholder.jpg'; // 기본 프로필 이미지
        img.alt = `${name} 프로필 이미지`;
        
        const chatInfoDiv = document.createElement('div');
        chatInfoDiv.classList.add('chat-info');
        
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('name');
        nameDiv.textContent = name;
        
        const lastMessageDiv = document.createElement('div');
        lastMessageDiv.classList.add('last-message');
        lastMessageDiv.textContent = '채팅을 시작하세요';
        
        chatInfoDiv.appendChild(nameDiv);
        chatInfoDiv.appendChild(lastMessageDiv);
        
        profileDiv.appendChild(img);
        profileDiv.appendChild(chatInfoDiv);
        
        // 읽지 않은 메시지 표시 (임의의 데이터)
        if (Math.random() > 0.5) {
            const badgeSpan = document.createElement('span');
            badgeSpan.classList.add('badge');
            badgeSpan.textContent = Math.floor(Math.random() * 10) + 1;
            chatItem.appendChild(badgeSpan);
        }
        
        chatItem.appendChild(profileDiv);
        link.appendChild(chatItem);
        chatList.appendChild(link);
    }
    
    // 초기화
    loadUsers();
    loadChatList();
});
