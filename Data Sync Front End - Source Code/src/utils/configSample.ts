export const sampleConfig = 	{"servers": [
  {
  "name": "server name",
  "serverUrl": "",
  "endpoint": "/schema_query?query=",
  "clientId": "",
  "clientSecret": "",
  "tokenEndpoint": "",
  "refreshToken" :""
  } //Add more servers here
  
  ],
  "queries": [
    {
      "queryString": "SELECT * FROM TABLE_NAME",
    "viewId" : "",
    "mergeType" : "ignore", //igonre or consider_null or consider_default
    "numericDefault" : 10,
    "stringDefault" : "---"
    }
    //Add more queries here
  
  ],
  "zoho analytics configuration": {
    
  "orgId" : "",
    "workspaceId" : "",
    "clientId" : "",
    "clientSecret" : "",
    "refreshToken" : "",
  "frequency" : 1,
  "format" : "days"
  
    
  }}

export function downloadSampleConfig() {
  const blob = new Blob([JSON.stringify(sampleConfig, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sample-config.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}