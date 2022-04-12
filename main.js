// ** Variables **
let grid = [];
let mineCounter = 0;
let flagCounter = 0;
let sec = 0;
let firstClick;
let finished;
let finalTime = 0;

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
  firstClick = false
  finished = false
  flagCounter = 0
  mineCounter = 0
  sec = 0
  grid = [];
  for (let i = 0; i < 12; i++) {
    let arr = [];
    for (let i = 0; i < 12; i++) {
      arr.push({});
    }
    grid.push(arr);
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
  for (let i = 1; i <= 10; i++) {
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
      if (square.mine) {
        mineCounter++;
        flagCounter = mineCounter;
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
  console.log(mineCounter);
  
  render()
}
// click handlers get coords from click and
// set grid to 1 for left click, 2 for right click
function gridClickHandler(event) {
  if(!firstClick) {
    timer()
    firstClick = true
  }
  let coords = "";
  if (event.target.tagName === "P") {
    let parentEl = event.target.parentNode;
    coords = parentEl.id;
  } else {
    coords = event.target.id;
  }
  console.log("Clicked " + coords);
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
        });
      });
    }
    if (grid[x][y].surround === 0) {
      flood(x, y);
    }
  }
  render();
}

function gridRightClickHandler(event) {
  if(!firstClick) {
    timer()
    firstClick = true
  }
  let coords = event.target.id;
  console.log("Right clicked " + coords);
  event.preventDefault();
  if (grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged) {
    grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged = false;
    flagCounter++;
    if (grid[coords.split(",")[0]][[coords.split(",")[1]]].mine) {
      mineCounter++
    }
  } else {
    grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged = true;
    flagCounter--;
    if (grid[coords.split(",")[0]][[coords.split(",")[1]]].mine) {
      mineCounter--
    }
    if (!mineCounter) {
      console.log("YOU WIN")
      finalTime = sec;
      finished = true
      
      grid.forEach(function (row) {
        row.forEach(function (square) {
          if(!square.mine) {square.hidden = false;
        }
      });
      })
    }
  }
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
      pEl = divEl.querySelector("p");
      if (!square.hidden) {
        divEl.classList.remove("hidden");
        pEl.classList.remove("hidden");
      } else if (square.flagged) {
        divEl.classList.add("flagged");
      } else if (!square.flagged) {
        divEl.classList.remove("flagged");
      }
    });
  });
  let flagEl = document.getElementById("flag-count")
  flagEl.innerHTML = flagCounter
  let timeEl = document.getElementById("timer")
  if (!finished) {
  timeEl.innerHTML = sec
  } else if (finished) {
    timeEl.innerHTML = finalTime
  }
}


function timer() {
  function startTimer(cb) {
    setTimeout(cb, 1000);
  }
  function increaseTimer() {
    if (!finished) {sec++
    render()
    startTimer(increaseTimer)
    }
  }
increaseTimer()
}


function flood(a, b) {
  //central squares
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
    }
    //top-row squares
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
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
      grid[a][b].hidden = false;
      return;
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
      grid[pair[0]][pair[1]].hidden = false;
    }

    return;
  }
}
