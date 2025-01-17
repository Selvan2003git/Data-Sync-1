package apisender;

public class Target {
   
    
    private long orgId = 102012;
    private long workspaceId;
    private String clientId;
    private String clientSecret;
    private String refreshToken;
    private String format;
    private int frequency;
    private String accessToken;
    public long expiryTime;


    public Target() {
    }

    
    public String toString() {
        return "Target{user='" + orgId + "', workspace='" + workspaceId + "'}";
    }
    
    
    
   public void setOrgId(long orgId) {
    	this.orgId = orgId;
    }
public long getOrgId() {
    	
    	return orgId;
    }
    
    public long getWorkspaceId() {
    	return workspaceId;
    }
    public void setWorkspaceId(long workspaceId) {
    	this.workspaceId = workspaceId;
    }
    
    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }
    
    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }
    
    public String getRefreshToken() {
    	return refreshToken;
    }
    
    public void setRefreshToken(String token) {
    	this.refreshToken = token;
    }
    public void setFrequency(int frequency) {
    	this.frequency = frequency;
    }
    public int getFrequency() {
    	return this.frequency;
    }
    
    public void setFormat(String format) {
    	this.format = format;
    }
    public void setAccessToken(String accessToken) {
    	this.accessToken = accessToken;
    }
    
    public String getAccessToken() {
    	return this.accessToken;
    }
    public void setExpiryTime(long expiryTime) {
    	this.expiryTime = expiryTime;
    }
    public long getExpiryTime() {
    	return expiryTime;
    }
}