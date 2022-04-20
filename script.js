/*
* TO DOs:
* 1. Add random start through the predefined dropdown - DONE
* 2. Add collection of predefined starts for demonstration
*   2.1 Ability to generate predefined states for the board - DONE
*   2.2 Ability for those states to be selectable through the dropdown
*   2.3 Add 5-10 predefined boards
* 3. Create the about page
* 4. Write the readme for both versions
* 5. Do SEO
*/

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
      const targetDiv = document.getElementById(`${i}${x}`);
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
      const targetDiv = document.getElementById(`${i}${x}`);
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
  generatePre(pre.glider);
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
    // assign each div the co-ordinates of its' linked Cell
    newDiv.id = `${x}${y}`; // give divs a unique id so they can be accessed easier
    if(y == gridSize - 1){
      y = 0;
      x++
    }
    else y++;
    gameArea.appendChild(newDiv);
  } // makes a grid of size gridSize^2 and gives it's children a border

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

// Predefined object

const pre = {
  glider: [[4,10],[5,11],[6,11],[6,10],[6,9]]
}