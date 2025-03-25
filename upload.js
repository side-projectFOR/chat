document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".chat-input input");
    const sendButton = document.querySelector(".chat-input i");
    const chatMessages = document.querySelector(".chat-messages");

    function sendMessage() {
        const messageText = inputField.value.trim();
        if (messageText === "") return;

        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "sent");

        messageElement.innerHTML = 
        `
            <div class="message-content">
                <p>${messageText}</p>
                <span class="timestamp">${getCurrentTime()}</span>
            </div>
        `;

        chatMessages.appendChild(messageElement); // 메시지 추가
        inputField.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤 아래로 이동
    }

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let period = hours >= 12 ? "오후" : "오전";

        hours = hours % 12 || 12;
        minutes = minutes.toString().padStart(2, "0"); // 두 자리 수 변환

        return `${period} ${hours}:${minutes}`;
    }

    sendButton.addEventListener("click", sendMessage);

    inputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
//배경색 바꾸기
document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".fa-bars");
    const colorPicker = document.getElementById("colorPicker");
    const chatMessages = document.querySelector(".chat-messages");

    // 선택창 표시
    menuIcon.addEventListener("click", function () {
        colorPicker.style.display = colorPicker.style.display === "block" ? "none" : "block";
    });

    // 배경 변경
    document.querySelectorAll(".color-option").forEach(option => {
        option.addEventListener("click", function () {
            const selectedColor = this.getAttribute("data-color");
            chatMessages.style.backgroundColor = selectedColor;
            colorPicker.style.display = "none"; // 색상 선택 후 창 닫기
        });
    });

    // 선택창 닫기
    document.addEventListener("click", function (event) {
        if (!menuIcon.contains(event.target) && !colorPicker.contains(event.target)) {
            colorPicker.style.display = "none";
        }
    });

    const searchIcon = document.querySelector(".fa-search");
    const searchContainer = document.getElementById("searchContainer");
    const searchInput = document.getElementById("searchInput");
    

    // 검색창 
    searchIcon.addEventListener("click", function () {
        searchContainer.style.display = 
            searchContainer.style.display === "block" ? "none" : "block";
    });

    searchInput.addEventListener("input", function () {
        const keyword = searchInput.value.trim();
        highlightText(keyword);
    });

    function highlightText(keyword) {
        document.querySelectorAll(".message-content p").forEach(p => {
            p.innerHTML = p.textContent; // HTML 태그를 제거하고 원래 텍스트로 복원
        });

        if (keyword === "") return; 

        document.querySelectorAll(".message-content p").forEach(p => {
            const text = p.textContent;
            const regex = new RegExp(`(${keyword})`, "gi"); // 대소문자 구분 없이 검색
            p.innerHTML = text.replace(regex, `<span class="highlight">$1</span>`);
        });
    }
});