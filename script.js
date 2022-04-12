const body = document.querySelector("body");
const gameArea = document.querySelector(".game-area");
const makeGrid = document.querySelector("#grid");
const step = document.querySelector("#step");

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

function checkNeighbors(){
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      let cordX = i;
      let cordY = j;
      if(cordX + 1 < board.length){
        //right and right diagonals
        if(board[cordX + 1][cordY].isAlive()) board[i][j].incrementNeighbors();
        if(cordY + 1 < board[i].length && board[cordX + 1][cordY + 1].isAlive()) board[i][j].incrementNeighbors();
        if(cordY - 1 >= 0 && board[cordX + 1][cordY - 1].isAlive()) board[i][j].incrementNeighbors();
      }
      if(cordX - 1 >= 0){
        //left and left diagonals
        if(board[cordX - 1][cordY].isAlive()) board[i][j].incrementNeighbors();
        if(cordY + 1 < board[i].length && board[cordX - 1][cordY + 1].isAlive()) board[i][j].incrementNeighbors();
        if(cordY - 1 >= 0 && board[cordX - 1][cordY - 1].isAlive()) board[i][j].incrementNeighbors();
      }
      //up and down
      if(cordY + 1 < board[i].length && board[cordX][cordY + 1].isAlive()) board[i][j].incrementNeighbors();
      if(cordY - 1 >= 0 && board[cordX][cordY - 1].isAlive()) board[i][j].incrementNeighbors();
    }
  }
} // checks all the neighbors of a cell

function updateCells(){
  for(let i = 0; i < board.length; i++){
    for(let x = 0; x < board[i].length; x++){
      board[i][x].updateState();
      if(board[i][x].isAlive()){
        const gridItems = document.querySelectorAll(`[data-x="${i}"]`);
        gridItems.forEach(item =>{
          if(item.dataset.y == x){
            console.log(item);
            item.style.backgroundColor = "black";
          }
        });
      }
      else{
        const gridItems = document.querySelectorAll(`[data-x="${i}"]`);
        gridItems.forEach(item =>{
          if(item.dataset.y == x){
            item.style.backgroundColor = "white";
          }
        });
      }
    }
  }
} // TO DO change the x i y x to something that makes sense

makeGrid.addEventListener("click", ()=>{
  gameArea.style.setProperty("--grid-size", gridSize);
  gameArea.textContent = "";
  const totalDivs = Math.pow(gridSize, 2);
  let x = 0;
  let y = 0;
  for (let i = 0; i < totalDivs; i++) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("cell");
    newDiv.dataset.x = x;
    newDiv.dataset.y = y;
    
    // assign each div the co-ordinates of its' linked Cell
    if(y == gridSize - 1){
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

  cells.forEach(cell => cell.addEventListener("mouseover", changeState));

  //when user clicks on a cell, always color that cell
  cells.forEach(cell => cell.addEventListener("click",clickChangeState));
}

function changeState(e) {
  const x = e.target.dataset.x;
  const y = e.target.dataset.y;
  if (canChangeColor) {
      if(e.target.style.backgroundColor == "black"){
        e.target.style.backgroundColor = "white";
        board[x][y].die();
      }
      else{
        e.target.style.backgroundColor = "black";
        board[x][y].live();
      }
  }
} // allow the user to change the cell's state while holding down left mouse

function clickChangeState(e){
  const x = e.target.dataset.x;
  const y = e.target.dataset.y;
  if(e.target.style.backgroundColor == "black"){
    e.target.style.backgroundColor = "white";
    board[x][y].die();
  }
  else{
    e.target.style.backgroundColor = "black";
    board[x][y].live();
  }
}// allow the user to change the cell's state with single click

step.addEventListener("click", ()=>{
  checkNeighbors();
  updateCells();
}); // steps through each generation manually