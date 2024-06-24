
// websocket 테스트를 위한 js

let sendBtn = document.querySelector(".sendBtn");

// 메시지 전송 버튼 이벤트
sendBtn.addEventListener("click", () => {
    onSend();
});

// 소켓연결 이벤트
let connectionBtn = document.querySelector(".connectionBtn");
connectionBtn.addEventListener("click", () => {

    connection();

    // class 입력

    const connectionClass = "connect";
    console.log(connectionBtn.classList.contains(connectionClass));
    // if(!connectionBtn.classList.contains(connectionClass)) {
    //     connectionBtn.classList.add(connectionClass);
    //     connectionBtn.innerText = "소켓닫기";
    //     console.log("this : ", this);
    // } else {
    //     connectionBtn.classList.remove(connectionClass);
    //     connectionBtn.innerText = "소켓연결";
    //     console.log("this1 : ", this);
    // }
    // console.log(this);

    if(connectionBtn.classList.toggle(connectionClass)) {
        connectionBtn.innerText = "소켓닫기";
    } else {
        connectionBtn.innerText = "소켓연결";
    }

    // this.toggle();
});


// 웹소켓 생성
let webSocket;

// 메시지 번호
let messageNum = 1;

// 소켓 연결
function connection() {

    if(webSocket != null) {

        const userId = document.querySelector(".user-id").value;

        if(!userId) {

            const message = `나감!`;
            chatMessage = {
                userId: userId,
                message: message
            }
        }

        // 직렬화하기
        const sendingMessage = JSON.stringify(chatMessage);

        // 서버로 메시지 전송
        webSocket.send(sendingMessage);

        webSocket.close();// 연결을 끊기위해 필요한 거 같다.
                          // 자원을 낭비 안 하려고?
        webSocket = null;// 다시 웹소켓 연결하기 위해서 코드 생성

    } else {
        connectionServer();
    }
    console.log(webSocket);
}

function connectionServer() {

    try {
        const webSocketUri = "ws://localhost:9000/websocket/test";
        webSocket = new WebSocket(webSocketUri);
        webSocket.onopen = onOpen;
        webSocket.onclose = onClose;
        webSocket.onmessage = onMessage;
    } catch(e) {
        console.log(e);
    }
}


function onOpen() {
    console.log("hi");
    // webSocket.send("test");
    const userId = document.querySelector(".user-id").value;

    if(!userId) {
        const message = `새로운 인물 등장!`;
        chatMessage = {
            message: message
        }
    }

    // 직렬화하기
    const sendingMessage = JSON.stringify(chatMessage);

    // 서버로 메시지 전송
    webSocket.send(sendingMessage);
}

// 소켓 닫음
function onClose() {
    webSocket.close();
}

// 메시지 받기 from server
function onMessage(e) {

    console.log(e);

    const data = e.data;

    console.log(data);
    console.log(`typeof e : ${data}`);

    const serverMessage = JSON.parse(data);

    // 디코딩
    const uint8Array = new Uint8Array(serverMessage);
    // const textDecoder = new TextDecoder('euc-kr');
    const textDecoder = new TextDecoder('utf-8');
    const decodedTextDecoder = textDecoder.decode(uint8Array);

    // 예쁘게 정리
    const resultMessage = JSON.parse(decodedTextDecoder);
    console.log(resultMessage);
    const result = `${resultMessage.messageNum} : ${resultMessage.userId} => ${resultMessage.message}`;

    // message 박스에 담기
    let messageBox = document.querySelector(".messageBox");
    const newBox = document.createElement("div");
    const newTextMessage = document.createTextNode(result);
    newBox.appendChild(newTextMessage);
    messageBox.appendChild(newBox);

}

// 메시지 전송
function onSend() {

    // 데이터 가져오기
    const message = document.querySelector(".chat-message").value;
    const userId = document.querySelector(".user-id").value;


    // json data 만들기
    let chatMessage = {
        messageNum: messageNum,
        userId : userId,
        message: message
    }

    // 직렬화하기
    const sendingMessage = JSON.stringify(chatMessage);

    // 서버로 메시지 전송
    webSocket.send(sendingMessage);

    messageNum++;
}


