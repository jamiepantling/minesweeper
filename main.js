// ** Variables **
let grid = [];
let mineCounter = 0;
let flagCounter = 0;
let begun;
let finished;
let finalTime = 0;
let interval = -1;
let sec = 0

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
  stopTimer()
  interval = -1
  sec = 0
  document.getElementById("reset").innerHTML = '<p>🤨</p>';
  begun = false;
  finished = false;
  flagCounter = 0;
  mineCounter = 0;
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
  for (let i = 0; i <= 11; i++) {
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
  // let mineEl = document.querySelectorAll(".mine");
  // for (let mine of mineEl) {
  //   mine.innerHTML = "<p>✪</p>";
  // }
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
  let divs = document.querySelectorAll(".square");
  for (let div of divs) {
    div.classList.add("hidden");
    div.querySelector("p").classList.add("hidden");
  }
  // let ps = document.querySelectorAll("p");
  // for (let p of ps) {
  //   p.classList.add("hidden");
  // }
  console.log(grid);
  console.log(mineCounter);

  render();
}
// click handlers get coords from click and
// set grid to 1 for left click, 2 for right click
function gridClickHandler(event) {
  if (interval === -1)
    {interval = setInterval(timer, 1000)}
  let coords = "";
  if (event.target.tagName === "IMG") {
    let imgParent = event.target.parentNode
    let sqParent = imgParent.parentNode
    coords = sqParent.id
  } else if (event.target.tagName === "P") {
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
    console.log(x + y)
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
      document.getElementById("reset").innerHTML = '🤮'
      stopTimer()
    }
    if (grid[x][y].surround === 0) {
      flood(x, y);
    }
  }
  render();
}

function gridRightClickHandler(event) {
  
  let coords = "";
  if (event.target.tagName === "IMG") {
    let pParent = event.target.parentNode
    let sqParent = pParent.parentNode
    coords = sqParent.id
  } else if (event.target.tagName === "P") {
    let parentEl = event.target.parentNode;
    coords = parentEl.id;
  } else {
    coords = event.target.id;
  }
  console.log("Right clicked " + coords);
  event.preventDefault();
  if (grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged) {
    grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged = false;
    flagCounter++;
    if (grid[coords.split(",")[0]][[coords.split(",")[1]]].mine) {
      mineCounter++;
    }
  } 
  else {
    grid[coords.split(",")[0]][[coords.split(",")[1]]].flagged = true;
    flagCounter--;
    if (grid[coords.split(",")[0]][[coords.split(",")[1]]].mine) {
      mineCounter--;
    }
    if (!mineCounter && flagCounter === 0) {
      console.log("YOU WIN");
      document.getElementById("reset").innerHTML = '😋'
      stopTimer()
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

// random number generator
function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}






// renders grid from array data
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
          divEl.classList.add("flagged")
          let flagPEl = document.createElement("p")
          flagPEl.innerHTML = '☠️'
          flagPEl.classList.add("flag")
          divEl.appendChild(flagPEl)
        }
      } else if (!square.flagged) {
        divEl.classList.remove("flagged");
        if (divEl.lastChild.classList.contains("flag")) {
          divEl.removeChild(divEl.lastChild)
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



function timer() {
sec++
render()
}

function stopTimer() {
  clearInterval(interval);
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
      if (grid[pair[0]][pair[1]].flagged) {
        console.log("I'M FLAGGED!")
      }
      if (!grid[pair[0]][pair[1]].flagged) {
        grid[pair[0]][pair[1]].hidden = false;
      }
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
