package apisender;

public class Query {
    private String queryString;
    private String mergeType;
    private long numericDefault;
    private String stringDefault;
    private int frequency;
    private long viewId;

    public Query() {
    }

    
    public String toString() {
        return "Query{query_string='" + queryString + "', table='" + viewId + "'}";
    }
    
    public String getQueryString() {
    	
    	return queryString;
    	
    }
    
    public void setQueryString(String queryString) {
    	this.queryString = queryString;
    }
    
    public int getFrequency() {
    	
    	return frequency;
    }
    
    public void setFrequency(int frequency) {
    	this.frequency = frequency;
    }
    
    public long getViewId() {
    	return viewId;
    }
    
    public void setViewId(long viewId) {
    	this.viewId = viewId;
    }
    
    public String getMergeType() {
    	return mergeType;
    }
    public void setMergeType(String mergeType) {
    	this.mergeType = mergeType;
    }
    
    public long getNumericDefault() {
    	return numericDefault;
    }
    public void setNumericDefault(long numericDefault) {
    	this.numericDefault = numericDefault;
    }
    
    public String getStringDefault() {
    	return stringDefault;
    }
    
    public void setStringDefault(String stringDefault) {
    	this.stringDefault = stringDefault;
    }
}