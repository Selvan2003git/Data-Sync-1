package apisender;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class AccessTokenManager {

    private String accessToken;
    private long expiryTime; 
    private String refreshToken;
    private String clientId;
    private String clientSecret;
    private String tokenUrl; 

    public AccessTokenManager(String clientId, String clientSecret, String refreshToken, String accessToken,
    		long expiryTime, String tokenUrl) {
    	
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        this.expiryTime = expiryTime;
        this.tokenUrl = tokenUrl;
        
    }

    public boolean isTokenExpired() {
        return System.currentTimeMillis() > expiryTime;
    }

    
    public void refreshAccessToken() throws IOException {
        
        String newAccessToken = APIClient.getAccessTokenUsingRefresh(clientId, clientSecret, tokenUrl, refreshToken);        
        this.accessToken = newAccessToken;

        this.expiryTime = System.currentTimeMillis() + TimeUnit.HOURS.toMillis(1);
        System.out.println("Token Refreshed");
    }

   
    public String getAccessToken() throws IOException {
        
        if (isTokenExpired()) {
            refreshAccessToken();
        }
        return accessToken;
    }
}


