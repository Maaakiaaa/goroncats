import React, { useState, useEffect } from 'react'
import './animation.css'

export default function Spring() {
  const scenes = [
    { image: '/room.png', text: '(お風呂から上がった僕は疲れて眠そうなねこをすぐにベッドへ連れて行った)' },
    { image: '/room.png', text: '「ふう、やっとひと段落したぞ」' },
    { image: '/room.png', text: '(名前をつけてやらないとな)' },
    { image: '/room.png', text: '(......)' },
    { image: '/room.png', text: '(”ねこまる”なんてどうだろうか)' },
    { image: '/room.png', text: '「よし、今日からお前はねこまるだ！」' },
    { image: '/room.png', text: '「ねこまる、よろしくな」' },
    { image: '/room.png', text: '(そろそろ自分も寝るか)' },
    { image: '/room.png', text: '（明日はねこまるのご飯を買いに行こう）' },
    { image: '/super.png', text: '翌日...' },
    { image: '/super.png', text: '店員:「何かお探しですか？」' },
    { image: '/super.png', text: '「え～っと、ねこの餌をください」' },
    { image: '/super.png', text: '店員:「いろいろありますけど、どれにしますか？」' }
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
        // start playing by default when this component mounts
        setPlaying(true)
      }
    } catch (e) {
      setPlaying(true)
    }
  }, [])

  // Typing effect: when index changes, type the scene text
  useEffect(() => {
    let charInterval = null
    let advTimer = null
    setDisplayedText('')
    setTyping(true)
    const text = scenes[index] && scenes[index].text ? scenes[index].text : ''
    const speed = 75 // ms per char

    if (!text || text.length === 0) {
      setTyping(false)
      if (playing) {
        advTimer = setTimeout(() => {
          setIndex(prev => {
              if (prev >= scenes.length - 1) {
                    location.hash = 'springquiz'
                    return prev
                  }
            return prev + 1
          })
        }, 1500)
      }
    } else {
      // use Array.from to handle unicode code points correctly
      const chars = Array.from(text)
      setDisplayedText('')
      setTyping(true)
      const timeouts = []
      chars.forEach((ch, idx) => {
        const t = setTimeout(() => {
          setDisplayedText(prev => prev + ch)
          // when last char has been appended
          if (idx === chars.length - 1) {
            setTyping(false)
            if (playing) {
              advTimer = setTimeout(() => {
                setIndex(prev => {
                  if (prev >= scenes.length - 1) {
                        location.hash = 'springquiz'
                        return prev
                      }
                  return prev + 1
                })
              }, 1500)
            }
          }
        }, speed * idx)
        timeouts.push(t)
      })

      // cleanup function should clear all per-char timeouts
      charInterval = {
        clear: () => timeouts.forEach(t => clearTimeout(t))
      }
    }

    return () => {
      if (charInterval) {
        if (typeof charInterval === 'object' && typeof charInterval.clear === 'function') {
          charInterval.clear()
        } else {
          clearInterval(charInterval)
        }
      }
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
