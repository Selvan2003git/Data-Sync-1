package apisender;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.util.List;

public class ParseJson {


    public Config getConfigurations(String jsonString) {

    	 ObjectMapper objectMapper = new ObjectMapper();
    	 objectMapper.configure(JsonParser.Feature.ALLOW_COMMENTS, true);
         try {
       
             //File file = new File("resources/config.json");
             //Config config = objectMapper.readValue(file, Config.class);
        	 Config config = objectMapper.readValue(jsonString, Config.class);
             return config;

         } catch (IOException e) {
             e.printStackTrace();
             return null;
         }
     }
    	
    }

