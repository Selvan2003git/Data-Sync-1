package com.SpringApp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String redirect() {
        // Forward all non-file requests to index.html for React Router to handle
    	System.out.println("hit");
        return "forward:/index.html";
    }
}

