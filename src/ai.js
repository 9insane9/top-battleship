const smartAi = function(aiShots, playerBoard, aiAttackPosFn = randomAiAttackPosFn) {
  const state = {
    lastHitPos: null,

    lastTargetPos: null,
    lastTargetSuccess: false,
    currentAimAxis: null,
    nextTargets: [],
    adjacentPos: 
      {
        x: [],
        y: [],
      },
    resetToRandom: function() {
      this.lastTargetPos = null
      this.lastTargetSuccess = false
      this.currentAimAxis = null
      this.nextTargets.length = 0

      this.adjacentPos.x.length = 0
      this.adjacentPos.y.length = 0
      },
  }

  if (state.nextTargets.length){ ////Priority 1: Check for nextTargets

    if(!state.lastTargetPos) { assignRandomTarget() } //First target, aka second shot

    else if (state.lastTargetPos){ //after first shot: filter after every shot and shoot
      calculateAxis() //first, if not already calculated
      filterAndAddTargets() //second, filter and add new targets
      assignRandomTarget() //and then fire
    }
  
  } else { ////Priority 2: Random position
    state.lastHitPos = aiAttackPosFn(aiShots)
  } 

  state.lastTargetSuccess = false //reset after every shot
  

  /// check player board state and prepare next turn

  let shipOnGameboard = playerBoard.boardState[state.lastHitPos]
  let shipInFleet = playerBoard.fleet[shipOnGameboard].status

  if (shipOnGameboard) {///on hit

    if(state.lastHitPos === state.lastTargetPos) { state.lastTargetSuccess = true }

    if (!shipInFleet.isSunk()) {//on hit: if not sunk
      addNewAdjacents()
    }

    if (shipInFleet.isSunk()) { //on hit: if sunk    
      markSurroundingAreaAsShot(shipPosition, aiShots)
      state.resetToRandom()
    }   
  }

  if (!shipOnGameboard) { //on miss
    state.resetToRandom()
  }

  //helpers

  function filterAndAddTargets() {
    const newTargets = state.adjacentPos[state.currentAimAxis]
        .filter((position) => !state.nextTargets.includes(position))

    state.nextTargets = state.nextTargets.concat(newTargets)
  }

  function assignRandomTarget() {
    const targets = state.nextTargets
    if (targets.length === 0) return

    const randomIndex = Math.floor(Math.random() * targets.length)
    const randomTarget = targets[randomIndex]
    targets.splice(randomIndex, 1)
    state.lastHitPos = randomTarget
    state.lastTargetPos = randomTarget
  }

  function addNewAdjacents() {
    const newAdjacents = {   //calculate
                          x: [state.lastHitPos - 1, state.lastHitPos + 1],
                          y: [state.lastHitPos - 10, state.lastHitPos + 10]
                          }

    const filteredAdjacents = filterGridAndLegal(newAdjacents, aiShots)

    const uniqueAdjacents = { //filter
      x: filteredAdjacents.x.filter(position =>
        !state.adjacentPos.x.includes(position) &&
        !state.adjacentPos.y.includes(position) &&
        !state.nextTargets.includes(position)
      ),
      y: filteredAdjacents.y.filter(position =>
        !state.adjacentPos.x.includes(position) &&
        !state.adjacentPos.y.includes(position) &&
        !state.nextTargets.includes(position)
      )
    }
    // Add the filtered coordinates to adjacentPos
    state.adjacentPos.x = [...state.adjacentPos.x, ...uniqueAdjacents.x];
    state.adjacentPos.y = [...state.adjacentPos.y, ...uniqueAdjacents.y];
  }

  function calculateAxis() {
    if (!state.currentAimAxis) { 
      const isSuccess = state.lastTargetSuccess;

      if (state.adjacentPos.x.includes(state.lastTargetPos)) {
        state.currentAimAxis = isSuccess ? "x" : "y";

      } else if (state.adjacentPos.y.includes(state.lastTargetPos)) {
        state.currentAimAxis = isSuccess ? "y" : "x";
      }
    }
  }

  function filterGridAndLegal(all, aiShots) { //filter range and shots list
    const isTwoDimensional = Array.isArray(all.x) && Array.isArray(all.y);

    if (isTwoDimensional) {
      all.x = all.x.filter(position => position >= 0 && position <= 99 && !aiShots.includes(position))
      all.y = all.y.filter(position => position >= 0 && position <= 99 && !aiShots.includes(position))
    } else {
      all = all.filter(position => position >= 0 && position <= 99 && !aiShots.includes(position))
    }
    return all
  }

  function markSurroundingAreaAsShot(aiShots) {
    const shipPosition = shipInFleet.position
    let allCoordinates = [] //calculate adjacents and diagonals of all sunk ship positions

    shipPosition.forEach((coordinate) => {
      allCoordinates.push(coordinate - 11)
      allCoordinates.push(coordinate - 10)
      allCoordinates.push(coordinate - 9)
      allCoordinates.push(coordinate - 1)
      allCoordinates.push(coordinate + 1)
      allCoordinates.push(coordinate + 9)
      allCoordinates.push(coordinate + 10)
      allCoordinates.push(coordinate + 11)
    })

    //filter range/already shot and return
    const surroundingPos = filterGridAndLegal(allCoordinates, aiShots)
    aiShots = aiShots.concat(surroundingPos)
  }

//for testing need whole state object
  return state.lastHitPos
}

//randomAiPos
function randomAiAttackPosFn(aiShots) {
  let aiAttackPos
  do {
    aiAttackPos = Math.floor(Math.random() * 100)
  } while (aiShots.includes(aiAttackPos))

  return aiAttackPos
}
/////////


module.exports = smartAi