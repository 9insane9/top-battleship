 export const display = (function() {

  function generateGrids() {
    const playerGridContainer = document.querySelector(".player-grid")
    const aiGridContainer = document.querySelector(".ai-grid")

    for (let i = 0; i < 100; i++) {
      const divPlayer = document.createElement("div")
      divPlayer.classList.add("player-cell")
      divPlayer.setAttribute("data-index", i)
      divPlayer.textContent = "x" //dummy
      playerGridContainer.appendChild(divPlayer)

      const divAi = document.createElement("div")
      divAi.classList.add("ai-cell")
      divAi.setAttribute("data-index", i)
      divAi.textContent = "x" //dummy
      aiGridContainer.appendChild(divAi)
    }
  }

  return {
    generateGrids
  }
}())