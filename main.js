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

  // removes squares from doc
  let divEl = document.querySelectorAll(".square");
  for (let div of divEl) {
    div.remove();
  }

  // puts new squares in doc
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = `${rowNumber},${columnNumber}`;
      const gridContainerEl = document.getElementById("grid-container");
      gridContainerEl.appendChild(squareDiv);
    });
  });

  // places mines in grid
  let mineCoords = [];
  let randomNums = [];
  for (let i = 1; i <= 40; i++) {
    let num = getRandomNumber(11, 0);
    randomNums.push(num);
  }
  for (let i = 0; i < randomNums.length; i = i + 2) {
    mineCoords.push([randomNums[i], randomNums[i + 1]]);
  }
  mineCoords.forEach(function (coordPair) {
    grid[coordPair[0]][coordPair[1]] = "m";
  });

  // add mined elements in grid array to class of equivalent div elements in DOM
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      if (square === "m") {
        divEl = document.getElementById(`${rowNumber},${columnNumber}`);
        divEl.classList.add("mine");
      }
    });
  });

  // places number around mines

  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      if (square !== "m") {
        if (
          rowNumber !== 0 &&
          rowNumber !== 11 &&
          columnNumber !== 0 &&
          columnNumber !== 11
        ) {
          let surroundingSquares = 0;
          if (grid[rowNumber - 1][columnNumber - 1] === "m") {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber] === "m") {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1] === "m") {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber - 1] === "m") {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1] === "m") {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1] === "m") {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber] === "m") {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1] === "m") {
            surroundingSquares++;
          }
          divEl = document.getElementById(`${rowNumber},${columnNumber}`);
          divEl.classList.add(surroundingSquares);
        }
      }
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

// random number generator
function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
