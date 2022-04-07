# Minsesweeper

## Pseudocode

### Set-up

Run the initialising function to:

* Create an array with the grid squares, with randomly situated mines, numbered squares adjacent to mines, and empty squares
* render the starting grid with:
  * empty, numbered and mined squares hidden
  * event listener on the whole grid, listening for left-clicks and right clicks
  * a countdown clock above grid
  * the number of flags still to place above grid
  * a smiley emoji button to reset above grid

* All squares start with "hidden" class

### If player left clicks on square

* if first click, start countdown clock
* if square contains mine:
  * render revealed grid with all unrevealed mines, correct flags, incorrect flags, numbered squares and empty squares
  * turn face to sick face

* if square contians no mines:
  * change square class to 'shown'
  * Turn all empty adjacent squares class to 'shown'
  * Turn all subsqueently adjacent empty squares to 'shown' up to and including any numbered squares, or the edge of the grid
* render grid as per classes and wait for click

### If player right clicks on square

* change value of square in array to "flagged correct" or "flagged incorrect"
* reduce flag count by 1
* render grid and wait for click

### If timer runs down

* render revealed grid
* turn emoji to sick-face
* remove event-listener

### If emoji button clicked

* call initialising function

### If all non-mined squares opened

* turn emoji to sunglasses face
* stop timer
* remove event-listener