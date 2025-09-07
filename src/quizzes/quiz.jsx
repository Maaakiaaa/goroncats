import React, { useEffect, useRef, useState } from 'react'
import './quiz.css'
import quizzesData from '../data/quizzes.json'

export default function Quiz({ quizId = 'quiz1' }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const waitingForGestureRef = useRef(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    // load from local JSON; if requested quizId does not exist, fall back to first available
    const all = quizzesData.quizzes || {}
    let data = all && all[quizId]
    if (!data) {
      const keys = Object.keys(all || {})
      if (keys.length > 0) {
        const fallbackKey = keys[0]
        data = all[fallbackKey]
        console.warn(`[Quiz] quizId "${quizId}" not found; falling back to "${fallbackKey}"`)
      } else {
        data = null
      }
    }
    setQuiz(data || null)
  }, [quizId])

  // after quiz data is loaded, check if we should start at a specific question index
  useEffect(() => {
    if (!quiz) return
    try {
      // first, try parsing hash params like #hello?start=6
      const hash = location.hash || ''
      const qIdx = (hash.includes('?') && new URLSearchParams(hash.split('?')[1]).get('start')) || null
      if (qIdx !== null) {
        const n = parseInt(qIdx, 10)
        if (!Number.isNaN(n)) {
          const questions = quiz.questions ? Object.values(quiz.questions) : []
          const maxIndex = Math.max(0, questions.length - 1)
          const start = Math.min(n, maxIndex)
          setCurrentQ(start)
        }
        // remove start param from hash to avoid repeated parsing
        const base = hash.split('?')[0] || '#hello'
        location.hash = base
        return
      }

      // fallback to sessionStorage if present
      const v = sessionStorage.getItem('quizStartIndex')
      if (v !== null) {
        const n = parseInt(v, 10)
        if (!Number.isNaN(n)) {
          const questions = quiz.questions ? Object.values(quiz.questions) : []
          const maxIndex = Math.max(0, questions.length - 1)
          const start = Math.min(n, maxIndex)
          setCurrentQ(start)
        }
        sessionStorage.removeItem('quizStartIndex')
      }
    } catch (e) {}
  }, [quiz])

  useEffect(() => {
    // try autoplay BGM (may be blocked by browser); implement multiple retries and triggers
    const tryPlay = async () => {
      if (!audioRef.current) return false
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        return true
      } catch (e) {
        return false
      }
    }

    const scheduleRetries = () => {
      // immediate attempt
      tryPlay().then(ok => {
        if (ok) return
        // delayed retry after short timeout
        const t = setTimeout(() => { tryPlay() }, 500)
        setTimeout(() => clearTimeout(t), 2000)
        // if still blocked, wait for next user gesture and then try again
        waitingForGestureRef.current = true
        const gesture = async () => {
          if (!waitingForGestureRef.current) return
          const ok2 = await tryPlay()
          if (ok2) waitingForGestureRef.current = false
          removeGestureListeners()
        }
        const addGestureListeners = () => {
          window.addEventListener('pointerdown', gesture, { once: true })
          window.addEventListener('touchstart', gesture, { once: true })
          window.addEventListener('keydown', gesture, { once: true })
        }
        const removeGestureListeners = () => {
          try { window.removeEventListener('pointerdown', gesture) } catch (e) {}
          try { window.removeEventListener('touchstart', gesture) } catch (e) {}
          try { window.removeEventListener('keydown', gesture) } catch (e) {}
        }
        addGestureListeners()
      })
    }

    const shouldAuto = sessionStorage.getItem('animationAutoplay') === '1'
    if (shouldAuto) {
      scheduleRetries()
      try { sessionStorage.removeItem('animationAutoplay') } catch (e) {}
    } else {
      scheduleRetries()
    }

    // attempt again when route becomes #hello
    const onHash = () => {
      const h = (location.hash || '').replace('#','')
      if (h === 'hello' || h === '') scheduleRetries()
    }
    // also retry proactively on focus/click/visibility changes
    const onUserGesture = () => { scheduleRetries() }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('focus', onUserGesture)
    window.addEventListener('click', onUserGesture)
    document.addEventListener('visibilitychange', onUserGesture)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('focus', onUserGesture)
      window.removeEventListener('click', onUserGesture)
      document.removeEventListener('visibilitychange', onUserGesture)
      audioRef.current?.pause(); setIsPlaying(false)
    }
  }, [])

  if (!quiz) return <div className="quiz">クイズが見つかりません</div>

  const questions = quiz.questions ? Object.values(quiz.questions) : []
  const q = questions[currentQ]

  const handleChoice = (idx) => {
    if (!q) return
    if (selectedKey !== null) return // already answered
    const keys = Object.keys(q.choices || {})
    const key = keys[idx]
    setSelectedKey(key)
    const correct = String(q.answer)
    if (key === correct) {
      setScore(s => s + 1)
    }
    // short delay to show feedback, then advance or finish
    setTimeout(() => {
      setSelectedKey(null)
      if (currentQ + 1 >= questions.length) {
        setFinished(true)
      } else {
        setCurrentQ(c => c + 1)
      }
    }, 800)
  }

  // If finished, render only the minimal results view requested by user
  if (finished) {
    return (
      <div className="quiz">
        <div className="quiz-results">
          <h2>結果</h2>
          <p>正解数: {score} / {questions.length}</p>
          <button className="ctrl primary image-btn" onClick={() => { location.hash = 'spring' }} aria-label="再挑戦">
            <img src="/next.png" alt="再挑戦" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz">
      <audio ref={audioRef} src="/mondaiBGM.mp3" loop preload="auto" />
  {/* autoplay attempts handled via lifecycle and user gesture listeners; no manual button */}
      <h1 className="quiz-title">{quiz.title || '問題'}</h1>

      {/* show the current question prominently where the description used to be */}
      <div className="big-question">{q ? q.text : (quiz.description || '')}</div>

      {q ? (
        <div className='quizkaitou'>
          {Object.values(q.choices || {}).map((c, i) => {
            const keys = Object.keys(q.choices || {})
            const key = keys[i]
            const cls = selectedKey
              ? (key === String(q.answer) ? 'quizlabel correct' : (key === selectedKey ? 'quizlabel incorrect' : 'quizlabel'))
              : 'quizlabel'
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onClick={() => handleChoice(i)}
                disabled={selectedKey !== null}
              >{c}</button>
            )
          })}
        </div>
      ) : (
        <div>全問終了</div>
      )}
    </div>
  )
}
