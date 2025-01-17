package apisender;

public class APIParser {
	
	 public static String parseErrorDescription(String authHeaderValue) {
	        
	        String errorDescription = null;
	        String key = "error_description=\"";
	        int startIdx = authHeaderValue.indexOf(key);
	        if (startIdx != -1) {
	            startIdx += key.length(); 
	            int endIdx = authHeaderValue.indexOf("\"", startIdx);
	            if (endIdx != -1) {
	                errorDescription = authHeaderValue.substring(startIdx, endIdx);
	            }
	        }

	        return errorDescription;
	    }
	    

	   
	    public static String parseAccessToken(String jsonResponse) {
	        int startIndex = jsonResponse.indexOf("\"access_token\":\"") + 16;
	        int endIndex = jsonResponse.indexOf("\"", startIndex);
	        return jsonResponse.substring(startIndex, endIndex);
	    }
	    public static String parseRefreshToken(String jsonResponse) {
	        // Trim the JSON response to avoid issues with leading/trailing spaces
	        jsonResponse = jsonResponse.trim();

	        // Find the start index of the refresh token
	        int startIndex = jsonResponse.indexOf("\"refresh_token\":\"");
	        if (startIndex == -1) {
	            return null; // refresh_token not found in the response
	        }
	        startIndex += "\"refresh_token\":\"".length();  // Move the index to the start of the actual token

	        // Find the end index (the next quote after the start of the refresh token)
	        int endIndex = jsonResponse.indexOf("\"", startIndex);
	        if (endIndex == -1) {
	            return null; // Malformed JSON response
	        }

	        // Return the substring containing the refresh token
	        return jsonResponse.substring(startIndex, endIndex);
	    }

	}


