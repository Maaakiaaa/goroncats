import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from "./Home.jsx";
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
          <img
            src="/start.png"
            alt="Start Button"
            className="start-button"
            style={{ cursor: "pointer" }}
            onClick={() => handleRouteChange("hello")}
          />
        </>
      ) : route === "hello" ? (
        <h1>Hello World</h1>
      ) : (
        <Home setRoute={handleRouteChange} />
      )}
    </>
  )
}

export default App
