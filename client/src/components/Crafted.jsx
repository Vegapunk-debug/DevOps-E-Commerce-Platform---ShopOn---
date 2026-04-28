const tiles = [
  {
    tag: '// DETAIL · UPPER MESH',
    title: 'LIGHTWEIGHT DESIGN',
    desc: 'ENSURES MAXIMUM AGILITY AND COMFORT',
    stat: '248G',
    statLabel: 'WEIGHT',
    visual: 'mesh',
  },
  {
    tag: '// DETAIL · TOP VIEW',
    title: 'PRECISION FIT',
    desc: 'DYNAMIC LACING LOCKS IN THE STRIDE',
    stat: '8MM',
    statLabel: 'DROP',
    visual: 'laces',
  },
  {
    tag: '// DETAIL · OUTSOLE',
    title: 'EXCEL TRACTION',
    desc: 'OFFERS SUPERIOR GRIP ON VARIOUS SURFACES',
    stat: 'HEX',
    statLabel: 'GRID',
    visual: 'tread',
  },
];

function Visual({ kind }) {
  if (kind === 'mesh') {
    return (
      <svg className="tile-visual" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="meshpat" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <circle cx="9" cy="9" r="1.4" fill="currentColor" />
            <path d="M0 9 H18 M9 0 V18" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="200" height="240" fill="url(#meshpat)" />
        <circle cx="150" cy="60" r="60" fill="currentColor" opacity="0.08" />
      </svg>
    );
  }
  if (kind === 'laces') {
    return (
      <svg className="tile-visual" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <path
              d={`M30 ${30 + i * 28} L170 ${42 + i * 28}`}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity={0.75 - i * 0.06}
            />
            <circle cx="30" cy={30 + i * 28} r="3" fill="currentColor" />
            <circle cx="170" cy={42 + i * 28} r="3" fill="currentColor" />
          </g>
        ))}
        <rect x="92" y="20" width="16" height="200" rx="8" fill="currentColor" opacity="0.06" />
      </svg>
    );
  }

  return (
    <svg className="tile-visual" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="hexpat" x="0" y="0" width="22" height="38" patternUnits="userSpaceOnUse">
          <polygon
            points="11,2 21,8 21,20 11,26 1,20 1,8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="200" height="240" fill="url(#hexpat)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x="20" y={50 + i * 28} width="160" height="6" rx="3" fill="currentColor" opacity={0.18 + i * 0.04} />
      ))}
    </svg>
  );
}

export default function Crafted() {
  return (
    <section className="crafted" data-section="crafted">
      <div className="wrap">
        <div className="eyebrow mono">SAIL TC 7900</div>
        <h2 className="crafted-head">CRAFTED FOR<br/>LIFESTYLE</h2>
        <div className="crafted-grid">
          {tiles.map((t, i) => (
            <div className={`tile tile-${t.visual}`} key={i} style={{ '--tile-delay': `${i * 90}ms` }}>
              <Visual kind={t.visual} />
              <span className="placeholder-tag mono">{t.tag}</span>
              <div className="tile-stat">
                <span className="tile-stat-num">{t.stat}</span>
                <span className="tile-stat-label mono">{t.statLabel}</span>
              </div>
              <div className="meta">
                <h4>{t.title}</h4>
                <p className="mono">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
