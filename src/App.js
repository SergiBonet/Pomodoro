import './App.css';
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from 'https://esm.sh/@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faPlay, faPause, faRotate } from 'https://esm.sh/@fortawesome/free-solid-svg-icons'

function App() {
  const Break = ({ breakTime, breakDecrement, breakIncrement }) => {
    return (
      <div className="break">
        <div id={"break-label"}><h3>Break Length</h3></div>
        <div className="down-label">
          <button onClick={breakDecrement} id="break-decrement"><FontAwesomeIcon icon={faArrowDown} /></button>
          <div id={"break-length"}>{breakTime}</div>
          <button onClick={breakIncrement} id="break-increment"><FontAwesomeIcon icon={faArrowUp} /></button>
        </div>
      </div>
    );
  };

  const Session = ({ sessionTime, sessionDecrement, sessionIncrement }) => {
    return (
      <div className="session">
        <div id={"session-label"}><h3>Session Length</h3></div>
        <div className="down-label">
          <button onClick={sessionDecrement} id={"session-decrement"}><FontAwesomeIcon icon={faArrowDown} /></button>
          <div id={"session-length"}>{sessionTime}</div>
          <button onClick={sessionIncrement} id={"session-increment"}><FontAwesomeIcon icon={faArrowUp} /></button>
        </div>
      </div>
    );
  };

  const Timer = ({ sessionBreak, tempo, sessionTempo, onSessionComplete  }) => {
    useEffect(() => {
      if (sessionTempo === 0) {
        onSessionComplete();
      }
    }, [sessionTempo, onSessionComplete]);

    return (
      <div className="timer">
        <div id={"timer-label"}><h3>{sessionBreak}</h3></div>
        <div id={"time-left"}>{tempo}</div>
        <audio id="beep" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    );
  };

  const Control = ({ startStop, reset }) => {
    return (
      <div className="">
        <button onClick={startStop} id={"start_stop"}><FontAwesomeIcon icon={faPlay} /><FontAwesomeIcon icon={faPause} /></button>
        <button onClick={reset} id={"reset"}><FontAwesomeIcon icon={faRotate} /></button>
      </div>
    );
  };

  const Clock = () => {
    let [breakTime, setBreakTime] = useState(5);
    let [sessionTime, setSessionTime] = useState(25);
    let [sessionBreak, setSessionBreak] = useState("Session");
    let [tempo, setTempo] = useState(sessionTime + ":00");
    let [sessionTempo, setSessionTempo] = useState(sessionTime * 60);
    let [intervalo, setIntervalo] = useState(null);
    let [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
      setTempo(sessionTime + ":00");
      setSessionTempo(sessionTime * 60);
    }, [sessionTime]);

    useEffect(() => {
      if (isRunning) {
        const id = setInterval(() => {
          setSessionTempo((prevTempo) => {
            let newTempo = prevTempo - 1;
            let minutos = Math.floor(newTempo / 60);
            let segundos = newTempo % 60;
            minutos = minutos < 10 ? '0' + minutos : minutos;
            segundos = segundos < 10 ? '0' + segundos : segundos;
            setTempo(`${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`);
            return newTempo;
          });
        }, 1000);
        setIntervalo(id);

        return () => clearInterval(id);
      }
    }, [isRunning]);

    useEffect(() => {
      if (sessionTempo === 0) {
        if (sessionBreak === "Session") {
          setSessionBreak("Break");
          setSessionTempo(breakTime * 60);
          setTempo(breakTime + ":00");
        } else {
          setSessionBreak("Session");
          setSessionTempo(sessionTime * 60);
          setTempo(sessionTime + ":00");
        }
        iniciarTemporizador();
      }
    }, [sessionTempo, sessionBreak, sessionTime, breakTime]);

    useEffect(() => {
      if (sessionBreak === "Session") {
        setTempo(sessionTime.toString().padStart(2, '0') + ":00");
        setSessionTempo(sessionTime * 60);
      } else {
        setTempo(breakTime.toString().padStart(2, '0') + ":00");
        setSessionTempo(breakTime * 60);
      }
    }, [sessionBreak, sessionTime, breakTime]);

    function iniciarTemporizador() {
      setIsRunning(true);
    }

    function detenerTemporizador() {
      setIsRunning(false);
      clearInterval(intervalo);
      setIntervalo(null);
    }
    
    const handleSessionComplete = () => {
      document.getElementById("beep").play();
    };
    const handleSoundStop = () => {
      document.getElementById("beep").pause();
      document.getElementById("beep").currentTime=0;
    }
    const handleButtonClick = (value) => {
      switch (value) {
        case "breakDecrement":
          if (!isRunning && breakTime > 1) {
            setBreakTime((breakTime) => Math.max(breakTime - 1, 1));
          }
          break;
        case "breakIncrement":
          if (!isRunning && breakTime < 60) {
            setBreakTime((breakTime) => Math.min(breakTime + 1, 60));
          }
          break;
        case "sessionDecrement":
          if (!isRunning && sessionTime > 1) {
            setSessionTime((sessionTime) => Math.max(sessionTime - 1, 1));
          }
          break;
        case "sessionIncrement":
          if (!isRunning && sessionTime < 60) {
            setSessionTime((sessionTime) => Math.min(sessionTime + 1, 60));
          }
          break;
        case "startStop":
          if (!isRunning) {
            iniciarTemporizador();
          } else {
            detenerTemporizador();
          }
          break;
        case "reset":
          detenerTemporizador();
          setBreakTime(5);
          setSessionTime(25);
          setSessionBreak("Session");
          setTempo("25:00");
          handleSoundStop();
          break;
        default:
          break;
      }
    };

    return (
      <div className="clock">
        <h1>25+5 CLOCK</h1>
        <div className="set">
          <Break
            breakTime={breakTime}
            breakDecrement={() => handleButtonClick("breakDecrement")}
            breakIncrement={() => handleButtonClick("breakIncrement")} />
          <Session
            sessionTime={sessionTime}
            sessionDecrement={() => handleButtonClick("sessionDecrement")}
            sessionIncrement={() => handleButtonClick("sessionIncrement")} />
        </div>
        <Timer
          tempo={tempo}
          sessionBreak={sessionBreak} 
          sessionTempo={sessionTempo}
          onSessionComplete={handleSessionComplete}
          />
        <Control
          startStop={() => handleButtonClick("startStop")}
          reset={() => handleButtonClick("reset")} />
      </div>
    );
  };

  return <Clock />;
}

export default App;
