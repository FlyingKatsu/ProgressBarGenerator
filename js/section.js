// =============================================================
//   UTILITIES: getByID, toggle
// =============================================================

var getByID = function(id) {
  return document.getElementById(id);
};

var toggle = function(evt, e, label) {
  let disp = e.style.display;
  if (disp == "none") {
    e.style.display = "block";
    evt.target.innerText = `Hide ${label}`;
  } else {
    e.style.display = "none";
    evt.target.innerText = `Show ${label}`;
  }
};

var toggleID = function(evt, id, label) {
  // Get the specified element
  let e = getByID(id);
  // Toggle display
  toggle(evt, e, label);
};

var toggleNext = function(evt, n, label) {
  // Get the nth next element
  let e = evt.target.nextElementSibling;
  for (let i = 0; i < n; i++) { e = e.nextElementSibling; }
  // Toggle display
  toggle(evt, e, label);
};

var togglePrev = function(evt, n, label) {
  // Get the nth previous element
  let e = evt.target.previousElementSibling;
  for (let i = 0; i < n; i++) { e = e.previousElementSibling; }
  // Toggle display
  toggle(evt, e, label);
};

// =============================================================
//   DATA MODEL
// =============================================================



// =============================================================
//   DRAW METHODS
// =============================================================



// =============================================================
//   UPDATE METHODS
// =============================================================