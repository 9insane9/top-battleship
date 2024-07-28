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

  if (!state.lastHitPos) { ////Priority 1: fire first shot
    state.lastHitPos = aiAttackPosFn(aiShots)    
  } 

  else if (nextTargets.length){ ////Priority 2: Check for nextTargets

    if(!state.lastTargetPos) { //First target, aka second shot
      assignRandomTarget()
    } 

    else if (state.lastTargetPos){ //after first shot: filter after every shot and shoot

      if (!currentAimAxis) { //if not already calculated
        //calculate current aim axis using lastTargetSuccess,
      }

      //filter targets to current axis

      assignRandomTarget()

      state.lastTargetSuccess = false //reset
    }
  
  } else { ////Priority 3: Random position

    state.lastHitPos = aiAttackPosFn(aiShots)
  }
  
  /// check player board state and prepare next turn

  let shipOnGameboard = playerBoard.boardState[state.lastHitPos]
  let shipInShipYard = playerBoard.shipYard[shipOnGameboard].ship

  if (shipOnGameboard) {///on hit

    if(state.lastHitPos === state.lastTargetPos) { // remember if lastTargetSuccess
      state.lastTargetSuccess = true
    }

    if (!shipInShipYard.isSunk()) {//on hit: if not sunk

    //calculate adjacents aka nextTargets
    //add only new adjacents to nextTargets, also filter out ones on shots list
    }

    if (shipInShipYard.isSunk()) { //on hit: if sunk

      //calculate all adjacents and diagonals and add all new ones to shots list
      state.resetToRandom()
    }   
  }

  if (!shipOnGameboard) { //on miss
    state.resetToRandom()
  }

  //helpers

  function assignRandomTarget() {
    const targets = state.nextTargets

    if (targets.length === 0) throw new Error('No targets!')

    const randomIndex = Math.floor(Math.random() * targets.length)
    const randomTarget = targets[randomIndex]
    targets.splice(randomIndex, 1)
    state.lastHitPos = randomTarget
    state.lastTargetPos = randomTarget
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