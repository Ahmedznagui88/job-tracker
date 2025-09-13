"use client";
import React, { useEffect, useState } from "react";
import { createSession, updateSession } from '../lib/action'

interface TimerProps {
  projectName?: string;
  isRunning?: boolean;
  onStart?: () => void;
  onStop?: (sessionData: { projectName: string; seconds: number }) => void;
  resumeData?: {projectName: string; seconds: number} | null;
  onResumeComplete?: () => void;
}


const Timer: React.FC<TimerProps> = ({
  projectName,
  isRunning,
  onStart,
  onStop,
  resumeData,
  onResumeComplete,

}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [projectInput, setProjectInput] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

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

  useEffect(() => {
    if (resumeData) {
      setProjectInput(resumeData.projectName);
      setSeconds(resumeData.seconds);
      setIsActive(true);
      onResumeComplete?.();
    }
  }, [resumeData, onResumeComplete]);
  

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = async () => {
    if (projectInput.trim() === '') {
      alert('Please enter a project name before starting the timer.');
      return;
    }
  
    try {
      // Crea sessione nel database
      const sessionId = await createSession(projectInput.trim());
      setCurrentSessionId(sessionId);
      
      // Avvia timer
      setIsActive(true);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to start session. Please try again.');
    }
  };
  
  const handleStop = async () => {
    if (!currentSessionId) {
      alert('No active session found.');
      return;
    }
  
    try {
      // Salva sessione nel database
      await updateSession(currentSessionId, seconds);
      
      // Reset timer
      setIsActive(false);
      setSeconds(0);
      setProjectInput('');
      setCurrentSessionId(null);
      
      // Opzionale: notifica successo
      console.log('Session saved successfully');
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session. Please try again.');
    }
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
