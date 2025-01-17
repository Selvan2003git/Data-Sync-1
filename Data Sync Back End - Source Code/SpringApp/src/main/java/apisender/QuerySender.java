package apisender;

import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Scanner;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.opencsv.CSVReader;

public class QuerySender {

    public static void main(String[] args) {
        List<String> serverUrls = new ArrayList<>();
        serverUrls.add("http://localhost:8083/schema_query");
        serverUrls.add("http://localhost:8084/schema_query");

        String sqlQuery = "SELECT * FROM students;";
        int serverIdCount = 1;
        int rowSize = 0;
        int fetchedServers = 0;
        
        ArrayList<ArrayList<ArrayList<String>>> data = new ArrayList<>();

        for (String serverUrl : serverUrls) {
        	System.out.println("Getting Data from Server : " + serverIdCount);
            try {
                String response = sendSQLQuery(serverUrl, sqlQuery);
               System.out.println("Server "+serverIdCount+" Response from " + serverUrl + ":\n\n" + response);
                ArrayList<ArrayList<String>> rowData = new ArrayList<>();
                for(String res : response.split("\n")) {
                	 ArrayList<String> colValues = new ArrayList<>();
                	 for(String val : res.split(",")){
                		    colValues.add(val);   		 
                	 } 
                	 rowData.add(colValues);
                }
                
                data.add(rowData);
                ++fetchedServers;
                
            } catch (Exception e) {
                System.err.println("Server "+serverIdCount+" Error communicating with server " + serverUrl + ": " + e.getMessage());
            }
            ++serverIdCount;
        }
        
        rowSize = countRows(data) + 1;
        
       
        
        
        //Merging Codes
        //System.out.println(data);
        
        
        Scanner sc = new Scanner(System.in);
        int input;
        
        do {
        
        System.out.println("-----------------------Merge the downloaded data------------------");
        System.out.println("1. Ignore the non matching data");
        System.out.println("2. Place Null value for missing data");
        System.out.println("3. Place default values for missing data");
        System.out.println("4. Do all the above mergings");
        
        System.out.print("Enter the Merging operation : ");
        input = sc.nextInt();
        
        if(input == 1) mergeDataIgnore(data, rowSize);
        else if(input == 2) mergeDataConsiderNull(data, rowSize); 
        else if(input == 3) {
        	
        	mergeDataConsiderDefault(data,rowSize,"-","-1");
        	
        }
        else if(input == 4) {
        	
        	 mergeDataIgnore(data, rowSize);
        	 mergeDataConsiderNull(data, rowSize);
        	
        }
     
        
        }
        while(input != 0);
       
      
         
    }
    
    
    public static String dataMerge(List<String> csvData, Query query, SseEmitter emitter) throws IOException {
    	
    	 ArrayList<ArrayList<ArrayList<String>>> allData = new ArrayList<>();
    	 int i = 0;
    	 for(String data : csvData) {
            // System.out.println(data.split("\n")[0]);
    		 
    		 
    		 
    		     
    		    
    		 ArrayList<ArrayList<String>> rowData = new ArrayList<>();
    		 //FileWriter fileWriter = new FileWriter("merged_files/test2.txt");
    		 
    		 String[] rows = data.split("\n");
    	        
    	        List<String[]> result = new ArrayList<>();
    	        
    	        // Process each row
    	        for (String row : rows) {
    	            // Split the row by commas but preserve quotes around fields
    	        	ArrayList<String> colData = new ArrayList<>();
    	            String[] columns = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    	            for(String col : columns) {colData.add(col);}
    	            rowData.add(colData);
//    	            
//    	            // Add the columns to the result
//    	            
//    	        
    	        }
//    		 try (CSVReader csvReader = new CSVReader(new StringReader(data))) {
//    	            //List<String[]> rows = csvReader.readAll();
//    	            
//    	            String[] nextLine;
//    	            i= 0;
//    	            while ((nextLine = csvReader.readNext()) != null) {
//    	            	++i;
//    	            	//System.out.println(nextLine.length);
//    	              ArrayList<String> colValues = new ArrayList<>();
//    	              for(int j = 0;j<nextLine.length;++j)	{
//    	            	  
//    	              if(i<=3) {fileWriter.write(nextLine[j]); System.out.print("col : " + nextLine[j]+" ");} 
//    	              colValues.add(nextLine[j]); 
//    	              }
//    	              
//    	              rowData.add(colValues);
//    	              if(i<=3)System.out.println();
//    	             
//    	            }
    	            
    	            allData.add(rowData);
    	            
    	          //  System.out.println();
                    
//    	            for (String[] row : rows) {
//    	            	++i;
//    	            	//System.out.println(row);
//    	            	ArrayList<String> colValues = new ArrayList<>();
//    	                for (String cell : row) {
//    	                    System.out.print(cell + " : " + row +"  ");
//    	                     colValues.add(cell); 
//    	                }
//    	                rowData.add(colValues);
//    	                // System.out.println();
//    	                if(i==2) return null;
//    	            }
//    	            allData.add(rowData);	
    	           
//    	        } catch (Exception e) {
//    	            e.printStackTrace();
//    	        }
//             for(String res : data.split("\n")) {
//             	 ArrayList<String> colValues = new ArrayList<>();
//             	 for(String val : res.split(",")){
//             		    colValues.add(val);   		 
//             	 } 
//             	 rowData.add(colValues);
//             }
             
            
    	 }
    	 int rowSize = countRows(allData) + 1;
    	 
    	 String mergeType = query.getMergeType();
    	 
         if(mergeType.equals("ignore")) {
    	     System.out.println("\nMerge Ignore");
    	     emitter.send("\nMerge Ignore");
        	 return mergeDataIgnore(allData, rowSize);
         }
         
         else if(mergeType.equals("consider_null")) {
        	 System.out.println("\nMerge Consider null");
        	 emitter.send("\nMerge Consider null");
        	 return mergeDataConsiderNull(allData, rowSize);
         }
         else if(mergeType.equals("consider_default")) {
        	 System.out.println("\nMerge Consider default");
        	 emitter.send("\nMerge Consider default");
        	 return mergeDataConsiderDefault(allData, rowSize, query.getStringDefault(), query.getNumericDefault()+"");
         }
         
         return null;
    		        
    }

