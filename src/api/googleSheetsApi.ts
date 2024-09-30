// src/googleSheetsApi.ts
import { gapi } from 'gapi-script';
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from './googleApiConfig';

export async function fetchSheetData(spreadsheetId: string, range: string) {
  return new Promise((resolve, reject) => {
    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
        }).then((response: any) => {
          resolve(response.result.values);
        }, (error: any) => {
          reject(error);
        });
      });
    }

    gapi.load('client:auth2', initClient);
  });
}