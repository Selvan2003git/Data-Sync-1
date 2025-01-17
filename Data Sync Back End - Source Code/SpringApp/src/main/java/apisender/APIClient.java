package apisender;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.opencsv.CSVReader;

public class APIClient {
	 static APIParser apiParser = new APIParser();
	 private static final Logger LOGGER = Logger.getLogger(ResourceServerClient.class.getName());
	 
	 
	 
	 public static String fetchDataForQuery(Query query,
			 List<ServerDetails> servers, Target target, List<AccessTokenManager> tokenManagers, SseEmitter emitter) throws Exception {
		 
		 
		 
		 List<String> results = new ArrayList<>();
		 for(int i = 0;i<servers.size();++i) {
			 
			 
             AccessTokenManager tokenManager = tokenManagers.get(i);
             ServerDetails server = servers.get(i);
             try {
            	    System.out.println("\nQuery Executing on Server : "+server.getName());
            	    emitter.send("\nQuery Executing on Server : "+server.getName());
					String accessToken = tokenManager.getAccessToken();
					String query_string = query.getQueryString();
					String endpointString = server.getServerUrl() + server.getEndpoint()+ URLEncoder.encode(query_string, "UTF-8");;
					String result = downloadCSV(endpointString, accessToken,emitter);
					
					
					if(result != null) {
						   result = addColumnToCSVString(result, "server", server.getName());
					        results.add(result);
					}
					else if(result == null) {
						emitter.send("Data Received From " + server.getName() + " is Empty");
						ResourceServerClient.failedServers.add(server.getName());
					}
				 
					
				} catch (IOException e) {
					
					e.printStackTrace();
					
				}
		 
		 }
		
		 String mergedData = QuerySender.dataMerge(results,query,emitter);
		 return mergedData;
		   
	 }
	 
	 
	
		 
		 
