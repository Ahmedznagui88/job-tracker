'use client';
import Timer from "@/app/components/Timer";
import WorkingProgress from "@/app/components/workingProgress";
import { useState } from 'react';


interface Session {
  id: string;
  projectName: string;
  accumulatedSeconds: number;
  lastUpdated: Date;
}


export default function Home() {

  const [sessions, setSessions] = useState<Session[]>([]);
  const [resumeData, setResumeData] = useState<{projectName: string; seconds: number} | null>(null);
  const handleResumeSession = (session: Session) => {
    // Passa i dati al Timer
    setResumeData({
      projectName: session.projectName,
      seconds: session.accumulatedSeconds
    });
    
    // Rimuovi la sessione da Working Progress
    setSessions(prev => prev.filter(s => s.id !== session.id));
  };
  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleTimerStop = (sessionData: { projectName: string; seconds: number }) => {
    const newSession = {
      id: Date.now().toString(),
      projectName: sessionData.projectName,
      accumulatedSeconds: sessionData.seconds,
      lastUpdated: new Date()
    };
    
    setSessions(prev => [...prev, newSession]);
  };

  return (
    <main className="page">
      <h1 className="title">Study Tracker</h1>
      <Timer onStop={handleTimerStop} />

      <h3 className='test'>Working Progress</h3>
      <section className="section">
      <WorkingProgress 
        sessions={sessions}
        onResumeSession={handleResumeSession}
        onDeleteSession={handleDeleteSession}
/>
      </section>
    </main>

  )
}