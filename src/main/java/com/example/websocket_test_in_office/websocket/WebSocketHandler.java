package com.example.websocket_test_in_office.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

@Component
@Slf4j
public class WebSocketHandler extends TextWebSocketHandler {

    private List<WebSocketSession> sessions = new ArrayList<>(); // 클라이언트 저장하는 곳?

    private HashMap<WebSocketSession, Timer> hashMap = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {

        sessions.add(session);
    }

    public void handleTextMessage(WebSocketSession session, TextMessage message) {


        Timer MTimer = new Timer();// Timer 생성
                                    // 서버에서 데이터를 전송해주려고 만드신 거구나!

        ObjectMapper mapper = new ObjectMapper();
        HashMap<String, Object> sendData = null;

        try {
            HashMap<String, Object> data = mapper.readValue(message.getPayload(), new TypeReference<HashMap<String, Object>>() {});
            ObjectUtils.isEmpty(data);
            sendData = data;
        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
            log.info(e.getMessage());
        }

        try {

            TimerTask MTask = new TimerTask() {
                @Override
                public void run() {

                    try {

                        makeDataAndSendMessage(session);

                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                }
            };


            // 일정 시간마다 클라이언트로 데이터 전송하기
            MTimer.schedule(MTask, 500, 2000);
        } catch (Exception e) {
            log.info("ws message : {}", e.getMessage());
        }

        // 다른 클라이언트가 보낸 데이터도 보내기
        for(WebSocketSession clientSession : sessions) {

            try {

                String byteData = Arrays.toString(mapper.writeValueAsBytes(sendData));

                TextMessage textByteMessage = new TextMessage(byteData);

                clientSession.sendMessage(textByteMessage);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

    }

    private static void makeDataAndSendMessage(WebSocketSession session) throws IOException {

        ObjectMapper om = new ObjectMapper();// 보낼 데이터

        Map<String, String> data = new HashMap<>();
        data.put("1", "hi~");
        data.put("2", "hi~ hi~");

        // 직렬화 하기
        String jsonStr = om.writeValueAsString(data);
        TextMessage tmpMsg = new TextMessage(jsonStr);

        TextMessage msg = new TextMessage(tmpMsg.getPayload());
        session.sendMessage(msg);
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        try {
            hashMap.get(session).cancel();
        } catch (Exception e) {

        }

        sessions.remove(session);
        session.close();

        log.info("{} : 해당 웹소켓 세션 해제", session);
    }





}
