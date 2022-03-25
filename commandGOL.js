class Cell{
  constructor(alive){
    this.alive = alive;
    this.livingNeighbors = 0;
    this.icon = alive ? " @ " : ` ${String.fromCharCode(183)} `;
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
    this.icon = ` ${String.fromCharCode(183)} `;
  }

  live(){
    if(this.alive) return;
    this.alive = true;
    this.icon = " @ ";
  }

  incrementNeighbors(){
    this.livingNeighbors++ ;
  }

  isAlive(){
    return this.alive;
  }
}

//global vars
const board = [];
let generation = 0;

// initial state generators
function generateBoard(rows,columns){
  if(rows < 1 || !rows) rows = 1; //failsafe for rows
  if(columns < 1 || !columns) columns = rows; //make rows and columns the same if no columns are defined
  let innerArr;
  for(let i = 0; i < rows; i++){
    innerArr = []
    for(let x = 0; x < columns; x++){
      innerArr.push(new Cell(rand()));
    }
    board.push(innerArr);
  }
}

function rand(){
  return Math.random() < 0.5;
}

//board handles
function drawBoard(){
  console.clear();
  for(let i = 0; i < board.length; i++){
    let line = "";
    for(let x = 0; x < board[i].length; x++){
      line += board[i][x].icon
    }
    console.log(line);
  }
  console.log(`Generation: ${generation}`);
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
}

function updateCells(){
  for(let i = 0; i < board.length; i++){
    for(let x = 0; x < board[i].length; x++){
      board[i][x].updateState();
    }
  }
}

// tests
generateBoard(2,2);
console.table(board);
drawBoard();
checkNeighbors();
console.log(`The cell in row 1 column 2 has ${board[1][1].livingNeighbors} neighbors alive`);

prompt("Press any key")
updateCells()
console.log(board[1][1].livingNeighbors);
prompt("Press any key")
drawBoard()