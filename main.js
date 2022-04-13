// ** Variables **
let grid = [];
let mineCounter = 0;
let flagCounter = 0;
let interval = -1;
let sec = 0;
let mineNumber = 20;
let uniqueMineCoords = [];

// ** Initialising function call **

init();

// ** Event listeners **

document
  .getElementById("grid-container")
  .addEventListener("click", gridClickHandler);

document
  .getElementById("grid-container")
  .addEventListener("contextmenu", gridRightClickHandler);

document.getElementById("reset").addEventListener("click", reset);

// ** Functions **

// Initialise game

function init() {
  interval = -1;
  sec = 0;
  flagCounter = 0;
  mineCounter = 0;
  uniqueMineCoords = []

  initialiseGrid();
  removeSquares();
  initialiseObjects();
  placeMinesInGrid();
  deployMinesToSquares();
  surround();
  deploySurrounders();
  hidePs();
  render();
}

// Reset game

function reset() {
  stopTimer();
  document.getElementById("reset").innerHTML = "<p>🤨</p>";
  init();
}

// Initialise empty array of arrays of objects to make the grid

function initialiseGrid() {
  grid = [];
  for (let i = 0; i < 12; i++) {
    let arr = [];
    for (let i = 0; i < 12; i++) {
      arr.push({});
    }
    grid.push(arr);
  }
}

// Remove "square" divs from grid-container in DOM

function removeSquares() {
  let divEl = document.querySelectorAll(".square");
  for (let div of divEl) {
    div.remove();
  }
}

// Set up objects, puts new squares in doc

function initialiseObjects() {
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
}

// Place mines in grid

function placeMinesInGrid() {
  if (uniqueMineCoords.length === mineNumber) {
    uniqueMineCoords.forEach(function (coordPair) {
      grid[coordPair[0]][coordPair[1]].mine = true;
    });
    return;
  }
  uniqueMineCoords = [];
  let mineCoords = [];
  let randomNums = [];
  for (let i = 0; i <= 2 * mineNumber - 1; i++) {
    let num = getRandomNumber(11, 0);
    randomNums.push(num);
  }
  for (let i = 0; i < randomNums.length; i = i + 2) {
    mineCoords.push([randomNums[i], randomNums[i + 1]]);
  }
  let mineCoordsStrings = [];
  mineCoords.forEach(function (mineCoord) {
    mineCoordsStrings.push(`${mineCoord[0]}, ${mineCoord[1]}`);
  });
  let mineCoordsStringsSet = new Set(mineCoordsStrings);

  let uniqueMineCoordsStrings = [...mineCoordsStringsSet];

  uniqueMineCoordsStrings.forEach(function (mineCoordString) {
    uniqueMineCoords.push([
      [parseInt(mineCoordString.split(",")[0])],
      [parseInt(mineCoordString.split(",")[1])],
    ]);
  });
  placeMinesInGrid();
}

// Add grid array mines to class of equivalent div elements in DOM

function deployMinesToSquares() {
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      if (square.mine) {
        mineCounter++;
        flagCounter = mineCounter;
        divEl = document.getElementById(`${rowNumber},${columnNumber}`);
        divEl.classList.add("mine");
      }
    });
  });
}

// Add property with numbers to grid objects that surround mines

