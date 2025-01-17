package apisender;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.logging.Logger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Identity;
import java.time.LocalDateTime;
import java.util.logging.Level;
import org.json.JSONObject;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.json.JSONArray;


public class ResourceServerClient {

    
    private static final Logger LOGGER = Logger.getLogger(ResourceServerClient.class.getName());
    static APIParser apiParser = new APIParser();
    static APIClient apiClient = new APIClient();
    static ParseJson parseJson = new ParseJson();
    static Config config;
    public static ArrayList<String> failedServers = new ArrayList<>();
    
    
  public static void start(String configJson, SseEmitter emitter, Map<String, List<String>> logs, String sessionId) throws IOException, InterruptedException{
	  
	    
	    System.out.println("Started");
	    
	    config = parseJson.getConfigurations(configJson);
     	List<ServerDetails> serversDetailsList = config.servers;
     	List<Query> queriesList = config.queries;
     	Target target = config.target;
     	  
     	List<String> serversName = new ArrayList<>();
      	List<String> queries = new ArrayList<>();
      	System.out.println("The App will execute following queries : \n");
      	emitter.send("The App will execute following queries : \n");
      	  for(Query query : config.queries) {
      		  System.out.println(query.getQueryString());
      		 emitter.send(query.getQueryString());
      	  }
      	  System.out.println("\nOn following servers : \n");
      	  emitter.send("\nOn following servers : \n");
      	  for(ServerDetails server : config.servers) {
      	  System.out.println(server.getName());   
      	  emitter.send(server.getName());
      	  }
      	  
      	AnalyticsUploader uploader = new AnalyticsUploader(config.target);
     	QueryScheduler.scheduleQueries(config, uploader,emitter);  
     	if(failedServers.size() > 0) {
     		StringBuilder failedServersResponse = new StringBuilder();
     		failedServersResponse.append("Empty or No data received from the following servers : [");
     		for(String server  : failedServers) {
     			failedServersResponse.append(server+", ");
     		}
     		failedServersResponse.append("]");
     		emitter.send(failedServersResponse.toString());
     		failedServers = new ArrayList<>();
     	}
	      	
    }


    public static void main(String[] args) throws Exception {
    	
   
         }
          
  }

    
    


   
 