/* eslint-disable */
// 物理图解工坊 — 模板 & 物理动画 SVG (placeholder/示意图)
// 全部组件挂在 window 上，供其他 JSX 文件使用

const TEMPLATES = [
  // 力学
  { id: 'incline',     name: '斜面下滑',         cat: 'mech',  module: '力学',     types: '受力分析 / 摩擦力',     anim: true,  pro: false, uses: 1284, color: '#12352d' },
  { id: 'collide-i',   name: '完全非弹性碰撞',   cat: 'mech',  module: '力学',     types: '动量守恒',             anim: true,  pro: true,  uses: 962  },
  { id: 'pulley',      name: '定滑轮系统',       cat: 'mech',  module: '力学',     types: '连接体 / 受力',        anim: false, pro: false, uses: 745  },
  { id: 'spring',      name: '弹簧振子',         cat: 'mech',  module: '力学',     types: '简谐运动',             anim: true,  pro: false, uses: 588  },

  // 运动学
  { id: 'projectile',  name: '平抛运动',         cat: 'kine',  module: '运动学',   types: '抛体运动',             anim: true,  pro: false, uses: 2410, color: '#c2611f' },
  { id: 'circular',    name: '匀速圆周运动',     cat: 'kine',  module: '运动学',   types: '向心力 / 周期',        anim: true,  pro: false, uses: 1156 },
  { id: 'free-fall',   name: '自由落体',         cat: 'kine',  module: '运动学',   types: '匀加速直线',           anim: true,  pro: false, uses: 904  },

  // 电磁学
  { id: 'rod',         name: '导体棒切割磁感线', cat: 'em',    module: '电磁学',   types: '电磁感应 / 电动势',     anim: true,  pro: true,  uses: 1820, color: '#12352d' },
  { id: 'particle',    name: '带电粒子进入匀强磁场', cat: 'em', module: '电磁学',   types: '洛伦兹力',             anim: true,  pro: true,  uses: 1320 },
  { id: 'efield',      name: '电场加速',         cat: 'em',    module: '电磁学',   types: '动能定理',             anim: true,  pro: false, uses: 712  },
  { id: 'capacitor',   name: '电容器电场',       cat: 'em',    module: '电磁学',   types: '极板 / 电势差',        anim: false, pro: true,  uses: 384  },

  // 光学
  { id: 'lens',        name: '凸透镜成像',       cat: 'opt',   module: '光学',     types: '物距 / 像距',          anim: true,  pro: false, uses: 1602, color: '#c2611f' },
  { id: 'doubleslit',  name: '双缝干涉',         cat: 'opt',   module: '光学',     types: '干涉条纹',             anim: true,  pro: true,  uses: 524  },

  // 振动波动
  { id: 'wave',        name: '机械波传播',       cat: 'wave',  module: '振动波动', types: '横波 / 周期',          anim: true,  pro: false, uses: 690  },

  // 实验
  { id: 'micrometer',  name: '螺旋测微器读数',   cat: 'lab',   module: '实验',     types: '读数 / 误差',          anim: false, pro: false, uses: 845  },
  { id: 'vernier',     name: '游标卡尺读数',     cat: 'lab',   module: '实验',     types: '读数',                anim: false, pro: false, uses: 612  },
];

const CATEGORIES = [
  { id: 'all',   label: '全部模板',   icon: 'layout-grid' },
  { id: 'mech',  label: '力学',       icon: 'box' },
  { id: 'kine',  label: '运动学',     icon: 'move' },
  { id: 'em',    label: '电磁学',     icon: 'zap' },
  { id: 'opt',   label: '光学',       icon: 'sun' },
  { id: 'wave',  label: '振动波动',   icon: 'audio-waveform' },
  { id: 'lab',   label: '实验',       icon: 'ruler' },
];