		 public static String downloadCSV(String fileUrl, String accessToken,SseEmitter emitter) throws IOException {
		        try {
		            // Open connection to the server
		            HttpURLConnection connection = (HttpURLConnection) new URL(fileUrl).openConnection();
		            connection.setRequestMethod("GET");
		            
		            connection.setRequestProperty("Authorization", "Bearer " + accessToken);
			        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

			        connection.setConnectTimeout(5000);
			        connection.setReadTimeout(5000);

		            // Check the HTTP response code
		            int responseCode = connection.getResponseCode();
		            if (responseCode == HttpURLConnection.HTTP_OK) {
		                // Open input stream to read the response
		                try (BufferedInputStream in = new BufferedInputStream(connection.getInputStream());
		                     ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {

		                    // Buffer for data read
		                    byte[] buffer = new byte[1024];
		                    int bytesRead;

		                    // Read the response and write to a ByteArrayOutputStream
		                    while ((bytesRead = in.read(buffer)) != -1) {
		                        byteArrayOutputStream.write(buffer, 0, bytesRead);
		                    }

		                    // Convert the byte array to a String
		                    String csvData = byteArrayOutputStream.toString("UTF-8");

		                    // Print or process the CSV data

		                    return csvData;
		                    // You can now use `csvData` for data merging or further processing
		                }

		            } else {
		                System.out.println("Failed to download file. Response code: " + responseCode);
		                emitter.send("Failed to download file. Response code: " + responseCode);
		            }

		        } catch (IOException e) {
		            System.err.println("Error while downloading file: " + e.getMessage());
		            emitter.send("Error while downloading file: " + e.getMessage());
		        }
		        
		              return null;
		    }
		 
		 
		 
		 public static String addColumnToCSVString(String csvData, String newColumnHeader, String newColumnValue) {
		        // Split the CSV string into rows
			 String[] rows = csvData.split("\n");

		        // Initialize StringBuilder for the updated CSV
		        StringBuilder updatedCSV = new StringBuilder();

		        for (int i = 0; i < rows.length; i++) {
		            String row = rows[i].trim(); // Remove extra newlines or spaces

		            // Skip empty rows (e.g., if there's a trailing newline at the end)
		            if (row.isEmpty()) {
		                continue;
		            }

		            // Append the existing row
		            updatedCSV.append(row);

		            // Add the new column header or value
		            if (i == 0) {
		                // Add header to the first row
		                updatedCSV.append(",").append(newColumnHeader);
		            } else {
		                // Add the new column value to other rows
		                updatedCSV.append(",").append(newColumnValue);
		            }

		            // Add a newline at the end of the row
		            updatedCSV.append("\n");
		        }

		        // Remove the last newline character (if necessary)
		        if (updatedCSV.length() > 0 && updatedCSV.charAt(updatedCSV.length() - 1) == '\n') {
		            updatedCSV.deleteCharAt(updatedCSV.length() - 1);
		        }

		        return updatedCSV.toString();
		    
		 }
		
		 
		 
	public static String addServerName(String csv, String serverName) {
		
		StringBuilder updatedCsv = new StringBuilder();
		boolean firstLine = true;
		int i = 0;
		 try (CSVReader reader = new CSVReader(new StringReader(csv))){//FileReader())) {
	            String[] nextLine;
	   
	            while ((nextLine = reader.readNext()) != null) {
	              
	              for(int j = 0;j<nextLine.length;++j) {
	            	  updatedCsv.append(nextLine[j]+",");
	            	 
	              }
	              if(firstLine == true) {
	            	  updatedCsv.append("server\n");
	            	  firstLine  = false;
	              }
	              
	              else {
	            	  updatedCsv.append(serverName+"\n");
	              }
	              ++i;
	              if(i==3) break;
	            }
	            
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
			
//			if(firstLine == true) {
//				updatedCsv.append(line.trim() + ",server");
//				firstLine = false;
//				continue;
//			}
//			updatedCsv.append(line + "," + serverName + "\n");
//		}
//		
		
		return updatedCsv.toString();
	}
	 
	 
	 public static String makeApiCallWithToken(String resourceServerUrl, String accessToken) throws Exception {
	       
	        URL url = new URL(resourceServerUrl);
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        connection.setRequestMethod("GET");

	        
	        connection.setRequestProperty("Authorization", "Bearer " + accessToken);
	        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

	        connection.setConnectTimeout(5000);
	        connection.setReadTimeout(5000);

	        LOGGER.info("Request URL: " + resourceServerUrl);
	        
	        int responseCode = connection.getResponseCode();
	        LOGGER.info("Response Code: " + responseCode);
	         
	      

	        
	        if (responseCode == HttpURLConnection.HTTP_UNAUTHORIZED) {
	            Map<String, List<String>> headers = connection.getHeaderFields();
	            List<String> authHeader = headers.get("WWW-Authenticate");

	            if (authHeader != null && !authHeader.isEmpty()) {
	                String authHeaderValue = authHeader.get(0);
	               
	                String errorDescription = apiParser.parseErrorDescription(authHeaderValue);
	                return "Error Description: " + errorDescription;
	                
	            }
	            return "Error Description: unauthorized";
	        }

	       
	        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	        StringBuilder response = new StringBuilder();
	        String inputLine;
	        while ((inputLine = in.readLine()) != null) {
	            response.append(inputLine).append("\n");
	        }
	        in.close();
	        connection.disconnect();

	        return response.toString();
	        }
	               
	    public static String getAccessToken(String authServerUrl, String clientId, String clientSecret) throws Exception {
	      
	        URL url = new URL(authServerUrl);
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        connection.setRequestMethod("POST");

	    
	        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
	        connection.setDoOutput(true); 
	        
	        String requestBody = "grant_type=client_credentials" +
	                             "&client_id=" + clientId +
	                             "&client_secret=" + clientSecret;

	     
	        try (OutputStream os = connection.getOutputStream()) {
	            byte[] input = requestBody.getBytes(StandardCharsets.UTF_8);
	            os.write(input, 0, input.length);
	        }

	  
	        int responseCode = connection.getResponseCode();
	        System.out.println("Token Response Code: " + responseCode);

	       
	        BufferedReader reader = new BufferedReader(new InputStreamReader(
	                responseCode == 200 ? connection.getInputStream() : connection.getErrorStream()));
	        StringBuilder response = new StringBuilder();
	        String inputLine;
	       
	        while ((inputLine = reader.readLine()) != null) {
	            response.append(inputLine);
	        }
	        reader.close();

	        
	        if (responseCode == 200) {
	          
	            return apiParser.parseAccessToken(response.toString());
	        } else {
	            throw new RuntimeException("Failed to get access token. Response: " + response.toString());
	        }
	    }
	    
	    public static String getAccessTokenUsingRefresh(String clientId, String clientSecret, String tokenUrl, String refreshToken) {
	    	
	    	 try {
	    		 
	    		
	             String data = "client_id=" + clientId
	                         + "&client_secret=" + clientSecret
	                         + "&refresh_token=" + refreshToken
	                         + "&grant_type=refresh_token";
	             
	             URL url = new URL(tokenUrl);
	             HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	             connection.setRequestMethod("POST");
	             connection.setDoOutput(true);
	             connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
	             
	          
	             try (OutputStream os = connection.getOutputStream()) {
	                 byte[] input = data.getBytes(StandardCharsets.UTF_8);
	                 os.write(input, 0, input.length);
	             }

	       
	             int status = connection.getResponseCode();
	             if (status == 200) {
	                
	                 try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
	                     String line;
	                     StringBuilder response = new StringBuilder();
	                     while ((line = reader.readLine()) != null) {
	                         response.append(line);
	                     }
	                    // System.out.println("Response: " + response.toString());
	                     
	                     return apiParser.parseAccessToken(response.toString());
	                 }
	             } else {
	                 System.out.println("Error refreshing token: " + status);
	                 return null;
	             }
	         } catch (IOException e) {
	             e.printStackTrace();
	             return null;
	         }
	    }
	    
	}


