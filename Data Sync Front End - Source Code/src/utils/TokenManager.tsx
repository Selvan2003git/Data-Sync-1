export interface TokenDetails {
    refresh_token: string;
    access_token: string;
    expiryTime: number;
  }
  
  export interface TokenResponse {
    access_token: string;
    expiryTime: number;
  }
  
  export async function getAccessToken(
    serverName : string,
    clientId: string,
    clientSecret: string,
    tokenUrl: string,
    { refresh_token, access_token, expiryTime }: TokenDetails
  ): Promise<TokenResponse> {
    // Function to refresh the access token
    async function refreshAccessToken(): Promise<TokenResponse> {
      try {
        // Create URL-encoded data string
        const requestBody = `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&refresh_token=${encodeURIComponent(refresh_token)}&grant_type=refresh_token`;
  
        // Make the POST request to refresh the token
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: requestBody,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to refresh access token: ${errorData.error || response.statusText}`);
        }
  
        const result: { access_token: string; expires_in: number } = await response.json();
        // console.log('Access token refreshed:', result.access_token);
        // console.log('Access token expires in:', result.expires_in, 'seconds');
        // console.log(result);
  
        // Return the new access token and its expiry time
        return {
          access_token: result.access_token,
          expiryTime: Date.now() + result.expires_in * 1000, // Convert seconds to milliseconds
        };
      } catch (error: any) {
        console.error('Error refreshing access token:', error.message);
        alert(serverName+"'s" + "  Refresh token invalid or expired!");
        throw new Error('Refresh token invalid or expired.');
      }
    }
  
    // Check if the token needs to be refreshed
    if (Date.now() >= expiryTime - 5000 || access_token === '') {
      console.warn('Access token is expired or near expiry, refreshing...');
      return await refreshAccessToken();
    }
  
    // Token is still valid, return it as is
    // console.log("access Token is valid");
    return { access_token, expiryTime };
  }
  