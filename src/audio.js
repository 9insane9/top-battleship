import music from './audio/battleship-theme.mp3' //first game soundtrack, yay
import positive from './audio/positive.mp3'
import negative from './audio/negative.mp3'
import hover from './audio/hover.mp3'
import click from './audio/click.mp3'
import start from './audio/start.mp3'
import win from './audio/win.mp3'
import lose from './audio/lose.mp3'

import soundOff from './images/soundOff.svg'
import soundOn from './images/soundOn.svg'

export const audio = function() {

  const soundBtnEl = document.querySelector('.sound-btn')
  const soundBtnImageEl = document.querySelector('.sound-btn-image')
  soundBtnImageEl.src = soundOff

  const mediaEls = {
    music: document.createElement('audio'),
    click: document.createElement('audio'),
    hover: document.createElement('audio'),
    positive: document.createElement('audio'),
    negative: document.createElement('audio'),
    start: document.createElement('audio'),
    win: document.createElement('audio'),
    lose: document.createElement('audio'),
  }

  const volumeMixer = {
    music: 0.8,
    sfx: 0,
  }

  initSounds()

  let isMusicStarted = false
  let isMusicPlaying = false

  function initSounds() {
    mediaEls.music.setAttribute('loop', 'loop')
    mediaEls.music.src = music
    mediaEls.music.volume = 0
  
    mediaEls.click.src = click
    mediaEls.click.volume = 0
  
    mediaEls.hover.src = hover
    mediaEls.hover.volume = 0
  
    mediaEls.positive.src = positive
    mediaEls.positive.volume = 0
  
    mediaEls.negative.src = negative
    mediaEls.negative.volume = 0
  
    mediaEls.start.src = start
    mediaEls.start.volume = 0
  
    mediaEls.win.src = win
    mediaEls.win.volume = 0
  
    mediaEls.lose.src = lose
    mediaEls.lose.volume = 0
  }

  function initMusicAndButton() {

    soundBtnEl.addEventListener('click', () => {

      if (!isMusicStarted && !isMusicPlaying) {
      isMusicStarted = true
      isMusicPlaying = true

      soundBtnImageEl.src = soundOn
      volumeMixer.music = 0.8
      volumeMixer.sfx = 0.65

      mediaEls.music.play()

      } else if (isMusicStarted && isMusicPlaying) {
        isMusicPlaying = false

        soundBtnImageEl.src = soundOff
        volumeMixer.music = 0
        volumeMixer.sfx = 0

      } else if (isMusicStarted && !isMusicPlaying) { //
        isMusicPlaying = true

        soundBtnImageEl.src = soundOn
        volumeMixer.music = 0.8
        volumeMixer.sfx = 0.65
      }

      setVolumes(volumeMixer.music, volumeMixer.sfx)      
    })
  }

  function playPositive() {
    mediaEls.positive.currentTime = 0
    volumeMixer.sfx > 0 ? mediaEls.positive.play() : null
  }
  
  function playNegative() {
    mediaEls.negative.currentTime = 0
    volumeMixer.sfx > 0 ? mediaEls.negative.play() : null
  }
  
  function playHover() {
    mediaEls.hover.currentTime = 0
    volumeMixer.sfx > 0 ? mediaEls.hover.play() : null
  }
  
  function playClick() {
    mediaEls.click.currentTime = 0
    volumeMixer.sfx > 0 ? mediaEls.click.play() : null
  }
  
  function playStart() {
    volumeMixer.sfx > 0 ? mediaEls.start.play() : null
  }

  function playEnd(winner) {
    if (isMusicPlaying) { //if music playing, mute temporarily
      mediaEls.music.volume = 0.2
    } 

    if (volumeMixer.sfx > 0) {
      winner === "player" ? mediaEls.win.play() : mediaEls.lose.play()

      setTimeout(() => {
        const targetVolume = 0.8 // starting volume
        const duration = 3000
        const increment = 0.05 //will this make it more gradual over the same amount of time?
        const intervalTime = duration / (targetVolume / increment)
    
        let currentMusicVolume = mediaEls.music.volume

        if (currentMusicVolume >= targetVolume) { //if no change necessary
          mediaEls.music.volume = targetVolume
          return
        }
    
        const volumeInterval = setInterval(() => {
          if (currentMusicVolume >= targetVolume) {
            clearInterval(volumeInterval)
          } else {
            currentMusicVolume = Math.min(currentMusicVolume + increment, targetVolume)
            mediaEls.music.volume = currentMusicVolume
          }
        }, intervalTime)
      }, 3000)

    }
  }

  function setVolumes(musicVolume, sfxVolume) {
    mediaEls.music.volume = musicVolume

    mediaEls.click.volume = sfxVolume
    mediaEls.hover.volume = sfxVolume
    mediaEls.positive.volume = sfxVolume
    mediaEls.negative.volume = sfxVolume
    mediaEls.start.volume = sfxVolume
    mediaEls.win.volume = sfxVolume
    mediaEls.lose.volume = sfxVolume
  }

  return {
    initMusicAndButton,
    playPositive,
    playNegative,
    playHover,
    playClick,
    playStart,
    playEnd
  }
}