const body = document.querySelector("body");
const gameArea = document.querySelector(".game-area");
const button = document.querySelector("button");

let gridSize = 16;
let canChangeColor = false;
const board = [];

class Cell{
  constructor(alive){
    this.alive = alive;
    this.livingNeighbors = 0;
  }

  updateState(){
    if(this.livingNeighbors < 2 || this.livingNeighbors > 3){
      this.die()
    }
    else{
      this.live();
    }
    this.livingNeighbors = 0;
  }

  die(){
    if(!this.alive) return;
    this.alive = false;
  }

  live(){
    if(this.alive || this.livingNeighbors === 2) return;
    this.alive = true;
  }

  incrementNeighbors(){
    this.livingNeighbors++ ;
  }

  isAlive(){
    return this.alive;
  }
}

function generateBoard(gridSize){
  let innerArr;
  for(let i = 0; i < gridSize; i++){
    innerArr = []
    for(let x = 0; x < gridSize; x++){
      innerArr.push(new Cell(false)); //all cells are dead initially
    }
    board.push(innerArr);
  }
}

button.addEventListener("click", ()=>{
  gameArea.style.setProperty("--grid-size", gridSize);
  gameArea.textContent = "";
  const totalDivs = Math.pow(gridSize, 2);
  let x = 0;
  let y = 0;
  for (let i = 0; i < totalDivs; i++) {
    console.log("adding dis");
    const newDiv = document.createElement("div");
    newDiv.classList.add("cell");
    newDiv.dataset.x = x;
    newDiv.dataset.y = y;
    
    // assign each div the co-ordinates of its' linked Cell
    if(y > totalDivs - 1){
      y = 0;
      x++
    }
    else y++;
    gameArea.appendChild(newDiv);
  } // makes a grid of size gridSize^2 and gives it's children a border

  generateBoard(gridSize); // make an array of Cells the same size as the grid

  activateColoring();
});

// allows the user to change the color of the cells
function activateColoring() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.addEventListener("mousedown", () => {
      canChangeColor = true;
  })); //checks if the user has his mouse click down and enables coloring

  body.addEventListener("mouseup", () => {
      canChangeColor = false;
  }); //disable coloring if the user lifts his mouse up anywhere in the body

  cells.forEach(cell => cell.addEventListener("mouseover", changeColor));

  //when user clicks on a cell, always color that cell
  cells.forEach(cell => cell.addEventListener("click", (e) => e.target.style.backgroundColor = "black"));
}

function changeColor(e) {
  if (canChangeColor) {
      e.target.style.backgroundColor = "black";
  }
} // allow the user to change color while mouse is held down