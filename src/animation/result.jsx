import React from 'react'
import './animation.css'

export default function Result() {
  const raw = (location.hash || '').replace('#','')
  // parse query params after ?
  const [base, q] = raw.split('?')
  const params = new URLSearchParams(q || '')
    let score = parseInt(params.get('score') || '0', 10)
    // total questions is fixed to 23
    const TOTAL_QUESTIONS = 23
    // fallback to sessionStorage if score not passed via query
    if (isNaN(score) && typeof sessionStorage !== 'undefined') {
      try {
        const rawStored = sessionStorage.getItem('lastQuizResult')
        if (rawStored) {
          const obj = JSON.parse(rawStored)
          if (obj && typeof obj.score === 'number') {
            score = obj.score
          }
        }
      } catch (e) {}
    }
    const pct = Number.isFinite(score) ? Math.round((score / TOTAL_QUESTIONS) * 100) : null

  return (
    <div className="animation-root">
  <div className="scene" style={{transform:'scale(1.70)', transformOrigin:'top center', display:'flex', justifyContent:'center'}}>
  <div className="scene-text" style={{textAlign:'center', width: 'calc(100% - 2rem + 300px)', maxWidth: '1100px'}}>
          <h2>結果</h2>
          {Number.isFinite(score) ? (
            <>
              <p>問題数: {TOTAL_QUESTIONS}</p>
              <p>正解数: {score}</p>
              <p>正解率: {pct}%</p>
              <div style={{marginTop:20}}>
                <button className="image-btn fin-btn" onClick={() => { location.hash = 'fin' }} style={{background:'none',border:'none',padding:0,cursor:'pointer'}} aria-label="fin">
                  <img src="/fin.png" alt="fin" style={{maxWidth:500, height:'auto',display:'block',margin:'12px auto 0'}}/>
                </button>
              </div>
            </>
          ) : (
            <p>結果が渡されていません</p>
          )}
        </div>
      </div>
    </div>
  )
}
