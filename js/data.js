/*
 * This file defines the GoalFactory and DonationFactory 'classes' 
 */

/* =========================================
 *               GOAL FACTORY
 * =========================================
 */

/** A Goal Object: Constructor automatically adds object to USER_DATA
 * @param {*} input Either row data retrieved from a Google Sheet request, or an object with default property values.
 * @prop {number} id Something like a Row ID, but possibly not used at all. Auto-incremented from 0.
 * @prop {number} slot The position of this goal on the display graphic. Should be a number between 0 and numSlots.
 * @prop {number} iter The position of this goal within its slot. Also describes how many times this slot has met its goal.
 * @prop {string} name The name to use in identifying this goal via donations and the Goals.map structure. Defaults to "TBD-ID".
 * @prop {string} displayName The name to write on top of the progress bar graphic. Defaults to "Unspecified".
 * @prop {string} url The url of the image to use as this goal's icon in the progress bar graphic. Defaults to "Empty.png".
 * @prop {number} cost How much money (in USD) is needed for this goal to be completed. Defaults to 100.
 * @prop {string} dateAdded The date (mm/dd/yy) of when this goal was added to the list. Defaults to today.
 * @prop {string} dateFilled The date (mm/dd/yy) of when this goal was reached. Defaults to null.
 * @prop {string} dateStarted The date (mm/dd/yy) of when this goal's model was started. Defaults to null.
 * @prop {string} dateFinished The date (mm/dd/yy) of when this goal's model was completed. Defaults to null.
 * @prop {number} refKeyVal An internal convenience for keeping the USER_DATA.Goals data structures small. Equals { slot, iter }.
 * @prop {number} progress A value that reflects how much progress has been made in completing this goal.
 * @prop {number[]} donations An array of Donation.id to keep track of which donations contributed to this goal.
 * @returns {GoalFactory} A new Goal object
 */
let GoalFactory = function(input) {
  if (input instanceof Array) {
    this.InitFromRow(input);
  } else {
    this.id = input.id || USER_DATA.Goals.map.size;
    this.slot = input.slot || 0;
    this.iter = input.iter || USER_DATA.Goals.slots[this.slot].length;
    this.name = input.name || "TBD-" + this.id;
    this.displayName = input.displayName || "Unspecified";
    this.url = input.url || "Empty.png";
    this.cost = input.cost || 100;
    this.dateAdded = input.dateAdded || new Date().toLocaleDateString('en-US'); // date when added to a slot
    this.dateFilled = input.dateFilled || null; // date when progress >= max
    this.dateStarted = input.dateStarted || null; // date when model is started
    this.dateCompleted = input.dateCompleted || null; // date when model is finished
  }
  // internal convenience
  this.refKeyVal = { slot: this.slot, iter: this.iter };
  // the following values are updated on canvas reload
  this.progress = 0;
  this.donations = []; // list of donation IDs

  // Add to USER_DATA
  this.AddToUserData();
};

/** Initializes a goal's properties, using data from a row object. See constructor. */
GoalFactory.prototype.InitFromRow = function(row) {
  this.id = GetValueFromRow(row, 'id', 'int+', 'Goals') || USER_DATA.Goals.map.size;
  this.slot = GetValueFromRow(row, 'slot', 'int+', 'Goals') || 0;
  this.iter = GetValueFromRow(row, 'iter', 'int+', 'Goals') || USER_DATA.Goals.slots[this.slot].length;
  this.name = GetValueFromRow(row, 'name', 'string', 'Goals') || "TBD";
  this.displayName = GetValueFromRow(row, 'displayName', 'string', 'Goals') || "Unspecified";
  this.url = GetValueFromRow(row, 'url', 'string', 'Goals') || "Empty.png";
  this.cost = GetValueFromRow(row, 'cost', 'int+', 'Goals') || 100;
  this.dateAdded = GetValueFromRow(row, 'dateAdded', 'date', 'Goals') || new Date().toLocaleDateString('en-US'); // date when added to a slot
  this.dateFilled = GetValueFromRow(row, 'dateFilled', '?date', 'Goals') || null; // date when progress >= max
  this.dateStarted = GetValueFromRow(row, 'dateStarted', '?date', 'Goals') || null; // date when model is started
  this.dateCompleted = GetValueFromRow(row, 'dateCompleted', '?date', 'Goals') || null; // date when model is finished
};

/** Adds this goal to the USER_DATA.Goals data structures */
GoalFactory.prototype.AddToUserData = function() {
  // Add to map
  USER_DATA.Goals.map.set(this.name.toLowerCase(), this.refKeyVal);
  // Add to slots
  if (USER_DATA.Goals.slots.length > this.iter) {
    USER_DATA.Goals.slots[this.slot][this.iter] = this;
  } else {
    USER_DATA.Goals.slots[this.slot].push(this);
  }
  // TODO: Add to current
  // TODO: Add to completed
};

