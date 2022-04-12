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
  grid = []
  for(let i=0; i<12; i++) {
    let arr = [];
    for (let i=0; i<12; i++) {
      arr.push({});
    }
    grid.push(arr)
  }

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
      let pEl = document.createElement("p");
      squareDiv.appendChild(pEl);
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
    grid[coordPair[0]][coordPair[1]].mine = true;
  });

  // add grid array mines to class of equivalent div elements in DOM
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

  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      divEl = document.getElementById(rowNumber + "," + columnNumber);
      pEl = divEl.querySelector("p");
      if (square.surround) {
        pEl.innerHTML = `${square.surround}`;
        pEl.classList.add(`surround-${square.surround}`);
      }
    });
  });

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
  let coords = ""
  if (event.target.tagName === "P") {
     let parentEl = event.target.parentNode
     coords = parentEl.id
  } else {
   coords = event.target.id;
  }
  console.log("Clicked " + coords);
  let x = parseInt(coords.split(",")[0]);
  let y = parseInt(coords.split(",")[1]);
  grid[x][y].hidden = false;
  if (grid[x][y].mine === true) {
    console.log("MINE");
  }
  if (grid[x][y].surround === 0) {
    flood(x, y);
  }
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
function getRandomNumber (max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// renders grid from array data
function render() {
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      divEl = document.getElementById(rowNumber + "," + columnNumber);
      pEl = divEl.querySelector("p");
      if (square.hidden === false) {
        divEl.classList.remove("hidden");
        pEl.classList.remove("hidden");
      } else if (square.flagged === true) {
        divEl.style.backgroundColor = "blue";
      }
    });
  });
}

function flood(a, b) {
  
  if (grid[a - 1][b - 1] &&
    grid[a - 1][b] &&
    grid[a - 1][b + 1] &&
    grid[a][b - 1] &&
    grid[a][b + 1] &&
    grid[a + 1][b - 1] &&
    grid[a + 1][b] &&
    grid[a + 1][b + 1]) {
  if ((grid[a - 1][b - 1].edge === false &&
    grid[a - 1][b].edge === false &&
    grid[a - 1][b + 1].edge === false &&
    grid[a][b - 1].edge === false &&
    grid[a][b + 1].edge === false &&
    grid[a + 1][b - 1].edge === false &&
    grid[a + 1][b].edge === false &&
    grid[a + 1][b + 1].edge === false)) {
  if ((grid[a - 1][b - 1].hidden === false &&
    grid[a - 1][b].hidden === false &&
    grid[a - 1][b + 1].hidden === false &&
    grid[a][b - 1].hidden === false &&
    grid[a][b + 1].hidden === false &&
    grid[a + 1][b - 1].hidden === false &&
    grid[a + 1][b].hidden === false &&
    grid[a + 1][b + 1].hidden === false) ||
    (grid[a - 1][b - 1].surround > 0 &&
    grid[a - 1][b].surround > 0 &&
    grid[a - 1][b + 1].surround > 0 &&
    grid[a][b - 1].surround > 0 &&
    grid[a][b + 1].surround > 0 &&
    grid[a + 1][b - 1].surround > 0 &&
    grid[a + 1][b].surround > 0 &&
    grid[a + 1][b + 1].surround > 0)) {
      grid[a][b].hidden = false
      return
    }
    
      let surroundArray = [
        [a-1, b-1], 
        [a-1, b], 
        [a-1, b+1], 
        [a, b-1],
        [a, b+1],
        [a+1, b-1],
        [a+1, b],
        [a+1, b+1]];
      
        for (let pair of surroundArray) {
          
            if (grid[pair[0]][pair[1]].edge === true || grid[pair[0]][pair[1]].checked === true) {
              continue
            }
            grid[pair[0]][pair[1]].checked = true;
            if (grid[pair[0]][pair[1]].surround === 0) {
            flood(pair[0],pair[1]);
            }
            grid[pair[0]][pair[1]].hidden = false;
             
        };
}
}
return
}

// grid[a - 1][b - 1].hidden = false;
//   grid[a - 1][b].hidden = false;
//   grid[a - 1][b + 1].hidden = false;
//   grid[a][b - 1].hidden = false;
//   grid[a][b + 1].hidden = false;
//   grid[a + 1][b - 1].hidden = false;
//   grid[a + 1][b].hidden = false;
//   grid[a + 1][b + 1].hidden = false;
// }

  // if (grid[a][b].surround > 0 || grid[a][b].mine === true || grid[a][b] === undefined) {
  //   return
  // } else
  // if (grid[a - 1][b - 1] === undefined) {
  //   return;
  // } else {
  //   grid[a - 1][b - 1].hidden = false;
  //   if (grid[a - 1][b - 1].surround === 0) {
  //     flood(a - 1, b - 1);
  //   }
  // }
  // if (grid[a - 1][b] === undefined) {
  //   return;
  // } else {
  //   grid[a - 1][b].hidden = false;
  //   if (grid[a - 1][b].surround === 0) {
  //     flood(a - 1, b);
  //   }
  // }
  // if (grid[a - 1][b + 1] === undefined) {
  //   return;
  // } else {
  //   grid[a - 1][b + 1].hidden = false;
  //   if (grid[a - 1][b + 1].surround === 0) {
  //     flood(a - 1, b + 1);
  //   }
  // }
  // if (grid[a][b - 1] === undefined) {
  //   return;
  // } else {
  //   grid[a][b - 1].hidden = false;
  //   if (grid[a][b - 1].surround === 0) {
  //     flood(a, b - 1);
  //   }
  // }
  // if (grid[a][b + 1] === undefined) {
  //   return;
  // } else {
  //   grid[a][b + 1].hidden = false;
  //   if (grid[a][b + 1].surround === 0) {
  //     flood(a, b + 1);
  //   }
  // }
  // if (grid[a + 1][b - 1] === undefined) {
  //   return;
  // } else {
  //   grid[a + 1][b - 1].hidden = false;
  //   if (grid[a + 1][b - 1].surround === 0) {
  //     flood(a + 1, b - 1);
  //   }
  // }
  // if (grid[a + 1][b] === undefined) {
  //   return;
  // } else {
  //   grid[a + 1][b].hidden = false;
  //   if (grid[a + 1][b].surround === 0) {
  //     flood(a + 1, b);
  //   }
  // }
  // if (grid[a + 1][b + 1] === undefined) {
  //   return;
  // } else {
  //   grid[a + 1][b + 1].hidden = false;
  //   if (grid[a + 1][b + 1].surround === 0) {
  //     flood(a + 1, b + 1);
  //   }
  // }


// if (grid[a][b+1]) {
//   if (grid[a][b+1].surround === 0) {
//     flood(a, b+1);
//   }
// }
// if (grid[a+1][b-1]) {
//   if (grid[a+1][b-1].surround === 0) {
//     flood(a+1, b-1);
//   }
// }
// if (grid[a+1][b]) {
//   if (grid[a+1][b].surround === 0) {
//     flood(a+1, b);
//   }
// }
// if (grid[a+1][b+1]) {
//   if (grid[a+1][b+1].surround === 0) {
//     flood(a+1, b=1);
//   }
//

//   // if central:
//   // unhide;
// look at upper left:
//   if not mine, reveal
//   if not Number, flood
// look at upper middle
//   if not mine, reveal
//   if not n flood

// if clicked square is not marked, open all surrounding
// if any newly opened are not marked, open all surrounding of them

// if any surround squares are mines, open just that square
// else open all surrounding
// move to upper left
