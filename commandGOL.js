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
}

const board = [];

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

// tests

generateBoard(5,3);
console.table(board);