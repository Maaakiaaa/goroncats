import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from "./Home.jsx";
import Quiz from "./quizzes/quiz.jsx";
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
          <a
            href="/index.html#hello"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/start.png"
              alt="Start Button"
              className="start-button"
              style={{ cursor: "pointer" }}
            />
          </a>
        </>
      ) : route === "hello" ? (
        <div className='background'>
          <Quiz />
        </div>
        
      ) : (
        <Home setRoute={handleRouteChange} />
      )}
    </>
  )
}

export default App
