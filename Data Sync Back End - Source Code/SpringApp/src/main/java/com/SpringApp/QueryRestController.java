package com.SpringApp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import org.springframework.http.MediaType;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import apisender.ResourceServerClient;



@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class QueryRestController{
	
	// Store emitters for each client using a unique session ID
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final Map<String, List<String>> logs = new ConcurrentHashMap<>();
    
    @PostMapping("/executeQueries")
    public Map<String, String> executeQueries(@RequestBody String configData) throws InterruptedException {
        // Generate a unique session ID for this request
        String sessionId = UUID.randomUUID().toString();
        System.out.println(configData);
        
        // Create a new emitter for the client and store it
        long tenMinutes = 10 * 60 * 1000L;
        SseEmitter emitter = new SseEmitter(tenMinutes);
        emitters.put(sessionId, emitter);
        
        // Create an empty log list for this session
        logs.put(sessionId, new java.util.ArrayList<>());

        // Process the query execution in a separate thread to avoid blocking the main thread
        new Thread(() -> {
            try {
                // Simulate query execution and log generation
                   ResourceServerClient rc = new ResourceServerClient();
            	   rc.start(configData, emitter, logs, sessionId);

                    // Log each query execution step
                   
                   

                    // Send the log to the client via SSE
//                    emitter.send("Executed");
//                
//                // Final log message after all queries are executed
                  String finalLog = "Sync Process Completed";
//                logs.get(sessionId).add(finalLog);
                  emitter.send(finalLog);

                //emitter.complete(); // Complete the emitter when done
            } catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }).start();
        
        Map<String, String> response = new ConcurrentHashMap<>();
        response.put("sessionId", sessionId);
        return response;

       
    }
    
    @GetMapping(value = "/logs/stream/{sessionId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamLogs(@PathVariable String sessionId) {
        // Retrieve the emitter for the client using the session ID
        SseEmitter emitter = emitters.get(sessionId);

        if (emitter == null) {
            throw new IllegalArgumentException("No logs found for session ID: " + sessionId);
        }

        // Return the emitter to stream logs to the client
        return emitter;
    }
		
	@PostMapping("/executeQueries1")
	public void executeQueries1(@RequestBody String configData) {
		
		   System.out.println(configData);
		   
		
		   SseEmitter emitter = new SseEmitter();
	        ExecutorService executor = Executors.newSingleThreadExecutor();

	        executor.execute(() -> {
	            try {
	            	  //ResourceServerClient.start(configData, emitter, logs, sessionId);
	                emitter.complete();
	            } finally {
	                executor.shutdown();
	            }
	        });	
	}
	
	 @GetMapping("/stream")
	 public SseEmitter streamLogs() {
	        SseEmitter emitter = new SseEmitter();
	        try {
				emitter.send(SseEmitter.event().data("Hello Wolrd"));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        ExecutorService executor = Executors.newSingleThreadExecutor();

	        executor.execute(() -> {
	            try {
	                // Simulating log messages; replace with actual logs in a real application
	                for (String logMessage : new ArrayList<String>()) {
	                   // String logMessage = String.format("[%s] Log event %d occurred", LocalDateTime.now(), i);
	                    emitter.send(SseEmitter.event().data(logMessage));
	                    Thread.sleep(2000); // Simulate a delay between log entries
	                }
	                emitter.complete();
	            } catch (IOException | InterruptedException e) {
	                emitter.completeWithError(e);
	            } finally {
	                executor.shutdown();
	            }
	        });

	        return emitter;
	    }
	

}
