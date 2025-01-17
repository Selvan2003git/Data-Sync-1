package apisender;

import java.util.concurrent.*;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.*;
import java.util.*;

public class QueryScheduler {

    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    

    public static void scheduleQueries(Config config, AnalyticsUploader uploader, SseEmitter emitter) throws IOException {
    	
    	List<AccessTokenManager> tokenManagers = new ArrayList<>();

        for (ServerDetails server : config.servers) {
            AccessTokenManager tokenManager = new AccessTokenManager(
                    server.getClientId(), server.getClientSecret(), server.getRefreshToken(),
                    server.getAccessToken(), server.getExpiryTime(), server.getTokenEndpoint());
            
            tokenManagers.add(tokenManager);
            
        }
        
        
        for (Query query : config.queries) {
        	
                long frequencyInSeconds = query.getFrequency(); 
            
              
            	   String query_string = query.getQueryString(); 
            	   String mergeType = query.getMergeType();
            	   System.out.println("Executing...");
            	   emitter.send("Executing...");
				   System.out.println("\n\n"+query_string + " EXECUTING......");
				   emitter.send("\n\n"+query_string + " EXECUTING......");
				   
				   
				   try {
					String serverData = APIClient.fetchDataForQuery(
							   query, config.servers, config.target, tokenManagers,emitter);

					
					if(serverData != null) {
						//upload;
						long rowLength = serverData.lines().count() - 1;
					
						System.out.println("Merged Data have "+ (serverData.lines().count()-1) + " Rows");
						emitter.send("Merged Data have "+ (serverData.lines().count()-1) + " Rows");
						System.out.println("\nUploading in Zoho Analytics");
						emitter.send("\nUploading in Zoho Analytics");
						String response = uploader.upload(serverData,config.target, query.getViewId(), emitter);
						if(response != null && response.equals("success")) {
						System.out.println("\nUploaded into Zoho Analytics...");
						emitter.send("\nUploaded into Zoho Analytics...");
						
						}
						else {
							System.out.println("\nFailed to upload to Zoho Analytics..,");
							emitter.send("\nFailed to upload to Zoho Analytics..,");
						}
					}
					
					else {
						System.out.println("\nFailed to upload to Zoho Analytics..,");
						emitter.send("\nFailed to upload to Zoho Analytics..,");
					}
				} catch (Exception e) {
					
					e.printStackTrace();
				}

				  
				   
           
        }
       
    }
    }


