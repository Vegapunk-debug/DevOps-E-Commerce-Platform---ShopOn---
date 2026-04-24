import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const [phase, setPhase] = useState('visible'); // 'visible' | 'exit' | 'enter'
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPath.current) {
      setDisplayChildren(children);
      return;
    }

    prevPath.current = location.pathname;

    // Phase 1: exit current page
    setTransitioning(true);
    setPhase('exit');

    const exitTimer = setTimeout(() => {
      // Phase 2: swap content + enter
      setDisplayChildren(children);
      setPhase('enter');
      window.scrollTo(0, 0);

      const enterTimer = setTimeout(() => {
        setPhase('visible');
        setTransitioning(false);
      }, 500);

      return () => clearTimeout(enterTimer);
    }, 400);

    return () => clearTimeout(exitTimer);
  }, [location.pathname, children]);

  const style = {
    exit: {
      opacity: 0,
      transform: 'translateY(-30px) scale(0.98)',
      filter: 'blur(4px)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    enter: {
      opacity: 0,
      transform: 'translateY(40px) scale(0.98)',
      filter: 'blur(4px)',
      transition: 'none',
    },
    visible: {
      opacity: 1,
      transition: 'all 0.5s cubic-bezier(0.0, 0, 0.2, 1)',
    },
  };

  return (
    <>
      <div className={`page-wipe ${transitioning ? 'active' : ''}`} />
      <div style={{ position: 'relative', zIndex: 5, ...style[phase] }}>
        {displayChildren}
      </div>
    </>
  );
}