// ─── Mini thumbnail SVGs (per template) ───
function ThumbProjectile({ t = 0.5 } = {}) {
  // t 0..1 trajectory progress
  const x = 24 + 240 * t;
  const y = 36 + 120 * (t * t);
  const path = "M 24 36 Q 144 36 264 156";
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="0" y1="160" x2="288" y2="160" stroke="#5d6964" strokeWidth="1.5" />
      <line x1="24" y1="0" x2="24" y2="160" stroke="#eadfce" strokeWidth="1" strokeDasharray="3 3" />
      <path d={path} fill="none" stroke="#c2611f" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      <circle cx={x} cy={y} r="6" fill="#12352d" />
      <line x1="24" y1="36" x2="60" y2="36" stroke="#12352d" strokeWidth="1.5" markerEnd="url(#arr)" />
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#12352d" />
        </marker>
      </defs>
      <text x="32" y="30" fill="#5d6964" fontSize="10" fontFamily="JetBrains Mono">v₀</text>
    </svg>
  );
}

function ThumbIncline() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <path d="M 30 150 L 250 150 L 250 70 Z" fill="#eadfce" stroke="#12352d" strokeWidth="1.5" />
      <rect x="170" y="80" width="34" height="22" rx="3" fill="#12352d" transform="rotate(-22 187 91)" />
      <text x="220" y="125" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">θ=30°</text>
      <line x1="187" y1="103" x2="200" y2="135" stroke="#c2611f" strokeWidth="1.5" markerEnd="url(#arr2)" />
      <defs><marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c2611f" /></marker></defs>
    </svg>
  );
}

function ThumbRod() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      {/* rails */}
      <line x1="40" y1="50" x2="250" y2="50" stroke="#12352d" strokeWidth="2" />
      <line x1="40" y1="130" x2="250" y2="130" stroke="#12352d" strokeWidth="2" />
      {/* rod */}
      <line x1="140" y1="42" x2="140" y2="138" stroke="#c2611f" strokeWidth="3.5" />
      {/* B field dots */}
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          {[0,1,2].map(j => (
            <circle key={j} cx={60+i*32} cy={70+j*16} r="1.6" fill="#5d6964" />
          ))}
        </g>
      ))}
      <text x="56" y="170" fill="#5d6964" fontSize="10" fontFamily="JetBrains Mono">B (×)</text>
      <line x1="140" y1="90" x2="180" y2="90" stroke="#12352d" strokeWidth="1.5" markerEnd="url(#arr3)" />
      <defs><marker id="arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#12352d" /></marker></defs>
      <text x="158" y="84" fill="#12352d" fontSize="10" fontFamily="JetBrains Mono">v</text>
    </svg>
  );
}

function ThumbLens() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="20" y1="90" x2="270" y2="90" stroke="#5d6964" strokeWidth="1" strokeDasharray="2 3" />
      {/* lens */}
      <ellipse cx="144" cy="90" rx="14" ry="56" fill="rgba(79,140,101,0.18)" stroke="#12352d" strokeWidth="1.5" />
      {/* object arrow */}
      <line x1="80" y1="90" x2="80" y2="50" stroke="#12352d" strokeWidth="2" markerEnd="url(#arr4)" />
      {/* image arrow (inverted) */}
      <line x1="210" y1="90" x2="210" y2="130" stroke="#c2611f" strokeWidth="2" markerEnd="url(#arr4o)" />
      {/* rays */}
      <line x1="80" y1="50" x2="144" y2="50" stroke="#5d6964" strokeWidth="0.8" />
      <line x1="144" y1="50" x2="210" y2="130" stroke="#5d6964" strokeWidth="0.8" />
      <line x1="80" y1="50" x2="210" y2="130" stroke="#5d6964" strokeWidth="0.8" strokeDasharray="2 2" />
      <defs>
        <marker id="arr4" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 10 L 5 0 L 10 10 z" fill="#12352d" /></marker>
        <marker id="arr4o" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 5 10 L 10 0 z" fill="#c2611f" /></marker>
      </defs>
      <text x="135" y="170" fill="#5d6964" fontSize="10" fontFamily="JetBrains Mono">f=15cm</text>
    </svg>
  );
}

function ThumbCircular() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <circle cx="144" cy="90" r="60" fill="none" stroke="#5d6964" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="144" cy="90" r="2" fill="#5d6964" />
      <line x1="144" y1="90" x2="201" y2="71" stroke="#c2611f" strokeWidth="1.5" markerEnd="url(#arr5)" />
      <circle cx="201" cy="71" r="6" fill="#12352d" />
      <text x="170" y="60" fill="#c2611f" fontSize="11" fontFamily="JetBrains Mono">F=mω²r</text>
      <defs><marker id="arr5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#c2611f" /></marker></defs>
    </svg>
  );
}

