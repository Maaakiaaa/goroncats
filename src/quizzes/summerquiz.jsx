import React, { useEffect, useRef, useState } from 'react'
import './quiz.css'
import quizzesData from '../data/quizzes.json'

export default function SummerQuiz({ quizId = 'quiz1', startIndex = 12 }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(false)
  const waitingForGestureRef = useRef(false)
  const [flatQuestions, setFlatQuestions] = useState([])
  const [chunkStart, setChunkStart] = useState(Math.max(0, Number(startIndex || 0)))
  const [chunkEnd, setChunkEnd] = useState(0)
  const [currentQ, setCurrentQ] = useState(Math.max(0, Number(startIndex || 0)))
  const [score, setScore] = useState(0)
  const [selectedKey, setSelectedKey] = useState(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    // Build a flat list of all questions across categories (preserve category order)
    const all = quizzesData.quizzes || {}
    const keys = Object.keys(all || {})
    const flat = []
    keys.forEach(k => {
      const block = all[k]
      if (!block || !block.questions) return
      const arr = Object.values(block.questions).map(q => ({ ...q, _quizKey: k, _quizTitle: block.title }))
      flat.push(...arr)
    })
    setFlatQuestions(flat)

    // compute chunk based on startIndex - chunk size 6
    const need = Math.max(0, Number(startIndex || 0))
    const start = Math.min(need, Math.max(0, flat.length))
    const end = Math.min(flat.length, start + 6)
    setChunkStart(start)
    setChunkEnd(end)
    setCurrentQ(start)
    console.log('[summerquiz] flatQuestions built', { total: flat.length, start, end })
  }, [quizId, startIndex])

  useEffect(() => {
    // try autoplay BGM (may be blocked by browser)
    const tryPlay = async () => {
      if (!audioRef.current) return
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setShowPlayButton(false)
      } catch (e) {
        // autoplay blocked -> show manual play button
        setShowPlayButton(true)
      }
    }

    const scheduleRetries = () => {
      tryPlay().then(ok => {
        if (ok) return
        const t = setTimeout(() => { tryPlay() }, 500)
        setTimeout(() => clearTimeout(t), 2000)
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

    const onHash = () => {
      const h = (location.hash || '').replace('#','')
      if (h === 'summerquiz') scheduleRetries()
    }
    const onUserGesture = () => { scheduleRetries() }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('focus', onUserGesture)
    window.addEventListener('click', onUserGesture)
    document.addEventListener('visibilitychange', onUserGesture)
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('focus', onUserGesture); window.removeEventListener('click', onUserGesture); document.removeEventListener('visibilitychange', onUserGesture); audioRef.current?.pause(); setIsPlaying(false); setShowPlayButton(false) }
  }, [])

  if (!flatQuestions || flatQuestions.length === 0) return <div className="quiz">クイズが見つかりません</div>

  const questions = flatQuestions
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
      // finish when we've reached the chunk end
      if (currentQ + 1 >= chunkEnd) {
        setFinished(true)
      } else {
        setCurrentQ(c => c + 1)
      }
    }, 800)
  }

  if (finished) {
    const totalShown = Math.max(0, chunkEnd - chunkStart)
    try { sessionStorage.setItem('lastQuizResult', JSON.stringify({ score, total: totalShown })) } catch (e) {}
    return (
      <div className="quiz">
        <div className="quiz-results" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:'translateY(40px) scale(1.3)'}}>
          <h2>結果</h2>
          <p>正解数: {score} / {totalShown}</p>
          <button className="ctrl primary image-btn" onClick={() => { location.hash = 'autumn' }} aria-label="次へ">
            <img src="/next.png" alt="次へ" style={{width:125,height:'auto'}} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz">

  <audio ref={audioRef} src="/mondaiBGM.mp3" loop preload="auto" />
      <h1 className="quiz-title">{q && q._quizTitle ? q._quizTitle : '問題'}</h1>

      <div className="big-question">{q ? q.text : ''}</div>

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
