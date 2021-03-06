const body = document.querySelector("body");
const gameArea = document.querySelector(".game-area");
const gridSizeForm = document.querySelector("#grid-size");
const makeGrid = document.querySelector("#grid");
const randomButton = document.querySelector("#random");
const speedSelector = document.querySelector("#speed");
const step = document.querySelector("#step");
const play = document.querySelector("#play");
const generationCounter = document.querySelector("#generation");
const livingCounter = document.querySelector("#living");
const selector = document.querySelector("#predefined-starts")
const goButton = document.querySelector("#go");


let gridSize = gridSizeForm.value;
let speed = speedSelector.value;
let canChangeColor = false;
let goOn = false;
let aliveTotal = 0;
let generation = 0;
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

function generateRandomBoard(gridSize){
  let innerArr;
  for(let i = 0; i < gridSize; i++){
    innerArr = []
    for(let x = 0; x < gridSize; x++){
      innerArr.push(new Cell(rand())); //random condition of initial cells
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
      // select the corresponding div
      const targetDiv = document.getElementById(`${i}-${x}`);
      if(board[i][x].isAlive()){
        targetDiv.style.backgroundColor = "black";
      }
      else{
        targetDiv.style.backgroundColor = "white";
      }
    }
  }
}

function colorGeneratedGrid(){
  for(let i = 0; i < board.length; i++){
    for(let x = 0; x < board[i].length; x++){
      const targetDiv = document.getElementById(`${i}-${x}`);
      if(board[i][x].isAlive()){
        targetDiv.style.backgroundColor = "black";
      }
      else{
        targetDiv.style.backgroundColor = "white";
      }
    }
  }
}

// CLIENT FACING RELATED FUNCTIONS

makeGrid.addEventListener("click", ()=>{
  gameArea.replaceChildren();
  board.length = 0;
  createGrid();
  resetCounters();
});

randomButton.addEventListener("click", ()=>{
  gameArea.replaceChildren();
  board.length = 0;
  createGrid(true);
  colorGeneratedGrid();
  resetCounters();
});

gridSizeForm.addEventListener("change", ()=>{
  if(gridSizeForm.value > 100){
    gridSizeForm.value = 100;
    gridSizeForm.innerText = 100;
  }
  if(gridSizeForm.value < 10){
    gridSizeForm.value = 10;
    gridSizeForm.innerText = 10;
  }
  gridSize = gridSizeForm.value;
});

speedSelector.addEventListener("change", ()=>{
  if(speedSelector.value > 10000){
    speedSelector.value = 10000;
    speedSelector.innerText = 10000;
  }
  if(speedSelector.value < 100){
    speedSelector.value = 100;
    speedSelector.innerText = 100;
  }
  speed = speedSelector.value;
});

play.addEventListener("click", (e)=>{
  goOn = !goOn;
  e.target.innerText = goOn ? "Stop" : "Play";
  gameLoop();
});

step.addEventListener("click", ()=>{
  stepOnce();
}); // steps through each generation manually

goButton.addEventListener("click", () =>{
  generatePre(pre[selector.value]);
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
} // allow the user to change the cells state while holding down left mouse

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
}// allow the user to change the cells state with single click

(function initialGridState(){
  createGrid();
  resetCounters();
})(); //initialize the grid on page load


// HELPER FUNCTIONS
function createGrid(random = false){
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
    // assign each div the co-ordinates of its linked Cell
    newDiv.id = `${x}-${y}`; // give divs a unique id so they can be accessed easier
    if(y == gridSize - 1){
      y = 0;
      x++
    }
    else y++;
    gameArea.appendChild(newDiv);
  } // makes a grid of size gridSize^2 and gives its children a border

  if(random === false){
    generateBoard(gridSize); // make an array of Cells the same size as the grid
  }
  else{
    generateRandomBoard(gridSize);
  }

  activateColoring();
}

function stepOnce(){
  checkNeighbors();
  updateCells();
  updateCounters();
}

function gameLoop(){
  if(!goOn) return;
  stepOnce();
  setTimeout(gameLoop,speed);
}

function countAlive(){
  return board.reduce((acc,row) =>{
    return acc += row.reduce((i,cell)=> cell.isAlive() ? ++i : i ,0);
  },0);
}

function updateCounters(){
  generationCounter.innerText = `Generation: ${generation++}`;
  aliveTotal = countAlive();
  livingCounter.innerText = `Living Cells: ${aliveTotal}`;
}

function resetCounters(){
  generation = 0;
  generationCounter.innerText = `Generation: ${generation}`;
  aliveTotal = 0;
  livingCounter.innerText = `Living Cells: ${aliveTotal}`;
}

function rand(){
  return Math.random() < 0.5;
}

