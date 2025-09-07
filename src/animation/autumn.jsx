import React, { useState, useEffect } from 'react'
import './animation.css'

export default function autumn() {
  const scenes = [
    { image: '/kazyuen.jpg', text: '今日は果物狩りに来た' },
    { image: '/kazyuen.jpg', text: '店員「お待たせしました」' },
    { image: '/kazyuen.jpg', text: '店員「今から果物狩りのルール説明を行います」' },
    { image: '/kazyuen.jpg', text: '店員「それでは果物狩り楽しんでください！」' },
    { image: '/kazyuen.jpg', text: '僕がとった果物を興味深そうにねこまるが見ている' },
    { image: '/kazyuen.jpg', text: '「待ってて、食べやすいようにするから」' },
    { image: '/kazyuen.png', text: '小さく切って皿にのせてやる。' },
    { image: '/kazyuen.png', text: 'ねこまるは満足そうにペロッと平らげた' },
    { image: '/room.png', text: '換毛期「今日はやけにねこまるの毛が多いな」' },
    { image: '/room.png', text: 'ねこまるが毛をまき散らしながら甘えに来た' },
    { image: '/room.png', text: '「確保！！」僕は猫用のブラシでねこまるを徹底的にブラッシングした' },
    { image: '/room.png', text: 'すると、毛玉が１つ、２つ、たくさん出てきた！' },
  ]

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [typing, setTyping] = useState(false)
  // autoplay flag handled elsewhere; auto-advance will be scheduled after typing completes

  // If we were navigated here by Start button, autoplay
  useEffect(() => {
    try {
      const v = sessionStorage.getItem('animationAutoplay')
      if (v === '1') {
        setPlaying(true)
        sessionStorage.removeItem('animationAutoplay')
      }
    } catch (e) {}
  }, [])

  // Typing effect: when index changes, type the scene text
  useEffect(() => {
    let charTimer = null
    let advTimer = null
    setDisplayedText('')
    setTyping(true)
    const text = scenes[index].text || ''
    const speed = 75 // ms per char

    // function to type the next character by index
    const typeChar = (i) => {
      // if component unmounted or index changed, stop
      if (!text || i >= text.length) {
        setTyping(false)
        // schedule auto-advance only after typing completes
        if (playing) {
          advTimer = setTimeout(() => {
            // if this is the last scene, go to Quiz ('hello'), otherwise next scene
            if (index >= scenes.length - 1) {
              location.hash = 'hello'
            } else {
              setIndex(s => s + 1)
            }
          }, 1500) // 1.5 seconds after complete
        }
        return
      }
      // append the character
      setDisplayedText(prev => prev + text.charAt(i))
      // schedule next
      charTimer = setTimeout(() => typeChar(i + 1), speed)
    }

    // start typing from first character (index 0)
      if (text.length === 0) {
      setTyping(false)
      if (playing) {
        advTimer = setTimeout(() => {
          if (index >= scenes.length - 1) {
            location.hash = 'hello'
          } else {
            setIndex(s => s + 1)
          }
        }, 1500)
      }
    } else {
      // start immediately with first char
      typeChar(0)
    }

    return () => {
      if (charTimer) clearTimeout(charTimer)
      if (advTimer) clearTimeout(advTimer)
    }
  }, [index, playing])

  

  const next = () => setIndex(i => Math.min(i + 1, scenes.length - 1))
  const prev = () => setIndex(i => Math.max(i - 1, 0))
  const goHome = () => { location.hash = 'home' }

  

  return (
  <div className="animation-root">
      <div className="scene">
        <img src={scenes[index].image} alt="scene" className="scene-image" />
        <div className="scene-text" key={index}>
          <span className="typing-text">{displayedText}</span>
          <span className={`typing-caret ${typing ? 'active' : ''}`}>|</span>
        </div>
      </div>
    </div>
  )
}