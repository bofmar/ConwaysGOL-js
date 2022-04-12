const body = document.querySelector("body");
const gameArea = document.querySelector(".game-area");
const button = document.querySelector("button");

let gridSize = 16;
let canChangeColor = false;

button.addEventListener("click", ()=>{
  gameArea.style.setProperty("--grid-size", gridSize);
  gameArea.textContent = "";
  const totalDivs = Math.pow(gridSize, 2);
  for (let i = 0; i < totalDivs; i++) {
    console.log("adding dis");
    const newDiv = document.createElement("div");
    newDiv.classList.add("cell");
    gameArea.appendChild(newDiv);
  } // makes a grid of size gridSize^2 and gives it's children a border
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