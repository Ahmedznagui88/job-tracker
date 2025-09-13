"use client";
import React, { useEffect, useState } from "react";

interface TimerProps {
  projectName?: string;
  isRunning?: boolean;
  onStart?: () => void;
  onStop?: (sessionData: { projectName: string; seconds: number }) => void; // NUOVO
}

const Timer: React.FC<TimerProps> = ({
  projectName,
  isRunning,
  onStart,
  onStop,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [projectInput, setProjectInput] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setIsActive(true);
  const handleStop = () => {
    console.log("ProjectInput value:", projectInput); // DEBUG
    if (projectInput.trim() === "") {
      alert("Please enter a project name before stopping the timer.");
      return;
    }

    // Invia i dati al parent
    onStop?.({
      projectName: projectInput.trim(),
      seconds: seconds,
    });

    setIsActive(false);
    setSeconds(0);
    setProjectInput("");
  };

  return (
    <main className="hero">
      <section className="navTop">
        <div>
          <input
            className="input"
            type="text"
            placeholder="What are you working on?"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
          />
        </div>

        <div className="timer">
          <div>{formatTime(seconds)}</div>
          <div>
            {!isActive ? (
              <button className="btn" onClick={handleStart}>
                Start
              </button>
            ) : (
              <button
                className="btn"
                onClick={handleStop}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#c92424",
                  color: "#fff",
                }}
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Timer;