function ThumbParticle() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      {[0,1,2,3,4,5,6].map(i => [0,1,2,3].map(j => (
        <circle key={`${i}-${j}`} cx={40+i*36} cy={40+j*32} r="1.5" fill="#5d6964" />
      )))}
      <path d="M 30 50 Q 80 40 130 80 T 230 130" fill="none" stroke="#c2611f" strokeWidth="1.5" />
      <circle cx="230" cy="130" r="5" fill="#12352d" />
      <text x="34" y="170" fill="#5d6964" fontSize="10" fontFamily="JetBrains Mono">B (×)</text>
    </svg>
  );
}

function ThumbWave() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="20" y1="90" x2="270" y2="90" stroke="#eadfce" strokeWidth="1" />
      <path d="M 20 90 Q 50 30 80 90 T 140 90 T 200 90 T 260 90" fill="none" stroke="#12352d" strokeWidth="2" />
      <text x="20" y="170" fill="#5d6964" fontSize="10" fontFamily="JetBrains Mono">λ=2m  T=0.5s</text>
    </svg>
  );
}

function ThumbCollision() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="20" y1="120" x2="268" y2="120" stroke="#5d6964" strokeWidth="1.2" />
      <rect x="80" y="92" width="34" height="28" rx="3" fill="#12352d" />
      <rect x="170" y="92" width="44" height="28" rx="3" fill="#c2611f" />
      <line x1="120" y1="106" x2="158" y2="106" stroke="#5d6964" strokeWidth="1" markerEnd="url(#arr6)" />
      <text x="80" y="80" fill="#12352d" fontSize="10" fontFamily="JetBrains Mono">m₁,v₁</text>
      <text x="170" y="80" fill="#c2611f" fontSize="10" fontFamily="JetBrains Mono">m₂</text>
      <defs><marker id="arr6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5d6964" /></marker></defs>
    </svg>
  );
}

function ThumbSpring() {
  // simple zigzag spring
  const pts = [];
  for (let i = 0; i < 18; i++) pts.push(`${30 + i * 10},${i % 2 ? 70 : 110}`);
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="20" y1="40" x2="20" y2="140" stroke="#12352d" strokeWidth="2" />
      <polyline points={pts.join(' ')} fill="none" stroke="#12352d" strokeWidth="1.5" />
      <rect x="208" y="68" width="36" height="44" rx="3" fill="#c2611f" />
    </svg>
  );
}

function ThumbFreeFall() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="144" y1="20" x2="144" y2="160" stroke="#eadfce" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="144" cy="40" r="5" fill="#12352d" opacity="0.25" />
      <circle cx="144" cy="70" r="5" fill="#12352d" opacity="0.45" />
      <circle cx="144" cy="110" r="5" fill="#12352d" opacity="0.7" />
      <circle cx="144" cy="158" r="6" fill="#12352d" />
      <text x="156" y="100" fill="#5d6964" fontSize="10" fontFamily="JetBrains Mono">g=9.8</text>
    </svg>
  );
}

function ThumbPulley() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="20" y1="36" x2="270" y2="36" stroke="#5d6964" strokeWidth="1.5" />
      <circle cx="144" cy="48" r="14" fill="none" stroke="#12352d" strokeWidth="1.8" />
      <line x1="130" y1="48" x2="130" y2="120" stroke="#12352d" strokeWidth="1.2" />
      <line x1="158" y1="48" x2="158" y2="100" stroke="#12352d" strokeWidth="1.2" />
      <rect x="116" y="120" width="28" height="22" rx="3" fill="#12352d" />
      <rect x="142" y="100" width="32" height="26" rx="3" fill="#c2611f" />
    </svg>
  );
}

function ThumbEfield() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="60" y1="40" x2="60" y2="140" stroke="#12352d" strokeWidth="3" />
      <line x1="220" y1="40" x2="220" y2="140" stroke="#c2611f" strokeWidth="3" />
      <text x="50" y="32" fill="#12352d" fontSize="11" fontFamily="JetBrains Mono">+</text>
      <text x="216" y="32" fill="#c2611f" fontSize="11" fontFamily="JetBrains Mono">−</text>
      {[60, 90, 120].map(y => (
        <line key={y} x1="78" y1={y} x2="200" y2={y} stroke="#5d6964" strokeWidth="0.8" markerEnd="url(#arr7)" />
      ))}
      <circle cx="146" cy="90" r="5" fill="#12352d" />
      <defs><marker id="arr7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5d6964" /></marker></defs>
    </svg>
  );
}