    private static String sendSQLQuery(String serverUrl, String sqlQuery) throws Exception {

  
        String encodedQuery = java.net.URLEncoder.encode(sqlQuery, "UTF-8");
        String fullUrl = serverUrl + "?query=" + encodedQuery;

        URL url = new URL(fullUrl);

        
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("GET");
        connection.setRequestProperty("Accept", "application/json");

        int responseCode = connection.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new Exception("HTTP error code: " + responseCode);
        }

        try (Scanner scanner = new Scanner(connection.getInputStream(), "utf-8")) {
            scanner.useDelimiter("\\A");
            return scanner.hasNext() ? scanner.next() : "";
        } catch (Exception e) {
            throw new Exception("Error reading response: " + e.getMessage());
        } finally {
            connection.disconnect();
        }
    }
    
    public static LinkedHashSet<String> findCommonColums(ArrayList<ArrayList<ArrayList<String>>> data) {
    	
    	   LinkedHashSet<String> commonColums = new LinkedHashSet<>();
    	   LinkedHashMap<String,Integer> columCount = new LinkedHashMap<>();
    	   for(int i = 0;i<data.size();++i) {
    		   
    		   for(int j = 0;j<data.get(i).get(0).size();++j) {	   
    			   String columName = data.get(i).get(0).get(j);
        		   columCount.put(columName, columCount.getOrDefault(columName, 0) + 1);
    			   
    		   }
    		   
    	   }
    	   
    	    //System.out.print(columCount);
    	    int dataSize = data.size();
    	    
    	    for(String key : columCount.keySet()) {
    	    	
    	    	if(columCount.get(key) == dataSize) {
    	    		commonColums.add(key);
    	    	}  	
    	    }
    	      
    	   return commonColums;
	 
    }
    
    public static LinkedHashSet<String> findAllUniqueColums(ArrayList<ArrayList<ArrayList<String>>> data){
    	  LinkedHashSet<String> uniqueColums = new LinkedHashSet<>();
    	  
    	  int dataSize = data.size();
    	  for(int i = 0;i<dataSize;++i) {
    		  int colSize = data.get(i).get(0).size();
    		  for(int j = 0; j<colSize;++j) {
    			  uniqueColums.add(data.get(i).get(0).get(j));
    		  }
    		  
    	  }
    	  	  
    	  return uniqueColums;
    
    }
    
    public static HashMap<String, Integer> setColumIndices(LinkedHashSet<String> colums) {
    	
    	HashMap<String,Integer> columIndices = new HashMap<>();
    	int index = 0;
    	for(String colum : colums) {
    		columIndices.put(colum, index);
    		++index;
    	}
    	return columIndices;
    	
    }
    
    public static HashMap<String, String> setColumDataType(ArrayList<ArrayList<ArrayList<String>>> data){
    	
    	HashMap<String, String> columDataTypes = new HashMap<>();
    	
    	int dataSize = data.size();
    	for(int i = 0;i<dataSize;++i) {
    		int rows_n = data.get(i).size();
    		if(rows_n <= 1) continue;
    		int colSize = data.get(i).get(0).size();
    		
    		for(int j = 0;j<colSize;++j) {
 	
    			String val = data.get(i).get(1).get(j);
    			String columName = data.get(i).get(0).get(j);
    			if(val.matches("\\d+")) {
    				columDataTypes.put(columName, "numeric");
    			}
    			else {
    				columDataTypes.put(columName, "string");
    			}
    		}
    		
    	}
    	
    	
    	
    	
    	return columDataTypes;
    }
    
    public static int countRows(ArrayList<ArrayList<ArrayList<String>>> data) {
    	int rowSize = 0;
    	int dataSize = data.size();
    	
    	for(int i = 0;i<dataSize;++i) {
    		rowSize += data.get(i).size() - 1;
    	}
    		
    	return rowSize;
    }
    
    public static String mergeDataIgnore(ArrayList<ArrayList<ArrayList<String>>> data, int rowSize) {
    	
    	
    	 	
    	LinkedHashSet<String> commonColums = findCommonColums(data);        
        HashMap<String, Integer> columIndices = setColumIndices(commonColums);
   
        int colSize = commonColums.size();
        String mergedData[][] = new String[rowSize][colSize];
        
//        System.out.println("colSize : "+commonColums.size());
//        System.out.println("rowSize : "+rowSize);
        
        int index = 0;
        for(String colum : commonColums) {
       	 mergedData[0][index] = colum;
//       	 System.out.print(mergedData[0][index]+", ");
       	 ++index;
        }
//        System.out.println();
//        
//        System.out.println("1 + "+data.get(0).get(0).size());
//        System.out.println("2 + "+data.get(0).get(1).size());
//        
        int rowInd = 1;
       // System.out.println(data);
        for(int i = 0;i<data.size();++i) {
       	 //System.out.println("server data size : "+data.size());
       	for(int j = 1;j<data.get(i).size();++j) {
       		//System.out.println("row Size : " + data.get(i).size());
       		for(int k = 0;k<data.get(i).get(j).size();++k) {
       			 // if(k == data.get(i).get(j).size() - 1) //System.out.println(data.get(i).get(j).get(k));
       			    //System.out.println("col size : "+data.get(i).get(j).size());
       			    String columName = data.get(i).get(0).get(k);
       			    //System.out.println("headers size : "+data.get(i).get(0).size());
       			    if(commonColums.contains(columName) == true) {
       			    	int colInd = columIndices.get(columName);
       			    	String val = data.get(i).get(j).get(k);
       			    	mergedData[rowInd][colInd] = val;
       			    }
       			
       			
       		}
       		++rowInd;
       	}
       	 
       	 
        }
        
      String csv = convertToCSV(mergedData);
        
      return csv;
   // return null;
    	
    	
    	
    }
    
    
    public static String mergeDataConsiderNull(ArrayList<ArrayList<ArrayList<String>>> data, int rowSize) {
    	
    	
    	
    	 
    	 LinkedHashSet<String> uniqueColums = findAllUniqueColums(data);
         //System.out.println(uniqueColums);
         
         HashMap<String, Integer> uniqueColumIndices = setColumIndices(uniqueColums);
         
         //System.out.println(uniqueColumIndices);
         
         int colSize = uniqueColumIndices.size();
         String mergedData[][] =  new String[rowSize][colSize];
         for(int i = 0;i<rowSize;++i) {
        	 for(int j = 0;j<colSize;++j) {
        		 mergedData[i][j] = "";
        	 }
         }
         int colInd = 0;
         for(String colum : uniqueColums) {
        	 mergedData[0][colInd] = colum;
        	 ++colInd;
         }
         
         int rowInd = 1;
         
         for(int i = 0;i<data.size();++i) {
        	 
        	for(int j = 1;j<data.get(i).size();++j) {
        		for(int k = 0;k<data.get(i).get(j).size();++k) {
        			    String columName = data.get(i).get(0).get(k);
        			    if(uniqueColums.contains(columName) == true) {
        			    	colInd = uniqueColumIndices.get(columName);
        			    	String val = data.get(i).get(j).get(k);
        			    	mergedData[rowInd][colInd] = val;
        			    }
        			
        			
        		}
        		++rowInd;
        	}
        	 
        	 
         }
         
         String csv = convertToCSV(mergedData);
         
         return csv;
       	
         
       
    }
    
    public static String mergeDataConsiderDefault(ArrayList<ArrayList<ArrayList<String>>> data, int rowSize, String strDefaultVal, String numericDefaultVal) {
    	

   	  
   	 
   	    LinkedHashSet<String> uniqueColums = findAllUniqueColums(data);
        //System.out.println(uniqueColums);
        
        HashMap<String, Integer> uniqueColumIndices = setColumIndices(uniqueColums);
        HashMap<String, String> columDataTypes = setColumDataType(data);
        
        //System.out.println(columDataTypes);
        
        //System.out.println(uniqueColumIndices);
        
        int colSize = uniqueColumIndices.size();
        String mergedData[][] =  new String[rowSize][colSize];
        
        int colInd = 0;
        for(String colum : uniqueColums) {
       	 mergedData[0][colInd] = colum;
       	 ++colInd;
        }
        
        int rowInd = 1;
        
        for(int i = 0;i<data.size();++i) {
       	 
       	for(int j = 1;j<data.get(i).size();++j) {
       		for(int k = 0;k<data.get(i).get(j).size();++k) {
       			    String columName = data.get(i).get(0).get(k);
       			    if(uniqueColums.contains(columName) == true) {
       			    	colInd = uniqueColumIndices.get(columName);
       			    	String val = data.get(i).get(j).get(k);
       			    	mergedData[rowInd][colInd] = val;
       			    }
       			    
       			    else {
       			         String val = data.get(i).get(j).get(k);
       			         if(val.matches("\\d+")) {
       			        	 mergedData[rowInd][k] = numericDefaultVal;
       			         }
       			         else {
       			        	 mergedData[rowInd][k] = strDefaultVal;
       			         }
       			    	
       			    }
       			
       			
       		}
       		++rowInd;
       	}
       	 
       	 
        }
        
        for(String colum : uniqueColums) {
        	int colIndex = uniqueColumIndices.get(colum);
        	String placeHolder = strDefaultVal;
        	if(columDataTypes.get(colum).matches("numeric") == true) {
        		placeHolder = numericDefaultVal;
        	}
        	for(int rowIndex = 0;rowIndex<rowSize;++rowIndex) {
        		
        		if(mergedData[rowIndex][colIndex] == null) {
        			mergedData[rowIndex][colIndex] = placeHolder;
        		}
        		
        	}
        }
        
        String csv = convertToCSV(mergedData);
        
        return csv;
      	
    	  
    }
    
    public static String convertToCSV(String[][] mergedData) {
    	 int rowSize = mergedData.length;
    	 int colSize = mergedData[0].length;
    	 StringBuilder res = new StringBuilder();
    	
    	 for(int i = 0;i<rowSize;++i) {
    		 for(int j = 0;j<colSize;++j) {
    			      
        			 res.append(mergedData[i][j]);
        			 if(j != colSize - 1) res.append(",");
                 } 
    		 
   
    		 res.append("\n");
    		 
    			 
    			 
    		 }
    	
    	
    	 
    	 return res.toString();
    	 
  	
    
} 
}