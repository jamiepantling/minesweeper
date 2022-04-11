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
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  ];

  // removes squares from doc
  let divEl = document.querySelectorAll(".square");
  for (let div of divEl) {
    div.remove();
  }

  // sets up objects, puts new squares in doc
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      square.mine = false;
      if (
        rowNumber === 0 ||
        columnNumber === 0 ||
        rowNumber === 11 ||
        columnNumber === 11
      ) {
        square.edge = true;
      } else square.edge = false;
      square.hidden = true;
      const squareDiv = document.createElement("div");
      squareDiv.classList.add("square");
      squareDiv.id = `${rowNumber},${columnNumber}`;
      let pEl = document.createElement("p")
      squareDiv.appendChild(pEl)
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
  console.log(mineCoords);
  mineCoords.forEach(function (coordPair) {
    grid[coordPair[0]][coordPair[1]].mine = true;
  });

  // add mined elements in grid array to class of equivalent div elements in DOM
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      if (square.mine === true) {
        divEl = document.getElementById(`${rowNumber},${columnNumber}`);
        divEl.classList.add("mine");
      }
    });
  });
  let mineEl = document.querySelectorAll(".mine");
  for (let mine of mineEl) {
    mine.innerHTML = "<p>✪</p>";
  }
  // place numbers around mines in grid array

  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      if (
        rowNumber !== 0 &&
        rowNumber !== 11 &&
        columnNumber !== 0 &&
        columnNumber !== 11
      ) {
        grid[rowNumber][columnNumber].location = "central";
        if (!square.mine === true) {
          // Where the square is not an edge or corner
          let surroundingSquares = 0;
          if (grid[rowNumber - 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 0 && columnNumber === 0) {
        //Top left corner
        grid[rowNumber][columnNumber].location = "top-left";
        if (!square.mine === true) {
          let surroundingSquares = 0;
          if (grid[rowNumber][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 0 && columnNumber === 11) {
        //Top right corner
        grid[rowNumber][columnNumber].location = "top-right";
        let surroundingSquares = 0;
        if (!square.mine === true) {
          if (grid[rowNumber][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 11 && columnNumber === 0) {
        //Bottom left corner
        grid[rowNumber][columnNumber].location = "bottom-left";
        if (!square.mine === true) {
          let surroundingSquares = 0;
          if (grid[rowNumber - 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].suround = surroundingSquares;
        }
      } else if (rowNumber === 11 && columnNumber === 11) {
        //Bottom right corner
        grid[rowNumber][columnNumber].location = "bottom-right";
        let surroundingSquares = 0;
        if (!square.mine === true) {
          if (grid[rowNumber - 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 0 && columnNumber > 0 && columnNumber < 11) {
        // Top row,  not corners
        grid[rowNumber][columnNumber].location = "top-row";
        let surroundingSquares = 0;
        if (!square.mine === true) {
          if (grid[rowNumber][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 11 && columnNumber > 0 && columnNumber < 11) {
        // Bottom row,  not corners
        grid[rowNumber][columnNumber].location = "bottom-row";
        let surroundingSquares = 0;
        if (!square.mine === true) {
          if (grid[rowNumber][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
        }
        grid[rowNumber][columnNumber].surround = surroundingSquares;
      } else if (rowNumber > 0 && rowNumber < 11 && columnNumber === 0) {
        // Left column,  not corners
        grid[rowNumber][columnNumber].location = "left-column";
        let surroundingSquares = 0;
        if (!square.mine === true) {
          if (grid[rowNumber - 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber > 0 && rowNumber < 11 && columnNumber === 11) {
        // Right column,  not corners
        grid[rowNumber][columnNumber].location = "right-column";
        let surroundingSquares = 0;
        if (!square.mine === true) {
          if (grid[rowNumber - 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine === true) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine === true) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      }
    });
  });
  console.log(grid);
  


  //Adds hidden class to all divs in DOM-grid and all p elements
  let divs = document.querySelectorAll("div");
  for (let div of divs) {
    div.classList.add("hidden");
  }
  let ps = document.querySelectorAll("p");
  for (let p of ps) {
    p.classList.add("hidden");
  }
  console.log(grid);
}
// click handlers get coords from click and
// set grid to 1 for left click, 2 for right click
function gridClickHandler(event) {
  let coords = event.target.id;
  console.log("Clicked " + coords);
  if 
  (grid[coords.split(",")[0]][[coords.split(",")[1]]].hidden = true) {
    grid[coords.split(",")[0]][[coords.split(",")[1]]].hidden = false
  };
  render();
}

function gridRightClickHandler(event) {
  let coords = event.target.id;
  console.log("Right clicked " + coords);
  grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged = true;
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
      divEl = document.getElementById(rowNumber + "," + columnNumber);
      pEl = divEl.querySelector("p")
      if (square.surround) {
        pEl.innerHTML = `${square.surround}`
        pEl.classList.add(`surround-${square.surround}`)
      }
      if (square.hidden === false) {
        divEl.classList.remove("hidden");
        pEl.classList.remove("hidden");
      } else if (square.flagged === true) {
          divEl.style.backgroundColor = "blue";
      }
    });
  });
}

// function flood(square) {
//   if (square.mine === true) {
//     return
//   }
//   if (square.classList.contains("central")) {
//      square.classList.remove("hidden")
//      square.querySelector("p").classList.remove("hidden")
//    }
//   }
//   else {
//     //unhide
//     flood(next square)
// //   }

//   // if central:
//   // unhide;
// look at upper left:
//   if not mine, reveal
//   if not Number, flood
// look at upper middle
//   if not mine, reveal
//   if not n flood
