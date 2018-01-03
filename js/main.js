/*
 * This file defines the global data structures and utility functions 
 */

/* ================================================
 *             GLOBAL DATA STRUCTURES
 * ================================================
 */
let SHEET_DATA = {
  Defaults: {
    SheetID: '1aYB9GsxRi7aUoCF8VkP0-gixdVA55pLC1HDmthVzA8I',
    Goals: {
      range: `'Goals'!A:J`,
      header: {},
    },
    Donations: {
      range: `'Donations'!A:F`,
      header: {}
    }
  },
  SheetID: '1aYB9GsxRi7aUoCF8VkP0-gixdVA55pLC1HDmthVzA8I',
  Goals: {
    range: `'Goals'!A:J`,
    header: {},
  },
  Donations: {
    range: `'Donations'!A:F`,
    header: {}
  }
};
let USER_DATA = {
  Goals: {
    numSlots: 4,
    slots: [
      [
        // 0,0 GoalFactory object
        // 0,1 GoalFactory object
      ],
      [
        // 1,0 GoalFactory object
      ],
      [
        // 2,0 GoalFactory object
        // 2,1 GoalFactory object
      ],
      [
        // 3,0 GoalFactory object
      ]
    ],
    current: [], // uses index into slots[slotIndex]; ex: [1,0,1,0]
    complete: [], // uses {slotIndex, slots[slotIndex]Index}; ex: [{ slot: 2, iter: 0 }, { slot: 0, iter: 0 }]
    map: new Map() // maps a Goal.name to {slotIndex, data[slotIndex]Index}
  },
  Donations: [
    // DonationFactory object
  ]
};


/* ================================================
 *                 UTILITY METHODS
 * ================================================
 */

/** Round a value to the specified number of decimal places
 * @author https://stackoverflow.com/a/34796988
 * @param {number} value The value to round
 * @param {number} decimals The number of decimal places to keep
 * @returns {number} A number rounded from value with the given number of decimal places
 */
let round = function(value, decimals) {
  return parseFloat(Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals));
};

/** Convert number (or compatible string) to $1.23 format */
let dollarify = function(value) {
  let text = value + "";
  let index = text.indexOf('.');
  if (index < 0) { // Number has no decimals
    return `${text}.00`;
  } else {
    if (index == 0) text = "0" + text; // Number has no leading 0
    if (text.substr(index).length < 3) { // Number has too few decimal places
      return `${text}0`;
    } else { // Number has too many decimal places
      return `${text.substring(0,index+3)}`;
    }
  }
};

/** Log Levels */
let LogLevel = {
  Verbose: 0,
  Standard: 1,
  Top: 2
};

let loggerFactory = function(level, logger) {
  return function(lvl, text) {
    if (lvl >= level) logger(text);
  };
};

/**
 * @author https://stackoverflow.com/a/23259289
 * @param {string} date A string that can be interpreted as a Date
 * @returns {string} Description of how much time has passed since date
 */
var timeSince = function(date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return interval + ' ' + intervalType;
};

/** Convert a string into an expected data type
 * @param {string} value The value to convert
 * @param {string} type The data type to output: 'int', 'int+' (non-negative), 'fraction' (like 0.8), 'date', 'goal' (a GoalFactory object). A leading '?' marks nullable values.
 * @returns {*} The converted value, or null if incompatible
 */
