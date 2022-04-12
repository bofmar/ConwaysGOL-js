const gameArea = document.querySelector(".game-area");
const button = document.querySelector("button");

button.addEventListener("click", ()=>{
  gameArea.style.setProperty("--grid-size", 16);
  gameArea.textContent = "";
  const totalDivs = Math.pow(16, 2);
  for (let i = 0; i < totalDivs; i++) {
    console.log("adding dis");
    const newDiv = document.createElement("div");
    newDiv.classList.add("cell");
    gameArea.appendChild(newDiv);
  }
})