function generatePre(arr){
  gridSize = 40;
  gameArea.replaceChildren();
  board.length = 0;
  createGrid();
  resetCounters();
  arr.map(coordinate =>{
    board[coordinate[0]][coordinate[1]].live();
  });
  colorGeneratedGrid();
}

function getAlivePositions(){
  let aliveArr = [];
  board.map(row => {
    row.map(cell => {
      if(cell.isAlive()){
        aliveArr.push(`[${board.indexOf(row)},${row.indexOf(cell)}]`);
      }
    });
  });
  console.log(aliveArr);
} // get the positions of all living cells so that they can be
  // copied into the pre object

// Predefined object

const pre = {
  glider: [[4,10],[5,11],[6,11],[6,10],[6,9]],
  gliderGun: [[3,25], [4,23], [4,25], [5,13], [5,14], [5,21], [5,22], [5,35], [5,36], [6,12], [6,16], [6,21], [6,22], [6,35], [6,36], [7,1], [7,2], [7,11], [7,17], [7,21], [7,22], [8,1], [8,2], [8,11], [8,15], [8,17], [8,18], [8,23], [8,25], [9,11], [9,17], [9,25], [10,12], [10,16], [11,13], [11,14]], //Gosper glider gun
  pentadecathlon: [[4,9], [4,10], [4,11], [4,12], [4,13], [4,14], [5,8], [5,15], [6,7], [6,16], [7,8], [7,15], [8,9], [8,10], [8,11], [8,12], [8,13], [8,14]],
  pulsar: [[3,8], [3,9], [3,10], [3,14], [3,15], [3,16], [5,6], [5,11], [5,13], [5,18], [6,6], [6,11], [6,13], [6,18], [7,6], [7,11], [7,13], [7,18], [8,8], [8,9], [8,10], [8,14], [8,15], [8,16], [10,8], [10,9], [10,10], [10,14], [10,15], [10,16], [11,6], [11,11], [11,13], [11,18], [12,6], [12,11], [12,13], [12,18], [13,6], [13,11], [13,13], [13,18], [15,8], [15,9], [15,10], [15,14], [15,15], [15,16]],
  clock: [[1,18], [1,19], [2,18], [2,19], [4,16], [4,17], [4,18], [4,19], [5,12], [5,13], [5,15], [5,20], [6,12], [6,13], [6,15], [6,17], [6,18], [6,20], [7,15], [7,19], [7,20], [7,22], [7,23], [8,15], [8,20], [8,22], [8,23], [9,16], [9,17], [9,18], [9,19], [11,16], [11,17], [12,16], [12,17]],
  dot: [[2,5], [2,6], [2,13], [2,14], [3,4], [3,6], [3,13], [3,15], [4,4], [4,15], [5,1], [5,2], [5,4], [5,15], [5,17], [5,18], [6,1], [6,2], [6,4], [6,6], [6,9], [6,10], [6,13], [6,15], [6,17], [6,18], [7,4], [7,6], [7,8], [7,11], [7,13], [7,15], [8,4], [8,6], [8,8], [8,11], [8,13], [8,15], [9,1], [9,2], [9,4], [9,6], [9,9], [9,10], [9,13], [9,15], [9,17], [9,18], [10,1], [10,2], [10,4], [10,15], [10,17], [10,18], [11,4], [11,15], [12,4], [12,6], [12,13], [12,15], [13,5], [13,6], [13,13], [13,14]],
  copperhead: [[2,7], [2,9], [2,10], [3,6], [3,13], [4,5], [4,6], [4,10], [4,13], [5,2], [5,3], [5,5], [5,11], [5,12], [6,2], [6,3], [6,5], [6,11], [6,12], [7,5], [7,6], [7,10], [7,13], [8,6], [8,13], [9,7], [9,9], [9,10]],
  diamond4_8_12: [[5,17], [5,18], [5,19], [5,20], [7,15], [7,16], [7,17], [7,18], [7,19], [7,20], [7,21], [7,22], [9,13], [9,14], [9,15], [9,16], [9,17], [9,18], [9,19], [9,20], [9,21], [9,22], [9,23], [9,24], [11,15], [11,16], [11,17], [11,18], [11,19], [11,20], [11,21], [11,22], [13,17], [13,18], [13,19], [13,20]],
  AforAll: [[2,15], [2,16], [3,14], [3,17], [4,14], [4,15], [4,16], [4,17], [5,12], [5,14], [5,17], [5,19], [6,11], [6,20], [7,11], [7,20], [8,12], [8,14], [8,17], [8,19], [9,14], [9,15], [9,16], [9,17], [10,14], [10,17], [11,15], [11,16]],
  lightSpaceship: [[8,32], [8,35], [9,31], [10,31], [10,35], [11,31], [11,32], [11,33], [11,34]]
}