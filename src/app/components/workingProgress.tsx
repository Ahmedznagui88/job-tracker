'use client';
import React from 'react';

interface Session {
    id: string;
    projectName: string;
    accumulatedSeconds: number;
    lastUpdated: Date;
  }

interface WorkingProgressProps {
  sessions: Session[];
  onResumeSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
}

const WorkingProgress: React.FC<WorkingProgressProps> = ({ 
  sessions, 
  onResumeSession, 
  onDeleteSession 
}) => {
  
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  /* if (sessions.length === 0) {
    return (
      <div className="working-progress">
        <h3 className='test'>Working Progress</h3>
        
      </div>
    );
  } */

  return (
    <div className="work-section">
      {/* <h3 >Working Progress</h3> */}
      {sessions.map((session) => (
        <div key={session.id} className="navTop2">
          <div className="">
            <span className="project-name">{session.projectName}</span>
          </div>
            <span className="session-time">{formatTime(session.accumulatedSeconds)}</span>
          <div className="session-actions">
            <button onClick={() => onResumeSession(session)} className="btn">
              Start
            </button>
            <button onClick={() => onDeleteSession(session.id)} className="btn-delete">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkingProgress;