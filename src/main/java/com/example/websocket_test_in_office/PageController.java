package com.example.websocket_test_in_office;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/pages/websocket/test")
public class PageController {

    @GetMapping
    public String websocketPage() {

        return "/websocket/websocket-test";
    }
}
