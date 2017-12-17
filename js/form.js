/** */
let updateFileDetails = function(id) {
  getFileDetails(id).then((data, err) => {
    let text = "";

    if (err) {
      text = `<p>❌ ${err.message}</p>`;
    } else if (data.result && data.result.error) {
      text = `<p>❌ ${data.result.error.message}</p>`;
    } else {

      text = `<p>ℹ File: <a href="${data.webViewLink}" target="_blank">${data.name}</a></p>`;
      if (data.description) text += `<p>Description: ${data.description}</p>`;

      let time = timeSince(data.modifiedTime);
      if (data.lastModifyingUser.me) {
        text += `<p>ℹ Last modified ${time} ago, by YOU</p>`
      } else {
        text += `<p>ℹ Last modified ${time} ago, by ${data.lastModifyingUser.displayName}</p>`
      }

      if (data.capabilities.canEdit) {
        text += `<p>✅ You are permitted to edit the source file</p>`;
      } else {
        text += `<p>⛔ You are forbidden from editing the source file</p>`;
      }
    }
    $('#filedetails')[0].innerHTML = text;
  });
};

let updateSheetFile = function() {
  SHEET_DATA.SheetID = $('#sheetid')[0].value;
  updateFileDetails();
};

let resetSheetFile = function() {
  SHEET_DATA.SheetID = SHEET_DATA.Defaults.SheetID;
  updateFileDetails();
};