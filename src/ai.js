const smartAi = function() {
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

  function attack (playerBoard, aiShots) { // I. primary
    if (state.nextTargets.length || state.adjacentPos.x.length !== 0 || state.adjacentPos.y.length !== 0){ ////Priority 1: Check for nextTargets
      console.log(`Targets found: ${state.nextTargets}`)

      if(!state.lastTargetPos) { //First target, aka second shot
        console.log(`Firing at first target!`)
        assignRandomTarget() 
      } 
  
      else if (state.lastTargetPos){ //after first shot: filter after every shot and shoot
        calculateAxis() //first, if not already calculated
        filterTargetsToAxis() //second, filter and add new targets
        assignRandomTarget() //and then fire
      }
    
    } else { ////Priority 2: Random position
      console.log(`Should be no targets here: ${state.nextTargets}`)
      state.lastHitPos = randomAiAttackPosFn(aiShots) 
      console.log(`Random shot fired at ${state.lastHitPos}`)
    }  
  
    state.lastTargetSuccess = false //reset after every shot

    if (!aiShots.includes(state.lastHitPos)) { //update shots
      console.log(`Before checking game state, adding ${state.lastHitPos} to shots list`)
      aiShots.push(state.lastHitPos) 
    }
    
    /// check player board state

    let shipOnGameboard = null
    let shipStatus = null
    
    if (playerBoard.boardState[state.lastHitPos] !== '') {

      shipOnGameboard = playerBoard.boardState[state.lastHitPos]
      shipStatus = playerBoard.fleet[shipOnGameboard].status

      console.log(`Ship ${shipOnGameboard} found at position ${state.lastHitPos}!`)
    }
    
    //prepare next run

    if (shipOnGameboard) {///on hit
      
      if(state.lastHitPos === state.lastTargetPos) { state.lastTargetSuccess = true } //check if target success

      playerBoard.receiveAttack(state.lastHitPos) //update board

      console.log(`Successful attack performed at ${state.lastHitPos}`)
  
      if (!shipStatus.isSunk) { //on hit: if not sunk
        console.log("Ship was hit, but is still on the board!")
        console.log("Adding new adjacents...")
        addNewAdjacents()
      } 
  
      if (shipStatus.isSunk) { //on hit: if sunk
        console.log(`Ship was sunk at ${shipStatus.position}!`)
        markSurroundingAreaAsShot(shipStatus.position, aiShots)
        state.resetToRandom()
      }   
    }
  
    if (!shipOnGameboard) { //on miss
      console.log(`Shot missed at position ${state.lastHitPos}!`)

      if (state.nextTargets.length === 0) { //
        console.log(`No targets after miss, resetting to random shot!`)
        state.resetToRandom() 
      }
    }
  
    //helpers
  
    function filterTargetsToAxis() {
      const newTargets = state.adjacentPos[state.currentAimAxis] //filter out targets already on nextTargets
          .filter((position) => !state.nextTargets.includes(position))

          state.nextTargets = [...state.nextTargets, ...newTargets] //set

          //then filter out targets on wrong axis
          state.nextTargets = state.nextTargets
            .filter((target) => state.adjacentPos[state.currentAimAxis].includes(target))

          //also clear adjacentPos
          state.adjacentPos.x.length = 0
          state.adjacentPos.y.length = 0

          console.log(`filterTargetToAxis: next targets are: ${state.nextTargets}`)
    }
  
    function assignRandomTarget() {
      const targets = state.nextTargets
      if (targets.length === 0) return

      console.log(`Targets before selecting random: ${targets}`)
  
      const randomIndex = Math.floor(Math.random() * targets.length)
      const randomTarget = targets[randomIndex]
      targets.splice(randomIndex, 1)
      state.lastHitPos = randomTarget
      state.lastTargetPos = randomTarget

      console.log(`Targets after selecting random: ${targets}`)
      console.log(`Random target selected: ${state.lastTargetPos}`)
    }
  
    function addNewAdjacents() {
      const newAdjacents = {   //calculate
                            x: [state.lastHitPos - 1, state.lastHitPos + 1],
                            y: [state.lastHitPos - 10, state.lastHitPos + 10]
                            }

      // console.log("AddNewAdjacents: Before Filter: ", newAdjacents)
  
      const filteredAdjacents = filterOnGridAndNotShot(newAdjacents, aiShots)
  
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

      console.log(`New adjacents not already on targets list /  x:${uniqueAdjacents.x} / y:${uniqueAdjacents.y}`)

      if (!state.lastTargetPos && state.nextTargets.length === 0) { //add all adjacents to targets on first time hit
        console.log("First successful hit, adding all adjacents to targets!")
        state.nextTargets = [...uniqueAdjacents.x, ...uniqueAdjacents.y]
      }

      // Add the filtered coordinates to adjacentPos
      state.adjacentPos.x = [...state.adjacentPos.x, ...uniqueAdjacents.x]
      state.adjacentPos.y = [...state.adjacentPos.y, ...uniqueAdjacents.y]

      console.log(`New state of adjacentPos / x: ${state.adjacentPos.x} / y: ${state.adjacentPos.y}`)
    }
  
    function calculateAxis() {
      if (!state.currentAimAxis) {
        console.log(`Calculating axis...`)
        const isSuccess = state.lastTargetSuccess
  
        if (state.adjacentPos.x.includes(state.lastTargetPos)) {
          isSuccess ? state.currentAimAxis = "x" : state.currentAimAxis = "y"
  
        } else if (state.adjacentPos.y.includes(state.lastTargetPos)) {
          isSuccess ? state.currentAimAxis = "y" : state.currentAimAxis = "x"
        }

      }

      console.log(`Axis is: ${state.currentAimAxis}`)
    }
  
    function filterOnGridAndNotShot(all, aiShots) { //filter range and shots list
      const isTwoDimensional = Array.isArray(all.x) && Array.isArray(all.y);
      // console.log(`Two dimensional: ${isTwoDimensional}`)
  
      if (isTwoDimensional) {
        all.x = all.x.filter(position => position >= 0 && position <= 99 && !aiShots.includes(position))
        all.y = all.y.filter(position => position >= 0 && position <= 99 && !aiShots.includes(position))
        console.log(`filterOnGridAndNotShot - adj: in bounds and not already shot: x ${all.x} / y ${all.y}`)
      } else {
        all = all.filter(position => position >= 0 && position <= 99 && !aiShots.includes(position))
        console.log(`filterOnGridAndNotShot - surrounding: in bounds and not already shot: ${all}`)
      }
      console.log(`ai shots: ${aiShots}`)
      return all
    }
  
    function markSurroundingAreaAsShot(shipPosition, aiShots) {
      let allCoordinates = [] //calculate adjacents and diagonals of all sunk ship positions
  
      shipPosition.forEach((coordinate) => {
        allCoordinates.push(coordinate - 11, 
                            coordinate - 10, 
                            coordinate - 9, 
                            coordinate - 1, 
                            coordinate + 1, 
                            coordinate + 9, 
                            coordinate + 10, 
                            coordinate + 11)
      })
      
      //filter range/already shot and add to shots list
      const surroundingPos = filterOnGridAndNotShot(allCoordinates, aiShots)
      console.log(`Marking area as shot ${surroundingPos}`)

      aiShots.push(...surroundingPos)
    }
  
    return state.lastHitPos
  }

  function getState() { // II. secondary
    // console.log(state)
    return state
  }

  return { attack, getState }
  
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