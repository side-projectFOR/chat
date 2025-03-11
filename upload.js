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