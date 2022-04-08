// ** Variables **
let grid = [];

// **Initialising function call**

init();

// ** Event listeners **

document
  .getElementById("grid-container")
  .addEventListener("click", gridClickHandler);
document
  .getElementById("grid-container")
  .addEventListener("contextmenu", gridRightClickHandler);

document.getElementById("reset").addEventListener("click", init);

// **Functions**

//initialising function - sets grid array up, 
//removes previous square divs from doc, 
//renders new grid to doc

function init() {
  grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  let divEl = document.querySelectorAll(".square");
  for (let div of divEl) {
    div.remove();
  }
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = `${rowNumber},${columnNumber}`;
      const gridContainerEl = document.getElementById("grid-container");
      gridContainerEl.appendChild(squareDiv);
    });
  });
}

// click handlers get coords from click and 
// set grid to 1 for left click, 2 for right click
function gridClickHandler(event) {
  let coords = event.target.id;
  console.log("Clicked " + coords);
  grid[coords.split(",")[0]][[coords.split(",")[1]]] = 1;
  render();
}
function gridRightClickHandler(event) {
  let coords = event.target.id;
  console.log("Right clicked " + coords);
  grid[coords.split(",")[0]][[coords.split(",")[1]]] = 2;
  event.preventDefault();
  render();
}

// renders grid from array data
function render() {
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      if (square === 1) {
        divEl = document.getElementById(rowNumber + "," + columnNumber);
        divEl.style.backgroundColor = "red";
      } else if (square === 2) {
        divEl = document.getElementById(rowNumber + "," + columnNumber);
        divEl.style.backgroundColor = "blue";
      }
    });
  });
}
