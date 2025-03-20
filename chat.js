document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    const userId = localStorage.getItem('userId');
    const userNickname = localStorage.getItem('userNickname');
    
    if (!userId) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }
    
    // URL 파라미터에서 대화 상대 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const targetId = urlParams.get('targetId');
    
    if (!targetId) {
        alert('대화 상대가 지정되지 않았습니다.');
        window.location.href = 'chatlist.html';
        return;
    }
    
    // API URL 설정
    const API_URL = "http://192.168.100.152:9221";
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    // 대화 상대 정보 설정
    document.getElementById('chat-recipient').textContent = `사용자 ${targetId}`;
    
    // WebSocket 연결
    let stompClient = null;
    
    function connectWebSocket() {
        const socket = new SockJS(`${API_URL}/ws`);
        stompClient = Stomp.over(socket);
        
        stompClient.connect({
            'userId': userId
        }, function(frame) {
            console.log('Connected: ' + frame);
            
            // 개인 채팅 주제 구독
            stompClient.subscribe(`/topic/chat/${userId}`, function(message) {
                const messageData = JSON.parse(message.body);
                if (messageData.name == targetId) {
                    displayMessage(messageData, false);
                }
            });
            
            loadChatHistory();
        }, function(error) {
            console.error('STOMP 연결 오류:', error);
            // 연결 실패 시에도 채팅 이력은 로드
            loadChatHistory();
        });
    }
    
    // 메시지 전송
    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (!messageText) return;
        
        const messageData = {
            name: userId,
            content: messageText,
            time: new Date().toISOString()
        };
        
        // 서버로 메시지 전송
        if (stompClient && stompClient.connected) {
            stompClient.send(`/app/chat.send`, {}, JSON.stringify({
                sender: userId,
                recipient: targetId,
                content: messageText
            }));
        }
        
        // 메시지 화면에 표시
        displayMessage(messageData, true);
        
        // 입력창 초기화
        messageInput.value = '';
        messageInput.focus();
    }
    
    // 채팅 이력 로드
    function loadChatHistory() {
        axios.get(`${API_URL}/chats/${targetId}/log`)
            .then(function(response) {
                const messages = response.data;
                
                // 메시지 표시
                chatMessages.innerHTML = '';
                
                messages.forEach(message => {
                    displayMessage(message, false);
                });
                
                // 스크롤 맨 아래로
                scrollToBottom();
            })
            .catch(function(error) {
                console.error('채팅 이력 로드 오류:', error);
                
                // 오류 발생 시 기본 메시지 표시
                chatMessages.innerHTML = '<div class="system-message">채팅 이력을 불러올 수 없습니다.</div>';
            });
    }
    
    // 메시지 화면에 표시
    function displayMessage(message, isNewMessage) {
        const isMine = message.name === userId;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isMine ? 'sent' : 'received');
        
        let messageTime = '';
        if (typeof message.time === 'string') {
            const date = new Date(message.time);
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? '오후' : '오전';
            const formattedHours = (hours % 12 || 12).toString();
            messageTime = `${period} ${formattedHours}:${minutes}`;
        }
        
        let html = '';
        
        if (!isMine) {
            html += `<img src="profile-placeholder.jpg" alt="프로필 사진">`;
        }
        
        html += `<div class="message-content">
                    <p>${message.content}</p>
                    <span class="timestamp">${messageTime}</span>
                </div>`;
        
        messageElement.innerHTML = html;
        
        // 새 메시지를 맨 아래에 추가
        chatMessages.appendChild(messageElement);
        
        // 새 메시지인 경우 스크롤 아래로
        if (isNewMessage) {
            scrollToBottom();
        }
    }
    
    // 스크롤 맨 아래로
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 이벤트 리스너
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 배경색 변경
    const menuIcon = document.getElementById('menu-icon');
    const colorPicker = document.getElementById('colorPicker');
    
    menuIcon.addEventListener('click', function() {
        colorPicker.style.display = colorPicker.style.display === 'block' ? 'none' : 'block';
    });
    
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedColor = this.getAttribute('data-color');
            chatMessages.style.backgroundColor = selectedColor;
            localStorage.setItem(`chatBgColor_${targetId}`, selectedColor);
            colorPicker.style.display = 'none';
        });
    });
    
    // 저장된 배경색 적용
    const savedColor = localStorage.getItem(`chatBgColor_${targetId}`);
    if (savedColor) {
        chatMessages.style.backgroundColor = savedColor;
    }
    
    // 검색 기능
    const searchIcon = document.getElementById('search-icon');
    searchIcon.addEventListener('click', function() {
        const keyword = prompt('검색할 메시지를 입력하세요:');
        if (!keyword) return;
        
        const messages = document.querySelectorAll('.message-content p');
        let found = false;
        
        messages.forEach(message => {
            if (message.textContent.includes(keyword)) {
                message.parentElement.parentElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                found = true;
                return;
            }
        });
        
        if (!found) {
            alert('검색 결과가 없습니다.');
        }
    });
    
    // 초기화
    connectWebSocket();
    
    // 페이지 벗어날 때 정리
    window.addEventListener('beforeunload', function() {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect();
        }
    });
});
