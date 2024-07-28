const smartAi = function(aiShots, playerBoard, aiAttackPosFn = randomAiAttackPosFn) {
  const state = {
    lastHitPos: null,

    firstTargetTried: false,
    targetsFiltered: false,
    lastTargetPos: null,
    lastTargetSuccess: false,
    nextTargets: [],
    adjacentPos: 
      {
        horizontal: [],
        vertical: []
      },
    resetToRandom: function() {
      this.firstTargetTried = false
      this.targetsFiltered = false
      this.lastTargetPos = null
      this.lastTargetSuccess = false
      this.nextTargets.length = 0

      this.adjacentPos.horizontal.length = 0
      this.adjacentPos.vertical.length = 0
      },
  }

  if (!state.lastHitPos) { ////Priority 1: fire first shot
    state.lastHitPos = aiAttackPosFn(aiShots)    
  } 

  else if (''){ ////Priority 2: Check for nextTargets

    if('') { //First time: !state.firstTargetTried
    //state.firstTargetTried = true //set flag

    //randomly choose one target, removing it from targets list
    //set target to lastTargetPos
    //set target to lastHitPos
    } 

    else { // if state.firstTargetTried && !state.targetsFiltered //filter once
      //state.targetsFiltered = true //set flag

      //filter out wrong axis targets based on lastTargetSuccess (?), 
      //and adjacentPos in the state with 2 arrays

      //state.lastTargetSuccess = false //reset
    }

    if('') { //Second time and onwards: if firstTargetTried

      //randomly choose one target from filtered targets, removing it from targets list
      //set target to lastTargetPos
      //set target to lastHitPos
    }
  
  } else { ////Priority 3: Random position

    state.lastHitPos = aiAttackPosFn(aiShots) 
  }
  
  /// check player board state and prepare next turn

  let shipOnGameboard = playerBoard.boardState[state.lastHitPos]
  let shipInShipYard = playerBoard.shipYard[shipOnGameboard].ship

  if (shipOnGameboard !== '') {//on hit

    if(state.lastHitPos === state.lastTargetPos) { // if was a target, remember
      state.lastTargetSuccess = true
    }

    if (!shipInShipYard.isSunk()) {//if not sunk

    //calculate adjacents aka nextTargets
    //add only new adjacents to nextTargets 
    }

    if (shipInShipYard.isSunk()) { //on sunk, soft reset to random

      //calculate all adjacents and diagonals and add to shots list
      state.resetToRandom()
    }

    if (!shipOnGameboard) { //on miss soft reset to random
      state.resetToRandom()
    }   
  }

//for testing need whole state object
  return state.lastHitPos
}

//random ai turn
function randomAiAttackPosFn(aiShots) {
  let aiAttackPos
  do {
    aiAttackPos = Math.floor(Math.random() * 100)
  } while (aiShots.includes(aiAttackPos))

  return aiAttackPos
}
/////////

module.exports = smartAi