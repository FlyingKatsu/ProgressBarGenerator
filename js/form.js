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

/** */
let processDonationsLogger = function(text) {
  $('#log-donations')[0].innerHTML += `<p>${text}</p>`;
};

let logProcessDonations = function() {
  makeAPICall()
    .then(() => {
      processDonations(loggerFactory(LogLevel.Top, processDonationsLogger));
    })
    .catch(console.error);
};

let logCurrentProgress = function() {
  for (let i = 0; i < USER_DATA.Goals.numSlots; i++) {
    let c = USER_DATA.Goals.current[i];
    let goal = USER_DATA.Goals.slots[i][c];
    $('#log-progress')[0].innerHTML += `<p>Goal ${i+1}: ${goal.displayName} ${goal.progress} / ${goal.cost}</p>`;
  }
};

/** */
let testFPError = function() {
  let input = $('#testFP input[name=amount]')[0].value;
  let split = $('#testFP input[name=split]')[0].value;

  let targetAmt = round(input * split, 2);
  let spreadAmt = round(input * (1 - split) / (USER_DATA.Goals.numSlots - 1), 2);

  $('#log-testFP')[0].innerHTML =
    `Given a donation of \$${dollarify(input)} with a split of ${split}, the intended goal will receive \$${dollarify(targetAmt)}, while all other goals will receive \$${dollarify(spreadAmt)}.  `;

  let diff = round(input - (targetAmt + spreadAmt * (USER_DATA.Goals.numSlots - 1)), 2);

  if (diff < 0) {
    $('#log-testFP')[0].innerHTML += `Round-off Error: -${dollarify(0-diff)} (less than donated...)`;
  } else if (diff == 0) {
    $('#log-testFP')[0].innerHTML += `Round-off Error: ${dollarify(diff)} (exactly as donated)`;
  } else {
    $('#log-testFP')[0].innerHTML += `Round-off Error: +${dollarify(diff)} (more than donated!)`;
  }
};