function surround() {
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      if (
        rowNumber !== 0 &&
        rowNumber !== 11 &&
        columnNumber !== 0 &&
        columnNumber !== 11
      ) {
        grid[rowNumber][columnNumber].location = "central";
        if (!square.mine) {
          // Where the square is not an edge or corner
          let surroundingSquares = 0;
          if (grid[rowNumber - 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 0 && columnNumber === 0) {
        //Top left corner
        grid[rowNumber][columnNumber].location = "top-left";
        if (!square.mine) {
          let surroundingSquares = 0;
          if (grid[rowNumber][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 0 && columnNumber === 11) {
        //Top right corner
        grid[rowNumber][columnNumber].location = "top-right";
        let surroundingSquares = 0;
        if (!square.mine) {
          if (grid[rowNumber][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 11 && columnNumber === 0) {
        //Bottom left corner
        grid[rowNumber][columnNumber].location = "bottom-left";
        if (!square.mine) {
          let surroundingSquares = 0;
          if (grid[rowNumber - 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].suround = surroundingSquares;
        }
      } else if (rowNumber === 11 && columnNumber === 11) {
        //Bottom right corner
        grid[rowNumber][columnNumber].location = "bottom-right";
        let surroundingSquares = 0;
        if (!square.mine) {
          if (grid[rowNumber - 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 0 && columnNumber > 0 && columnNumber < 11) {
        // Top row,  not corners
        grid[rowNumber][columnNumber].location = "top-row";
        let surroundingSquares = 0;
        if (!square.mine) {
          if (grid[rowNumber][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber === 11 && columnNumber > 0 && columnNumber < 11) {
        // Bottom row,  not corners
        grid[rowNumber][columnNumber].location = "bottom-row";
        let surroundingSquares = 0;
        if (!square.mine) {
          if (grid[rowNumber][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
        }
        grid[rowNumber][columnNumber].surround = surroundingSquares;
      } else if (rowNumber > 0 && rowNumber < 11 && columnNumber === 0) {
        // Left column,  not corners
        grid[rowNumber][columnNumber].location = "left-column";
        let surroundingSquares = 0;
        if (!square.mine) {
          if (grid[rowNumber - 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber + 1].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      } else if (rowNumber > 0 && rowNumber < 11 && columnNumber === 11) {
        // Right column,  not corners
        grid[rowNumber][columnNumber].location = "right-column";
        let surroundingSquares = 0;
        if (!square.mine) {
          if (grid[rowNumber - 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber - 1][columnNumber].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber - 1].mine) {
            surroundingSquares++;
          }
          if (grid[rowNumber + 1][columnNumber].mine) {
            surroundingSquares++;
          }
          grid[rowNumber][columnNumber].surround = surroundingSquares;
        }
      }
    });
  });
}

// Sets squares in DOM to show if they surround a mine

function deploySurrounders() {
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
}

//Adds hidden class to all divs in DOM-grid and all p elements

function hidePs() {
  let divs = document.querySelectorAll(".square");
  for (let div of divs) {
    div.classList.add("hidden");
    div.querySelector("p").classList.add("hidden");
  }
}

// Renders grid from array data

function render() {
  document.getElementById("timer").innerHTML = sec;
  grid.forEach(function (row, rowNumber) {
    row.forEach(function (square, columnNumber) {
      divEl = document.getElementById(rowNumber + "," + columnNumber);
      pEl = divEl.querySelector("p");
      if (!square.hidden) {
        divEl.classList.remove("hidden");

        pEl.classList.remove("hidden");
      } else if (square.flagged) {
        if (!divEl.classList.contains("flagged")) {
          divEl.classList.add("flagged");
          let flagPEl = document.createElement("p");
          flagPEl.innerHTML = "☠️";
          flagPEl.classList.add("flag");
          divEl.appendChild(flagPEl);
        }
      } else if (!square.flagged) {
        divEl.classList.remove("flagged");
        if (divEl.lastChild.classList.contains("flag")) {
          divEl.removeChild(divEl.lastChild);
        }
        if (square.surround) {
          pEl.innerHTML = `${square.surround}`;
          pEl.classList.add(`surround-${square.surround}`);
        }
      }
      if (square.sprout) {
        divEl.innerHTML = '<p><img src="img/sprout.png"></p>';
      }
    });
  });
  let flagEl = document.getElementById("flag-count");
  flagEl.innerHTML = flagCounter;
}

// Make timer count up

function timer() {
  sec++;
  render();
}

// Stop timer

function stopTimer() {
  clearInterval(interval);
}

// Left-click handler

function gridClickHandler(event) {
  if (event.target.id === "grid-container") {
    return;
  }
  if (interval === -1) {
    interval = setInterval(timer, 1000);
  }
  let coords = "";
  if (event.target.tagName === "IMG") {
    let imgParent = event.target.parentNode;
    let sqParent = imgParent.parentNode;
    coords = sqParent.id;
  } else if (event.target.tagName === "P") {
    let parentEl = event.target.parentNode;
    coords = parentEl.id;
  } else {
    coords = event.target.id;
  }
  let x = parseInt(coords.split(",")[0]);
  let y = parseInt(coords.split(",")[1]);
  if (grid[x][y].flagged) {
    return;
  } else {
    grid[x][y].hidden = false;
    if (grid[x][y].mine) {
      grid.forEach(function (row, rowNumber) {
        row.forEach(function (square, columnNumber) {
          square.hidden = false;
          if (square.mine) {
            square.sprout = true;
          }
        });
      });
      document.getElementById("reset").innerHTML = "🤮";
      stopTimer();
    }
    if (grid[x][y].surround === 0) {
      flood(x, y);
    }
  }
  render();
}

// Right-click handler

function gridRightClickHandler(event) {
  if (event.target.id === "grid-container") {
    event.preventDefault();
    return;
  }
  let coords = "";
  if (event.target.tagName === "IMG") {
    let pParent = event.target.parentNode;
    let sqParent = pParent.parentNode;
    coords = sqParent.id;
  } else if (event.target.tagName === "P") {
    let parentEl = event.target.parentNode;
    coords = parentEl.id;
  } else {
    coords = event.target.id;
  }
  event.preventDefault();
  if (grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged) {
    grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged = false;
    flagCounter++;
    if (grid[coords.split(",")[0]][[coords.split(",")[1]]].mine) {
      mineCounter++;
    }
  } else {
    grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged = true;
    flagCounter--;
    if (grid[coords.split(",")[0]][[coords.split(",")[1]]].mine) {
      mineCounter--;
    }
    if (!mineCounter && flagCounter === 0) {
      document.getElementById("reset").innerHTML = "😋";
      stopTimer();
      grid.forEach(function (row) {
        row.forEach(function (square) {
          if (!square.mine) {
            square.hidden = false;
          }
        });
      });
    }
  }
  render();
}

// Random number generator

function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Floods grid with recursive revealing of squares if clear of mines

function flood(a, b) {
  if (grid[a][b].location === "central") {
    if (
      (!grid[a - 1][b - 1].hidden &&
        !grid[a - 1][b].hidden &&
        !grid[a - 1][b + 1].hidden &&
        !grid[a][b - 1].hidden &&
        !grid[a][b + 1].hidden &&
        !grid[a + 1][b - 1].hidden &&
        !grid[a + 1][b].hidden &&
        !grid[a + 1][b + 1].hidden) ||
      (grid[a - 1][b - 1].surround > 0 &&
        grid[a - 1][b].surround > 0 &&
        grid[a - 1][b + 1].surround > 0 &&
        grid[a][b - 1].surround > 0 &&
        grid[a][b + 1].surround > 0 &&
        grid[a + 1][b - 1].surround > 0 &&
        grid[a + 1][b].surround > 0 &&
        grid[a + 1][b + 1].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }
    let surroundArray = [
      [a - 1, b - 1],
      [a - 1, b],
      [a - 1, b + 1],
      [a, b - 1],
      [a, b + 1],
      [a + 1, b - 1],
      [a + 1, b],
      [a + 1, b + 1],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }
  } else if (grid[a][b].location === "top-row") {
    if (
      (!grid[a][b - 1].hidden &&
        !grid[a][b + 1].hidden &&
        !grid[a + 1][b - 1].hidden &&
        !grid[a + 1][b].hidden &&
        !grid[a + 1][b + 1].hidden) ||
      (grid[a][b - 1].surround > 0 &&
        grid[a][b + 1].surround > 0 &&
        grid[a + 1][b - 1].surround > 0 &&
        grid[a + 1][b].surround > 0 &&
        grid[a + 1][b + 1].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a, b - 1],
      [a, b + 1],
      [a + 1, b - 1],
      [a + 1, b],
      [a + 1, b + 1],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }
  } else if (grid[a][b].location === "left-column") {
    if (
      (!grid[a - 1][b].hidden &&
        !grid[a - 1][b + 1].hidden &&
        !grid[a][b + 1].hidden &&
        !grid[a + 1][b].hidden &&
        !grid[a + 1][b + 1].hidden) ||
      (grid[a - 1][b].surround > 0 &&
        grid[a - 1][b + 1].surround > 0 &&
        grid[a][b + 1].surround > 0 &&
        grid[a + 1][b].surround > 0 &&
        grid[a + 1][b + 1].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a - 1, b],
      [a - 1, b + 1],
      [a, b + 1],
      [a + 1, b],
      [a + 1, b + 1],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }

    return;
  } else if (grid[a][b].location === "bottom-row") {
    if (
      (!grid[a - 1][b - 1].hidden &&
        !grid[a - 1][b].hidden &&
        !grid[a - 1][b + 1].hidden &&
        !grid[a][b - 1].hidden &&
        !grid[a][b + 1].hidden) ||
      (grid[a - 1][b - 1].surround > 0 &&
        grid[a - 1][b].surround > 0 &&
        grid[a - 1][b + 1].surround > 0 &&
        grid[a][b - 1].surround > 0 &&
        grid[a][b + 1].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a - 1, b - 1],
      [a - 1, b],
      [a - 1, b + 1],
      [a, b - 1],
      [a, b + 1],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }

    return;
  } else if (grid[a][b].location === "right-column") {
    if (
      (!grid[a - 1][b - 1].hidden &&
        !grid[a - 1][b].hidden &&
        !grid[a][b - 1].hidden &&
        !grid[a + 1][b - 1].hidden &&
        !grid[a + 1][b].hidden) ||
      (grid[a - 1][b - 1].surround > 0 &&
        grid[a - 1][b].surround > 0 &&
        grid[a][b - 1].surround > 0 &&
        grid[a + 1][b - 1].surround > 0 &&
        grid[a + 1][b].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a - 1, b - 1],
      [a - 1, b],
      [a, b - 1],
      [a + 1, b - 1],
      [a + 1, b],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }

    return;
  } else if (grid[a][b].location === "top-left") {
    if (
      (!grid[a][b + 1].hidden &&
        !grid[a + 1][b].hidden &&
        !grid[a + 1][b + 1].hidden) ||
      (grid[a][b + 1].surround > 0 &&
        grid[a + 1][b].surround > 0 &&
        grid[a + 1][b + 1].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a, b + 1],
      [a + 1, b],
      [a + 1, b + 1],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }

    return;
  } else if (grid[a][b].location === "top-right") {
    if (
      (!grid[a][b - 1].hidden &&
        !grid[a + 1][b - 1].hidden &&
        !grid[a + 1][b].hidden) ||
      (grid[a][b - 1].surround > 0 &&
        grid[a + 1][b - 1].surround > 0 &&
        grid[a + 1][b].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a, b - 1],
      [a + 1, b - 1],
      [a + 1, b],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }

    return;
  } else if (grid[a][b].location === "bottom-left") {
    if (
      (!grid[a - 1][b].hidden &&
        !grid[a - 1][b + 1].hidden &&
        !grid[a][b + 1].hidden) ||
      (grid[a - 1][b].surround > 0 &&
        grid[a - 1][b + 1].surround > 0 &&
        grid[a][b + 1].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a - 1, b],
      [a - 1, b + 1],
      [a, b + 1],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }

    return;
  } else if (grid[a][b].location === "bottom-right") {
    if (
      (!grid[a - 1][b - 1].hidden &&
        !grid[a - 1][b].hidden &&
        !grid[a][b - 1].hidden) ||
      (grid[a - 1][b - 1].surround > 0 &&
        grid[a - 1][b].surround > 0 &&
        grid[a][b - 1].surround > 0)
    ) {
      if (!grid[a][b].flagged) {
        grid[a][b].hidden = false;
        return;
      }
    }

    let surroundArray = [
      [a - 1, b - 1],
      [a - 1, b],
      [a, b - 1],
    ];

    for (let pair of surroundArray) {
      if (grid[pair[0]][pair[1]].checked) {
        continue;
      }
      grid[pair[0]][pair[1]].checked = true;
      if (grid[pair[0]][pair[1]].surround === 0) {
        flood(pair[0], pair[1]);
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
    }

    return;
  }
}
