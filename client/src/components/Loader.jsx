import { useState, useEffect } from 'react';

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => onDone(), 400);
      }
      setProgress(Math.min(100, Math.round(p)));
    }, 200);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className={`loader-screen ${progress >= 100 ? 'gone' : ''}`}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 38, letterSpacing: '0.08em' }}>ShopOn</div>
        <div className="bar"><span style={{ width: `${progress}%` }} /></div>
        <div className="lbl">LOADING · {progress}%</div>
      </div>
    </div>
  );
}
