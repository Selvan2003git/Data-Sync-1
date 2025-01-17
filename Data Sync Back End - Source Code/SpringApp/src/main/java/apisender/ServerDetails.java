package apisender;



public class ServerDetails {
    private String name;
    private String serverUrl;
    private String endpoint;
    private String clientId;
    private String clientSecret;
    private String authEndpoint;
    private String tokenEndpoint;
    private long expiryTime;
    private String accessToken;
    private String refreshToken;
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
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
    
   
    
    public String getAuthEndpoint() {
    	return authEndpoint;
    }
    
    public void setAuthEndPoint(String endpoint) {
    	this.authEndpoint = endpoint;
    }
    
    public String getTokenEndpoint() {
    	return tokenEndpoint;
    }

    public void setTokenEndpoint(String endpoint) {
    	this.tokenEndpoint = endpoint;
    }
    
    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }
    
    public String getAccessToken() {
    	return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
    	this.accessToken = accessToken;
    }
    
    public long getExpiryTime() {
    	return expiryTime;
}
     public void setExpiryTime(long expiryTime) {
    	 this.expiryTime = expiryTime;
     }
    
    
    public String toJson() {
        return "";
    }


    

}