/** Adds a split amount to the goal's progress, and deals with completed goals.
 * @param {number} amt Amount to progress this goal by
 * @param {number} userID  Donation.id of this applied donation
 * @param {string} userName Donation.user name of whoever gave this donation amount
 * @param {string} method How this amount should be treated. Values: 'target', 'spread', 'leftover'
 */
GoalFactory.prototype.ApplySplitDonation = function(amt, userID, userName, method) {
  // Apply amount
  this.progress = round(parseFloat(this.progress) + amt, 2);
  // Remember the donor, but only if the goal was the target
  if (method == "target") this.donations.push(userID);
  // If met the goal, move to completed and create a new goal to collect remaining
  if (this.progress >= this.cost) {
    let leftover = round(this.progress - this.cost, 2);
    this.dateFilled = new Date().toLocaleDateString('en-US');
    USER_DATA.Goals.complete.push(this.refKeyVal);
    USER_DATA.Goals.current[this.slot] = this.iter + 1;
    // Create a new goal, if there is not yet a goal for the current slot/iteration
    if (USER_DATA.Goals.slots[this.slot].length <= USER_DATA.Goals.current[this.slot]) {
      let newGoal = new GoalFactory({
        slot: this.slot,
        progress: leftover
      });
    } else {
      // Add the leftovers to the new current goal in this slot
      USER_DATA.Goals.slots[this.slot][USER_DATA.Goals.current[this.slot]]
        .ApplySplitDonation(leftover, userID, userName, "leftover");
    }
    // Report awesomeness
    if (method == "spread") {
      console.log(`BONUS!! ${userName}'s donation spread filled up ${this.displayName}!`);
    } else if (method == "target") {
      console.log(`${userName}'s donation filled up ${this.displayName}!`);
    } else {
      console.log(`SUPER BONUS!! ${userName}'s donation leftovers filled up ${this.displayName}!`);
    }
  }
};


/* =========================================
 *           DONATION FACTORY
 * =========================================
 */

/** A Donation Object: Constructor automatically adds object to USER_DATA
 * @param {Array} row The row data retrieved from a Google Sheet request.
 * @prop {number} id The index of this donation in the global donations array. Auto-incremented from 0.
 * @prop {string} user The username of whoever made this donation. Defaults to "Anonymous".
 * @prop {string} target The Goal object (matching row.name) for which this money was donated. Defaults to null.
 * @prop {number} amt How much money (in USD) was donated by user. Defaults to 0.
 * @prop {string} date The date (mm/dd/yy) of when this donation was received. Defaults to today.
 * @prop {number} split What fraction of amt should go to the target goal. Defaults to 0.8.
 * @returns {DonationFactory} A new Donation object
 */
let DonationFactory = function(row) {
  let tempID = GetValueFromRow(row, 'id', 'int+', 'Donations');
  this.id = (tempID != null) ? tempID : USER_DATA.Donations.length; // since we initialize the array size, we must account for falsey value 0
  this.user = GetValueFromRow(row, 'user', 'string', 'Donations') || "Anonymous";
  this.target = GetValueFromRow(row, 'target', 'goal', 'Donations') || null;
  this.amt = GetValueFromRow(row, 'amt', 'int+', 'Donations') || 0;
  this.date = GetValueFromRow(row, 'date', 'date', 'Donations') || new Date().toLocaleDateString('en-US');
  this.split = GetValueFromRow(row, 'split', 'fraction', 'Donations') || 0.8;

  // Add to USER_DATA.Donations
  this.AddToUserData();
};

/** Inserts or pushes this donation into USER_DATA.Donations array, depending on the array length and this.id */
DonationFactory.prototype.AddToUserData = function() {
  // Add to Donations
  if (USER_DATA.Donations.length > this.id) {
    USER_DATA.Donations[this.id] = this;
  } else {
    USER_DATA.Donations.push(this);
  }
};

/** Apply a donation and update its target goal */
DonationFactory.prototype.Apply = function() {
  // Ignore null targets
  if (!this.target) return;
  // Split amount and give to each of the current goals
  let targetAmt = round(this.amt * this.split, 2);
  let spreadAmt = round(this.amt * (1 - this.split) / (USER_DATA.Goals.numSlots - 1), 2);
  for (let i = 0; i < USER_DATA.Goals.numSlots; i++) {
    let goal = USER_DATA.Goals.slots[i][USER_DATA.Goals.current[i]];
    if (goal == this.target) {
      goal.ApplySplitDonation(targetAmt, this.id, this.user, "target");
    } else {
      goal.ApplySplitDonation(spreadAmt, this.id, this.user, "spread");
    }
  }
};