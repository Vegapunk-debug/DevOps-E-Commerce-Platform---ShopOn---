import { useState, useEffect, useRef } from 'react';
import ShopOnLogo from './ShopOnLogo';

const TRACKS = [
  { label: 'NEXT', title: 'NO LIMITS' },
  { label: 'NOW PLAYING', title: 'VELOCITY' },
  { label: 'UP NEXT', title: 'STRIDE' },
  { label: 'ShopOn MIX', title: 'ELEVATION' },
];

export default function MusicCard() {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(48);
  const intervalRef = useRef(null);

  const track = TRACKS[trackIdx];

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Next track
            setTrackIdx(i => (i + 1) % TRACKS.length);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const nextTrack = () => {
    setTrackIdx(i => (i + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    if (progress > 10) {
      setProgress(0);
    } else {
      setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length);
      setProgress(0);
    }
  };

  return (
    <div className="music-card" aria-label="Player">
      <div className="top">
        <ShopOnLogo width={20} height={20} />
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="0.5" y="0.5" width="18" height="11" rx="2"/>
          <rect x="2" y="2" width="14" height="8" fill="currentColor"/>
          <rect x="20" y="4" width="1.6" height="4" fill="currentColor"/>
        </svg>
      </div>
      <div className="label mono">{playing ? track.label : 'NEXT'}</div>
      <div className="title">{track.title}</div>
      <div className="controls">
        <button className="ic-btn" onClick={prevTrack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6v12L9 12zM6 6h2v12H6z"/></svg>
        </button>
        <button className="play" onClick={() => setPlaying(!playing)}>
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button className="ic-btn" onClick={nextTrack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6v12l9-6zM16 6h2v12h-2z"/></svg>
        </button>
      </div>
      <div className="bar"><span style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
