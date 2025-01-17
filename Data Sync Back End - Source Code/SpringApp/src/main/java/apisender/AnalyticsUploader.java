package apisender;

import com.zoho.analytics.client.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.concurrent.TimeUnit;
import java.io.*;


import org.json.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public class AnalyticsUploader {

	public static AnalyticsClient ac;
	AnalyticsUploader(Target target){
	
		ac = new AnalyticsClient(target.getClientId(), target.getClientSecret(), target.getRefreshToken());

	}

    public static void main(String args[]){

        
    }
    
    public static String upload(String csvData, Target target, long tableId, SseEmitter emitter) {
    	
        try {
            boolean result = importData(ac,csvData, target, tableId, emitter);
            //importDataHttp(ac,csvData,target,tableId,emitter);
            if(result == true) {
            return "success";}
            else {
            	return "failed";
            }
        }
        catch (ServerException ex) {
            System.out.println("Server exception - ErrorCode : " + ex.getErrorCode() + ", ErrorMessage : "  + ex.getErrorMessage());
            try {
				emitter.send("Server exception - ErrorCode : " + ex.getErrorCode() + ", ErrorMessage : "  + ex.getErrorMessage());
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
        catch (ParseException ex) {
            System.out.println("Parser exception - ErrorMessage : "  + ex.getResponseMessage());
            try {
				emitter.send("Parser exception - ErrorMessage : "  + ex.getResponseMessage());
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
        catch (Exception ex) {
            System.out.println("Other exception - ");
            try {
				emitter.send("Other exception - ");
			} catch (IOException e) {
				e.printStackTrace();
			}
            ex.printStackTrace();
           
        }
        return null;
    }

    public static boolean importData(AnalyticsClient ac, String csvData, Target target, long tableId, SseEmitter emitter) throws Exception {
        long orgId = target.getOrgId();
        long workspaceId = target.getWorkspaceId();
        long viewId = tableId;
        
        // Create a temporary CSV file
        File tempFile = File.createTempFile("import", ".csv");
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(csvData);
        }
        
        String importType = "TRUNCATEADD";
        boolean autoIdentify = true;
        JSONObject config = new JSONObject();
        JSONObject tools = new JSONObject();
        BulkAPI data = ac.getBulkInstance(orgId, workspaceId);
        config.put("batchKey", "start");
 
        // Start the batch import process
        long jobId = data.importDataAsBatches(viewId, importType, autoIdentify, tempFile.getAbsolutePath(), 10000, config, tools);
       
        int retryInterval = 30; // Interval in seconds
        int maxRetries = 100;
        boolean isJobCompleted = false;
        JSONObject jobDetails = data.getImportJobDetails(jobId);;
        String jobStatus = extractJobStatus(jobDetails,"jobStatus",emitter);
        System.out.println(jobId);
        
        for (int attempt = 0; attempt < maxRetries; attempt++) {
            // Get the current job details
            jobDetails = data.getImportJobDetails(jobId);
            System.out.println("job : "+ jobDetails);
            System.out.println("Uploading in Zoho Analytics...");
            emitter.send("Uploading in Zoho Analytics...");
            // Check the job status
            jobStatus = extractJobStatus(jobDetails,"jobStatus",emitter);
            if (!jobStatus.equals("JOB NOT INITIATED") && !jobStatus.equals("JOB IN PROGRESS")) {
                isJobCompleted = true;
                break;
            }

            // Wait before next retry
            try {
                TimeUnit.SECONDS.sleep(retryInterval);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Job status polling interrupted", e);
            }
        }
        boolean result = false;
        if (isJobCompleted) {
        	emitter.send(jobDetails);
        	System.out.println(jobStatus);
            if(jobStatus.equals("ERROR OCCURRED")) {
            	System.out.println("error");
            	System.out.print(jobDetails);
            	 String errorDetails = extractJobStatus(jobDetails,"importErrors", emitter);
            	 System.out.println("Import Errors : " + errorDetails);
            	
            }
            else {
            	result = true;
            }
            String batchDetails = extractJobStatus(jobDetails,"batches", emitter);
            String jobInfo = extractJobStatus(jobDetails,"jobInfo", emitter);
            System.out.println("Job Details : " + jobInfo);
            emitter.send("Job Details : " + jobInfo);
            System.out.println("Batch Details : " + batchDetails);
            emitter.send("Batch Details : " + batchDetails);
            // Proceed with the next steps
        } else {
            throw new RuntimeException("Job status did not update within the expected time");
        }
   
        return result;
        
    }
    
    public static void importDataHttp(AnalyticsClient ac, String csvData, Target target, long tableId, SseEmitter emitter) throws IOException {
        long workspaceId = target.getWorkspaceId();
        long viewId = tableId;
        long orgId = target.getOrgId();
        String accessToken = "";
        
        
        File tempFile = null;
	
			tempFile = File.createTempFile("import", ".csv");
		
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(csvData);
        } catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
        String filePath = tempFile.getAbsolutePath();

        // The JSON configuration as URL-encoded string
        String encodedConfig = "%7B%22importType%22%3A%20%22truncateadd%22%2C%20%22autoIdentify%22%3A%20%22true%22%2C%20%22batchKey%22%3A%20%22start%22%2C%20%22isLastBatch%22%3A%20%22true%22%7D";

        String requestUrl = "https://analyticsapi.zoho.in/restapi/v2/bulk/workspaces/" + workspaceId + 
                            "/views/" + viewId + "/data/batch?CONFIG=" + encodedConfig;

        try {
            // Open a connection to the URL
            URL url = new URL(requestUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("ZANALYTICS-ORGID", orgId+"");
            connection.setRequestProperty("Authorization", "Zoho-oauthtoken " + accessToken);
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=--boundary");

            // Write the multipart body
            try (OutputStream outputStream = connection.getOutputStream();
                 PrintWriter writer = new PrintWriter(new OutputStreamWriter(outputStream, "UTF-8"), true)) {

                // File Part
                writer.append("--boundary").append("\r\n");
                writer.append("Content-Disposition: form-data; name=\"FILE\"; filename=\"")
                .append(filePath)
                .append("\"")
                .append("\r\n");
                writer.append("Content-Type: text/csv").append("\r\n");
                writer.append("\r\n").flush();

                // Write the file content
                try (FileInputStream fileInputStream = new FileInputStream(filePath)) {
                    byte[] buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                    outputStream.flush();
                }
                writer.append("\r\n").flush();

                // End of multipart body
                writer.append("--boundary--").append("\r\n").flush();
            }

            // Get the response
            int responseCode = connection.getResponseCode();
   
            System.out.println("Response Code: " + responseCode);

            // Read the response
//            try (BufferedReader reader = new BufferedReader(
//                    new InputStreamReader(connection.getInputStream()))) {
//                String line;
//                while ((line = reader.readLine()) != null) {
//                    System.out.println(1+" "+line);
//                }
//            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    
    private static String extractJobStatus(JSONObject jobObjectDetails, String key, SseEmitter emitter) {
        // Extract the jobStatus from the response string (assuming JSON format)
        try {
            // Parse the JSON response (if you have a JSON library like Jackson or Gson, use it here)
            // For example:
        	if(key.equals("jobInfo")) {
        		return jobObjectDetails.getJSONObject(key).toString();
        	}
        	else if(key.equals("batches")) {
        		return jobObjectDetails.getJSONArray(key).toString();
        		
        	}
            return jobObjectDetails.getString(key);
        } catch (Exception e) {
        	try {
				emitter.send(jobObjectDetails.toString());
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
            throw new RuntimeException("Failed to parse job details JSON", e);
        }
    }
}