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

// tests