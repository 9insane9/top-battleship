const smartAi = function(aiShots, playerBoard) {
  const tracker = {
    firstShotFired: false,
    lastHitPos: null,

    firstTargetTried: false,
    lastTargetPos: null,
    lastTargetSuccess: false,
    nextTargets: [],
  }

  if (!tracker.firstShotFired) { ////Priority 1: fire first shot
    tracker.firstShotFired = true
    tracker.lastHitPos = randomAiAttackPosFn(aiShots)    
  } 

  else if (''){ ////Priority 2: Check for nextTargets

    if('') { //First time: !tracker.firstTargetTried
    //tracker.firstTargetTried = true

    //randomly choose one target, removing it from targets list
    //set target to lastTargetPos
    //set target to lastHitPos
    } 

    if ('') { // if lastTargetSuccess === true, filter
      //filter out wrong axis targets based on lastTargetSuccess (?), 
      //and adjacentsObj in the tracker with 2 arrays

      //reset target sucess
    }

    if('') { //Second time and onwards: if firstTargetTried

      //randomly choose one target from filtered targets, removing it from targets list
      //set target to lastTargetPos
      //set target to lastHitPos
    }
  
  } else { ////Priority 3: Random position

    tracker.lastHitPos = randomAiAttackPosFn(aiShots) 
  }
  
  /// check player board state and prepare next turn

  let shipOnGameboard = playerBoard.boardState[tracker.lastHitPos]
  let shipInShipYard = playerBoard.shipYard[shipOnGameboard].ship

  if (shipOnGameboard !== '') {//on hit

    if (!shipInShipYard.isSunk()) {//if not sunk
    //calculate adjacents aka nextTargets
    //add new adjacents to nextTargets

      if(tracker.lastHitPos === tracker.lastTargetPos) { // if was a target, remember
        tracker.lastTargetSuccess = true
      }
    }

    if (shipInShipYard.isSunk()) { //on sunk, reset to random
      //calculate all adjacents and diagonals and add to shots list
      tracker.nextTargets.length = 0
      tracker.lastTargetPos = null
      tracker.firstTargetTried = null
      tracker.lastTargetSuccess = false
    }

    if (!shipOnGameboard) { //on miss reset to random
      tracker.nextTargets.length = 0
      tracker.lastTargetPos = null
      tracker.firstTargetTried = null
      tracker.lastTargetSuccess = false
    }
    
  }

  return tracker.lastHitPos
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