import React, { useState, useEffect } from 'react'
import './animation.css'

export default function Summer() {
  const scenes = [
    { image: '/room.png', text: '(最近暑いなぁ...もう夏か...)' },
    { image: '/room.png', text: '窓の外から「ドーン！」と大きな音。' },
    { image: '/room.png', text: 'ねこまるは驚いて窓の外を見る。' },
    { image: '/hanabineko.png', text: 'それは、とてもきれいな花火だった。' },
    { image: '/hanabineko.png', text: '（ねこまると花火を一緒に見れてよかった）' },
    { image: '/hanabineko.png', text: '（夏の最高な思い出になった）' }
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
      } else {
        // default to playing so scenes auto-advance like Spring
        setPlaying(true)
      }
    } catch (e) {
      setPlaying(true)
    }
  }, [])

  // Typing effect: when index changes, type the scene text
  useEffect(() => {
    // Unicode-safe per-character typing using Array.from
    const timers = []
    let advTimer = null
    setDisplayedText('')
    setTyping(true)
    const text = scenes[index].text || ''
    const speed = 75 // ms per char

    const chars = Array.from(text)

    const typeChar = (i) => {
      if (i >= chars.length) {
        setTyping(false)
        if (playing) {
          advTimer = setTimeout(() => {
            if (index >= scenes.length - 1) {
              location.hash = 'summerquiz'
            } else {
              setIndex(s => s + 1)
            }
          }, 1500)
        }
        return
      }

      setDisplayedText(prev => prev + chars[i])
      const t = setTimeout(() => typeChar(i + 1), speed)
      timers.push(t)
    }

    if (chars.length === 0) {
      setTyping(false)
      if (playing) {
        advTimer = setTimeout(() => {
          if (index >= scenes.length - 1) {
            location.hash = 'summerquiz'
          } else {
            setIndex(s => s + 1)
          }
        }, 1500)
      }
    } else {
      typeChar(0)
    }

    return () => {
      timers.forEach(t => clearTimeout(t))
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