let parseTypeFromString = function(value, type) {
  let result;
  if (type.startsWith('?')) {
    type = type.substr(1);
    if (value == null || value == undefined) return null;
  } else {
    if (value == null || value == undefined) {
      console.error(`The value ${value} is not defined!`);
      return null;
    }
  }
  switch (type) {
    case 'int':
      result = parseInt(value);
      if (!isNaN(result)) {
        return result;
      } else {
        console.error(`The value ${value} is not an acceptable number.`);
      }
      break;
    case 'int+':
      result = parseInt(value);
      if (!isNaN(result) && result >= 0) {
        return result;
      } else {
        console.error(`The value ${value} is not an acceptable number. Value v must be a number that satisfies '0.0 <= v'`);
      }
      break;
    case 'fraction':
      result = parseFloat(value);
      if (!isNaN(result) && result >= 0 && result <= 1) {
        return result;
      } else {
        console.error(`The value ${value} is not an acceptable fraction. Value v must be a number that satisfies '0.0 <= v <= 1.0'`);
      }
      break;
    case 'date':
      result = new Date(value).toLocaleDateString('en-US');
      if (result != "Invalid Date") {
        return result;
      } else {
        console.error(`The value ${value} is not an acceptable Date. Try using the format 'mm/dd/yy'`);
      }
      break;
    case 'goal':
      let key = value.toLowerCase();
      if (USER_DATA.Goals.map.has(key)) {
        let coords = USER_DATA.Goals.map.get(key);
        return USER_DATA.Goals.slots[coords.slot][coords.iter];
      } else {
        console.error(`The value ${value} is not an recognized Goal.name`);
      }
      break;
    case 'string':
    default:
      return value;
      break;
  }
  return null;
};


/* ================================================
 *           INTERFACING HELPER METHODS
 * ================================================
 */

/** Set up the mapping of property names to field index, given a type and a row
 * @param {string} type Either "Goals" or "Donations". A property of SHEET_DATA with a header object
 * @param {Array} row The first row of a spreadsheet that labels the fields/properties for all subsequent row data
 */
let setHeaders = function(type, row) {
  for (let i = 0; i < row.length; i++) {
    SHEET_DATA[type].header[row[i]] = i;
  }
};

/** To be called when reloading data from sheets to browser
 * @param {Object[]} goalRows An array of data rows retrieved from an API call on the Goals range.
 * @param {Object[]} donRows An array of data rows retrieved from an API call on the Donations range.
 */
let prepareUserDataFromSheet = function(goalRows, donRows) {
  if (goalRows) {
    // Reset structure
    USER_DATA.Goals.complete = [];
    USER_DATA.Goals.current = Array.apply(null, Array(USER_DATA.Goals.numSlots)).map(function(v, i, arr) { return 0; });
    USER_DATA.Goals.map = new Map();
    USER_DATA.Goals.slots = Array.apply(null, Array(USER_DATA.Goals.numSlots)).map(function(v, i, arr) { return []; });
    // Populate it!
    goalRows.map((row, i, arr) => {
      if (i == 0) return;
      let goal = new GoalFactory(row); // automatically added to USER_DATA
    });
  }
  if (donRows) { // Set length of the arrays to be the length of the results (-1 for headers) in case the sheet data got sorted and is no longer in order
    // Reset structure
    USER_DATA.Donations = Array.apply(null, Array(donRows.length - 1)).map(function() {});
    // Populate it!
    donRows.map((row, i, arr) => {
      if (i == 0) return;
      let donation = new DonationFactory(row); // automatically added to USER_DATA
    });
  }
};

/** Convert a value from a GoogleSheet row into an expected type
 * @param {Array} row The row data retrieved from a Google Sheet request.
 * @param {string} prop A property of GoalFactory.
 * @param {string} type The keyword describing the expected data type (see parseTypeFromString).
 * @param {string} repo The key into USER_DATA (Goals or Donations)
 * @returns {*} A value from row with the expected data type of prop
 */
let GetValueFromRow = function(row, prop, type, repo) {
  let value = row[SHEET_DATA[repo].header[prop]];
  return parseTypeFromString(value, type);
};

/** For use AFTER the USER_DATA has been populated with goals and donations. 
 * Iterates over Donations to update Goal progress data for canvas drawing.
 */
let processDonations = function(logger) {
  if (logger == null) {
    logger = loggerFactory(LogLevel.Standard, console.log);
  };
  USER_DATA.Donations.map((donation, i, arr) => {
    if (donation) donation.Apply(logger);
  });
  logger(LogLevel.Top, `Processed ${USER_DATA.Donations.length} donations.`);
};

/**
 * Prints the current progress of the current goals in the slots
 */
let currentProgress = function() {
  for (let i = 0; i < USER_DATA.Goals.numSlots; i++) {
    let c = USER_DATA.Goals.current[i];
    let goal = USER_DATA.Goals.slots[i][c];
    console.log(`Goal ${i+1}: ${goal.displayName} ${goal.progress} / ${goal.cost}`);
  }
};