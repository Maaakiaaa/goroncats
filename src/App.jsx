import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from "./Home.jsx";
import Quiz from "./quizzes/quiz.jsx";
import Animation from "./animation/Animation.jsx";
import Spring from "./animation/spring.jsx";
import SpringQuiz from "./quizzes/springquiz.jsx";
function App() {
    const [route, setRoute] = useState(() => {
    const hash = location.hash.replace("#", "");
    return hash === "" ? "home" : hash;
  });
  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
    location.hash = newRoute;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = location.hash.replace("#", "");
      setRoute(hash === "" ? "home" : hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return (
    <>
      {route === "home" ? (
        <>
          <img src="/neko.png" alt="Neko" className="neko-img" />
          <button
            type="button"
            className="start-link"
            onClick={() => {
              // mark that animation should autoplay (user gesture present)
              try { sessionStorage.setItem('animationAutoplay', '1') } catch (e) {}
              location.hash = 'animation'
            }}
            aria-label="Start"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <img
              src="/start.png"
              alt="Start Button"
              className="start-button"
              style={{ cursor: "pointer" }}
            />
          </button>
        </>
      ) : route === "hello" ? (
        <div className='background'>
          <Quiz />
        </div>
      ) : route === "animation" ? (
        <Animation />
      ) : route === "spring" ? (
        <Spring />
      ) : route === "springquiz" ? (
        <SpringQuiz />
      ) : (
        <Home setRoute={handleRouteChange} />
      )}
    </>
  )
}

export default App