function ThumbCapacitor() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="100" y1="40" x2="100" y2="140" stroke="#12352d" strokeWidth="3" />
      <line x1="188" y1="40" x2="188" y2="140" stroke="#12352d" strokeWidth="3" />
      <text x="60" y="100" fill="#12352d" fontSize="11" fontFamily="JetBrains Mono">+Q</text>
      <text x="200" y="100" fill="#12352d" fontSize="11" fontFamily="JetBrains Mono">−Q</text>
      <line x1="144" y1="40" x2="144" y2="20" stroke="#12352d" strokeWidth="1.5" />
      <text x="148" y="18" fill="#5d6964" fontSize="10" fontFamily="JetBrains Mono">d</text>
    </svg>
  );
}

function ThumbDoubleslit() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <line x1="60" y1="20" x2="60" y2="80" stroke="#12352d" strokeWidth="3" />
      <line x1="60" y1="100" x2="60" y2="160" stroke="#12352d" strokeWidth="3" />
      {[40, 75, 90, 105, 140].map((y, i) => (
        <rect key={i} x="200" y={y - 2} width="40" height={i % 2 ? 4 : 14} fill="#12352d" opacity={i % 2 ? 0.3 : 0.85} />
      ))}
      <line x1="20" y1="90" x2="56" y2="90" stroke="#c2611f" strokeWidth="1.4" />
    </svg>
  );
}

function ThumbMicrometer() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <rect x="40" y="60" width="160" height="60" rx="6" fill="#fff" stroke="#12352d" strokeWidth="1.5" />
      {[60, 90, 120, 150, 180].map(x => (
        <line key={x} x1={x} y1="60" x2={x} y2="80" stroke="#12352d" strokeWidth="1" />
      ))}
      <rect x="200" y="50" width="48" height="80" rx="6" fill="#eadfce" stroke="#12352d" strokeWidth="1.5" />
      {[60, 75, 90, 105, 120].map(y => (
        <line key={y} x1="200" y1={y} x2="218" y2={y} stroke="#12352d" strokeWidth="0.8" />
      ))}
      <text x="140" y="150" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">5.150 mm</text>
    </svg>
  );
}

function ThumbVernier() {
  return (
    <svg viewBox="0 0 288 180" width="100%" height="100%">
      <rect x="0" y="0" width="288" height="180" fill="#fbfaf7" />
      <rect x="20" y="60" width="248" height="22" fill="#fff" stroke="#12352d" strokeWidth="1.5" />
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={30 + i * 22} y1="60" x2={30 + i * 22} y2="74" stroke="#12352d" strokeWidth="1" />
      ))}
      <rect x="100" y="80" width="100" height="22" fill="#eadfce" stroke="#12352d" strokeWidth="1.5" />
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={102 + i * 9.5} y1="80" x2={102 + i * 9.5} y2="94" stroke="#12352d" strokeWidth="0.8" />
      ))}
      <text x="100" y="130" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">2.36 cm</text>
    </svg>
  );
}

const THUMB_BY_ID = {
  projectile: ThumbProjectile,
  incline: ThumbIncline,
  rod: ThumbRod,
  lens: ThumbLens,
  circular: ThumbCircular,
  particle: ThumbParticle,
  wave: ThumbWave,
  'collide-i': ThumbCollision,
  spring: ThumbSpring,
  'free-fall': ThumbFreeFall,
  pulley: ThumbPulley,
  efield: ThumbEfield,
  capacitor: ThumbCapacitor,
  doubleslit: ThumbDoubleslit,
  micrometer: ThumbMicrometer,
  vernier: ThumbVernier,
};

function TemplateThumb({ id }) {
  const T = THUMB_BY_ID[id] || ThumbProjectile;
  return <T />;
}

Object.assign(window, { TEMPLATES, CATEGORIES, TemplateThumb, THUMB_BY_ID });
