import { useState, useEffect } from 'react';

const SECTION_COUNT = 6;

export default function ProgressRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setActive(Math.min(SECTION_COUNT - 1, Math.floor(progress * SECTION_COUNT)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="progress">
      {Array.from({ length: SECTION_COUNT }).map((_, i) => (
        <span key={i} className={i === active ? 'on' : ''} />
      ))}
    </div>
  );
}
