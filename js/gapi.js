/** This file defines everything needed to use Google API for Google Sheets
 *
 * For downloading JSON, get access_token from https://developers.google.com/oauthplayground
 * https://sheets.googleapis.com/v4/spreadsheets/1aYB9GsxRi7aUoCF8VkP0-gixdVA55pLC1HDmthVzA8I/values/'Goals'!A:J?access_token=TOKEN
 * https://sheets.googleapis.com/v4/spreadsheets/1aYB9GsxRi7aUoCF8VkP0-gixdVA55pLC1HDmthVzA8I/values/'Donations'!A:F?access_token=TOKEN
 */

// The following API_KEY and CLIENT_ID are authorized to work exclusively on localhost:8000
let API_KEY = 'AIzaSyDbkdYyhKO5vQro7jviRTCji66_u3m3wGQ';
let CLIENT_ID = '512129943461-2b4pukfo7qp3a2fa3tmtm6s64og6fbu5.apps.googleusercontent.com';

// The following API_KEY and CLIENT_ID are authorized to work exclusively on GitHub
//let API_KEY = 'AIzaSyAZ9X4uIA-bL7ETFxvn4pFpZpeuLC9rWXs';
//let CLIENT_ID = '512129943461-3nt2hu7nq6oobtnrl8iba07mrfgjdcpc.apps.googleusercontent.com';

// Allows reading a spreadsheet
let SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
// Specifies which API to use
let DISCOVERY = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

var initClient = function() {
  gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPE,
      discoveryDocs: DISCOVERY
    })
    .then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
};

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

var updateSignInStatus = function(isSignedIn) {
  if (isSignedIn) {
    makeAPICall();
  }
};

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// Load data from Goals and Donations sheets
var makeAPICall = function() {
  let params = {
    spreadsheetId: SHEET_DATA.SheetID,
    ranges: [SHEET_DATA["Goals"].range, SHEET_DATA["Donations"].range],
    valueRenderOption: 'UNFORMATTED_VALUE'
  };
  let request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request
    .then((response) => {
      setHeaders("Goals", response.result.valueRanges[0].values[0]);
      setHeaders("Donations", response.result.valueRanges[1].values[0]);
      prepareUserDataFromSheet(response.result.valueRanges[0].values, response.result.valueRanges[1].values);
    })
    .catch((error) => {
      console.error(error);
    });
};