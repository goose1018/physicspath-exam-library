/* eslint-disable */
// 物理图解工坊 — 工作台主画布动画 (示意级动画，参数可调)

const { useState, useEffect, useRef } = React;

// shared arrow defs
function Defs() {
  return (
    <defs>
      <marker id="ah-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#12352d" />
      </marker>
      <marker id="ah-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#c2611f" />
      </marker>
      <marker id="ah-grey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#5d6964" />
      </marker>
    </defs>
  );
}

// ─── Projectile (平抛运动) ───
function StageProjectile({ params, t }) {
  const v0 = params.v0;          // m/s
  const h  = params.h;           // m
  const g  = 9.8;
  const T  = Math.sqrt(2 * h / g); // total flight time
  const k = Math.min(1, t);
  const time = T * k;

  // viewport coords
  const ox = 80, oy = 80;
  const W = 720, H = 380;
  const ground = oy + H - 50;
  const scaleX = (W - 100) / (v0 * T + 1);
  const scaleY = (H - 100) / (h + 1);

  const px = ox + v0 * time * scaleX;
  const py = oy + 0.5 * g * time * time * scaleY;

  // trajectory points
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const tt = T * (i / 60);
    pts.push(`${ox + v0 * tt * scaleX},${oy + 0.5 * g * tt * tt * scaleY}`);
  }

  return (
    <svg className="physics" viewBox={`0 0 ${ox + W} ${oy + H}`} preserveAspectRatio="xMidYMid meet">
      <Defs />
      {/* axes */}
      <line x1={ox} y1={oy} x2={ox} y2={ground} stroke="#12352d" strokeWidth="1.5" />
      <line x1={ox} y1={ground} x2={ox + W - 30} y2={ground} stroke="#12352d" strokeWidth="1.5" />
      <text x={ox - 18} y={oy + 12} fill="#5d6964" fontSize="13" fontFamily="JetBrains Mono">y</text>
      <text x={ox + W - 16} y={ground - 8} fill="#5d6964" fontSize="13" fontFamily="JetBrains Mono">x</text>

      {/* ground hatch */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1={ox + 10 + i * 28} y1={ground} x2={ox - 6 + i * 28} y2={ground + 10} stroke="#5d6964" strokeWidth="1" />
      ))}

      {/* height label */}
      <line x1={ox - 14} y1={oy} x2={ox - 14} y2={ground} stroke="#5d6964" strokeWidth="1" strokeDasharray="3 3" />
      <text x={ox - 50} y={(oy + ground) / 2} fill="#5d6964" fontSize="13" fontFamily="JetBrains Mono">h={h}m</text>

      {/* trajectory */}
      <polyline points={pts.slice(0, Math.max(2, Math.floor(60 * k))).join(' ')}
        fill="none" stroke="#c2611f" strokeWidth="2" />
      <polyline points={pts.join(' ')} fill="none" stroke="#eadfce" strokeWidth="1.5" strokeDasharray="3 4" />

      {/* vector decomp at current position */}
      {k > 0.05 && (
        <>
          <line x1={px} y1={py} x2={px + 60} y2={py} stroke="#12352d" strokeWidth="1.5" markerEnd="url(#ah-ink)" />
          <text x={px + 30} y={py - 6} fill="#12352d" fontSize="12" fontFamily="JetBrains Mono">vx</text>
          <line x1={px} y1={py} x2={px} y2={py + Math.min(50, g * time * 5)} stroke="#c2611f" strokeWidth="1.5" markerEnd="url(#ah-amber)" />
          <text x={px + 6} y={py + 30} fill="#c2611f" fontSize="12" fontFamily="JetBrains Mono">vy</text>
        </>
      )}

      {/* initial v0 */}
      <line x1={ox} y1={oy} x2={ox + 50} y2={oy} stroke="#12352d" strokeWidth="2" markerEnd="url(#ah-ink)" />
      <text x={ox + 14} y={oy - 8} fill="#12352d" fontSize="12" fontFamily="JetBrains Mono">v₀={v0}m/s</text>

      {/* particle */}
      <circle cx={px} cy={py} r="9" fill="#12352d" />
      <circle cx={px} cy={py} r="3" fill="#fff" />
    </svg>
  );
}

// ─── Incline (斜面下滑) ───
function StageIncline({ params, t }) {
  const angle = params.theta * Math.PI / 180;
  const mu = params.mu;
  const m = params.m;
  const g = 9.8;
  const aSlide = g * (Math.sin(angle) - mu * Math.cos(angle));

  // geometry
  const ox = 120, oy = 90;
  const baseLen = 600;
  const baseY = oy + 320;
  const rampX = ox + baseLen * Math.cos(angle); // unused
  const top = { x: ox, y: baseY - baseLen * Math.tan(angle) };
  const bottom = { x: ox + baseLen, y: baseY };
  const inclineLen = Math.hypot(bottom.x - top.x, bottom.y - top.y);

  // block position along incline (0 = top, 1 = bottom)
  let posK;
  if (aSlide > 0) {
    const tt = t * 2.0;
    posK = Math.min(1, 0.5 * aSlide * tt * tt / 60); // arbitrary scale
  } else { posK = 0; }
  const bx = top.x + (bottom.x - top.x) * posK;
  const by = top.y + (bottom.y - top.y) * posK;

  // perp offset for block
  const nx = -Math.sin(angle), ny = -Math.cos(angle);

  return (
    <svg className="physics" viewBox="0 0 840 480">
      <Defs />
      {/* ground */}
      <line x1="40" y1={baseY} x2="800" y2={baseY} stroke="#12352d" strokeWidth="1.5" />
      {Array.from({ length: 28 }).map((_, i) => (
        <line key={i} x1={50 + i * 28} y1={baseY} x2={36 + i * 28} y2={baseY + 10} stroke="#5d6964" strokeWidth="1" />
      ))}
      {/* incline triangle */}
      <path d={`M ${top.x} ${top.y} L ${bottom.x} ${bottom.y} L ${top.x} ${baseY} Z`} fill="#f6f2ea" stroke="#12352d" strokeWidth="1.5" />

      {/* angle */}
      <path d={`M ${top.x + 60} ${baseY} A 60 60 0 0 0 ${top.x + 60 * Math.cos(angle)} ${baseY - 60 * Math.sin(angle)}`} fill="none" stroke="#5d6964" strokeWidth="1" />
      <text x={top.x + 70} y={baseY - 8} fill="#5d6964" fontSize="13" fontFamily="JetBrains Mono">θ={params.theta}°</text>

      {/* block (perpendicular to incline) */}
      <g transform={`translate(${bx + nx * 20} ${by + ny * 20}) rotate(${-params.theta})`}>
        <rect x="-22" y="-18" width="44" height="36" rx="4" fill="#12352d" />
        <text x="-12" y="4" fill="#fbfaf7" fontSize="13" fontFamily="JetBrains Mono">{m}kg</text>
      </g>

      {/* gravity vector */}
      <line x1={bx + nx * 20} y1={by + ny * 20} x2={bx + nx * 20} y2={by + ny * 20 + 70} stroke="#c2611f" strokeWidth="1.6" markerEnd="url(#ah-amber)" />
      <text x={bx + nx * 20 + 6} y={by + ny * 20 + 56} fill="#c2611f" fontSize="12" fontFamily="JetBrains Mono">mg</text>

      {/* normal */}
      <line x1={bx + nx * 20} y1={by + ny * 20} x2={bx + nx * 20 + nx * 50} y2={by + ny * 20 + ny * 50} stroke="#12352d" strokeWidth="1.4" markerEnd="url(#ah-ink)" />

      {/* readout */}
      <text x="500" y="60" fill="#5d6964" fontSize="13" fontFamily="JetBrains Mono">a = g(sinθ − μcosθ)</text>
      <text x="500" y="80" fill="#12352d" fontSize="14" fontFamily="JetBrains Mono">a = {aSlide.toFixed(2)} m/s²</text>
    </svg>
  );
}

// ─── Rod cutting field (导体棒切割磁感线) ───
function StageRod({ params, t }) {
  const v = params.v;
  const B = params.B;
  const L = params.L;
  const R = params.R;
  const E = B * v * L;
  const I = E / R;

  const railTop = 130, railBot = 330;
  const minRod = 200, maxRod = 760;
  const rodX = minRod + (maxRod - minRod) * Math.min(1, t);

  return (
    <svg className="physics" viewBox="0 0 880 480">
      <Defs />
      {/* B field dots */}
      {Array.from({ length: 14 }).map((_, i) => (
        <g key={i}>
          {Array.from({ length: 5 }).map((_, j) => (
            <circle key={j} cx={120 + i * 50} cy={150 + j * 40} r="2" fill="#5d6964" />
          ))}
        </g>
      ))}

      {/* rails */}
      <line x1="120" y1={railTop} x2="800" y2={railTop} stroke="#12352d" strokeWidth="3" />
      <line x1="120" y1={railBot} x2="800" y2={railBot} stroke="#12352d" strokeWidth="3" />
      {/* resistor on left */}
      <g transform="translate(120 230)">
        <rect x="-26" y="-18" width="52" height="36" rx="4" fill="#fff" stroke="#12352d" strokeWidth="1.5" />
        <text x="-10" y="4" fill="#12352d" fontSize="12" fontFamily="JetBrains Mono">R</text>
      </g>

      {/* rail brackets */}
      <line x1="120" y1={railTop} x2="120" y2={railBot} stroke="#12352d" strokeWidth="2" />

      {/* moving rod */}
      <line x1={rodX} y1={railTop - 6} x2={rodX} y2={railBot + 6} stroke="#c2611f" strokeWidth="5" />
      <circle cx={rodX} cy={railTop} r="4" fill="#c2611f" />
      <circle cx={rodX} cy={railBot} r="4" fill="#c2611f" />

      {/* velocity arrow */}
      <line x1={rodX} y1={(railTop + railBot) / 2 - 30} x2={rodX + 70} y2={(railTop + railBot) / 2 - 30} stroke="#12352d" strokeWidth="1.8" markerEnd="url(#ah-ink)" />
      <text x={rodX + 24} y={(railTop + railBot) / 2 - 38} fill="#12352d" fontSize="13" fontFamily="JetBrains Mono">v={v}m/s</text>

      {/* L bracket */}
      <text x="80" y="370" fill="#5d6964" fontSize="13" fontFamily="JetBrains Mono">L={L}m</text>
      <text x="160" y="370" fill="#5d6964" fontSize="13" fontFamily="JetBrains Mono">B={B}T</text>

      {/* current arrows on rod */}
      {t > 0.05 && (
        <>
          <line x1={rodX - 14} y1={railTop + 30} x2={rodX - 14} y2={railTop + 60} stroke="#c2611f" strokeWidth="1.4" markerEnd="url(#ah-amber)" />
          <text x={rodX - 50} y={railTop + 50} fill="#c2611f" fontSize="11" fontFamily="JetBrains Mono">I</text>
        </>
      )}

      {/* readout panel */}
      <g transform="translate(560 80)">
        <rect x="0" y="0" width="220" height="74" rx="10" fill="#fff" stroke="#eadfce" />
        <text x="14" y="22" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">ε = BLv</text>
        <text x="14" y="44" fill="#12352d" fontSize="14" fontFamily="JetBrains Mono">ε = {E.toFixed(2)} V</text>
        <text x="14" y="64" fill="#c2611f" fontSize="13" fontFamily="JetBrains Mono">I = {I.toFixed(3)} A</text>
      </g>
    </svg>
  );
}

// ─── Lens (凸透镜成像) ───
function StageLens({ params, t }) {
  const f = params.f;        // focal length cm
  const u = params.u;        // object distance cm
  const v = (f * u) / (u - f); // image distance (1/u + 1/v = 1/f → v = uf/(u-f))
  const M = -v / u;
  const objH = 60;
  const imgH = objH * M;

  const cx = 480, cy = 250;
  const scale = 4;

  const objX = cx - u * scale;
  const imgX = cx + v * scale;

  return (
    <svg className="physics" viewBox="0 0 960 480">
      <Defs />
      {/* axis */}
      <line x1="40" y1={cy} x2="920" y2={cy} stroke="#5d6964" strokeWidth="1" strokeDasharray="2 4" />
      <text x="900" y={cy - 8} fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">主光轴</text>

      {/* lens */}
      <ellipse cx={cx} cy={cy} rx="14" ry="160" fill="rgba(79,140,101,0.18)" stroke="#12352d" strokeWidth="1.5" />
      <line x1={cx - 30} y1={cy - 170} x2={cx - 14} y2={cy - 160} stroke="#12352d" strokeWidth="1.5" />
      <line x1={cx + 30} y1={cy - 170} x2={cx + 14} y2={cy - 160} stroke="#12352d" strokeWidth="1.5" />
      <line x1={cx - 30} y1={cy + 170} x2={cx - 14} y2={cy + 160} stroke="#12352d" strokeWidth="1.5" />
      <line x1={cx + 30} y1={cy + 170} x2={cx + 14} y2={cy + 160} stroke="#12352d" strokeWidth="1.5" />

      {/* focal points */}
      <circle cx={cx - f * scale} cy={cy} r="3" fill="#12352d" />
      <text x={cx - f * scale - 6} y={cy + 18} fill="#5d6964" fontSize="12" fontFamily="JetBrains Mono">F</text>
      <circle cx={cx + f * scale} cy={cy} r="3" fill="#12352d" />
      <text x={cx + f * scale - 6} y={cy + 18} fill="#5d6964" fontSize="12" fontFamily="JetBrains Mono">F'</text>

      {/* object */}
      <line x1={objX} y1={cy} x2={objX} y2={cy - objH} stroke="#12352d" strokeWidth="2.5" markerEnd="url(#ah-ink)" />
      <text x={objX - 30} y={cy - objH - 8} fill="#12352d" fontSize="12" fontFamily="JetBrains Mono">物 u={u}cm</text>

      {/* image (after t > 0.5 to suggest "ray-trace progress") */}
      {t > 0.45 && isFinite(imgX) && Math.abs(imgX) < 1500 && (
        <>
          <line x1={imgX} y1={cy} x2={imgX} y2={cy - imgH} stroke="#c2611f" strokeWidth="2.5"
            markerEnd={imgH > 0 ? "url(#ah-amber)" : "url(#ah-amber)"} />
          <text x={imgX - 12} y={cy + (imgH < 0 ? -imgH + 22 : -imgH - 8)} fill="#c2611f" fontSize="12" fontFamily="JetBrains Mono">像</text>
        </>
      )}

      {/* rays */}
      {t > 0.1 && (
        <>
          {/* ray 1 parallel then through F' */}
          <line x1={objX} y1={cy - objH} x2={cx} y2={cy - objH} stroke="#5d6964" strokeWidth="1" />
          <line x1={cx} y1={cy - objH} x2={imgX} y2={cy - imgH} stroke="#5d6964" strokeWidth="1" />
          {/* ray 2 through center */}
          <line x1={objX} y1={cy - objH} x2={imgX} y2={cy - imgH} stroke="#5d6964" strokeWidth="1" strokeDasharray="3 3" />
        </>
      )}

      {/* readout */}
      <g transform="translate(40 40)">
        <text x="0" y="14" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">1/u + 1/v = 1/f</text>
        <text x="0" y="34" fill="#12352d" fontSize="14" fontFamily="JetBrains Mono">v = {isFinite(v) ? v.toFixed(1) : '∞'} cm</text>
        <text x="0" y="54" fill="#c2611f" fontSize="13" fontFamily="JetBrains Mono">M = {isFinite(M) ? M.toFixed(2) : '—'}</text>
      </g>
    </svg>
  );
}

// ─── Circular ───
function StageCircular({ params, t }) {
  const r = params.r;
  const omega = params.omega;
  const m = params.m;
  const F = m * omega * omega * r;

  const cx = 460, cy = 240;
  const scale = 80;
  const angle = -Math.PI / 2 + omega * t * 4;
  const px = cx + r * scale * Math.cos(angle);
  const py = cy + r * scale * Math.sin(angle);

  return (
    <svg className="physics" viewBox="0 0 920 480">
      <Defs />
      <circle cx={cx} cy={cy} r={r * scale} fill="none" stroke="#5d6964" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx={cx} cy={cy} r="3" fill="#5d6964" />

      {/* radius */}
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="#12352d" strokeWidth="1.4" />
      <text x={(cx + px) / 2 + 6} y={(cy + py) / 2 - 4} fill="#5d6964" fontSize="12" fontFamily="JetBrains Mono">r={r}m</text>

      {/* centripetal force */}
      <line x1={px} y1={py} x2={px - (px - cx) * 0.4} y2={py - (py - cy) * 0.4} stroke="#c2611f" strokeWidth="2" markerEnd="url(#ah-amber)" />

      {/* velocity tangent */}
      <line x1={px} y1={py} x2={px - 70 * Math.sin(angle)} y2={py + 70 * Math.cos(angle)} stroke="#12352d" strokeWidth="1.6" markerEnd="url(#ah-ink)" />

      {/* particle */}
      <circle cx={px} cy={py} r="10" fill="#12352d" />

      <g transform="translate(40 40)">
        <text x="0" y="14" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">F = mω²r</text>
        <text x="0" y="34" fill="#12352d" fontSize="14" fontFamily="JetBrains Mono">F = {F.toFixed(2)} N</text>
        <text x="0" y="54" fill="#c2611f" fontSize="12" fontFamily="JetBrains Mono">ω = {omega.toFixed(1)} rad/s</text>
      </g>
    </svg>
  );
}

// ─── Particle in B field (带电粒子) ───
function StageParticle({ params, t }) {
  const v = params.v;
  const B = params.B;
  const q = 1.6e-19; // const
  const m = 9.1e-31; // const electron-ish
  // r = mv/qB — but use a synthetic visual scaling
  const rVis = 80 + (v / Math.max(0.1, B)) * 0.5;
  const cx = 200 + rVis;
  const cy = 240;

  // entry & circular motion clockwise
  const angle = Math.PI - Math.min(Math.PI * 1.6, t * 3.5);
  const px = cx + rVis * Math.cos(angle);
  const py = cy + rVis * Math.sin(angle);

  return (
    <svg className="physics" viewBox="0 0 920 480">
      <Defs />
      {/* B dots */}
      {Array.from({ length: 16 }).map((_, i) => (
        <g key={i}>
          {Array.from({ length: 8 }).map((_, j) => (
            <circle key={j} cx={60 + i * 50} cy={60 + j * 48} r="1.6" fill="#5d6964" />
          ))}
        </g>
      ))}
      <text x="40" y="40" fill="#5d6964" fontSize="12" fontFamily="JetBrains Mono">B (×) 进入纸面</text>

      {/* circular trail */}
      <path d={`M ${cx - rVis} ${cy} A ${rVis} ${rVis} 0 0 1 ${px} ${py}`} fill="none" stroke="#c2611f" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={rVis} fill="none" stroke="#eadfce" strokeWidth="1" strokeDasharray="3 4" />

      {/* entry velocity */}
      <line x1="80" y1={cy} x2={cx - rVis - 4} y2={cy} stroke="#12352d" strokeWidth="2" markerEnd="url(#ah-ink)" />
      <text x="100" y={cy - 8} fill="#12352d" fontSize="13" fontFamily="JetBrains Mono">v={v}m/s</text>

      {/* particle */}
      <circle cx={px} cy={py} r="9" fill="#12352d" />
      <text x={px + 12} y={py - 8} fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">q⁺</text>

      <g transform="translate(640 60)">
        <text x="0" y="14" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">qvB = mv²/r</text>
        <text x="0" y="34" fill="#12352d" fontSize="14" fontFamily="JetBrains Mono">r = mv/(qB)</text>
        <text x="0" y="54" fill="#c2611f" fontSize="12" fontFamily="JetBrains Mono">B = {B} T</text>
      </g>
    </svg>
  );
}

// ─── Wave ───
function StageWave({ params, t }) {
  const A = params.A;
  const lambda = params.lambda;
  const T = params.T;
  const phase = (t * 4) / T;

  const ox = 80, oy = 240;
  const W = 760;
  const xs = Array.from({ length: 200 }, (_, i) => i * W / 199);
  const k = 2 * Math.PI / (lambda * 60);
  const omega = 2 * Math.PI / T;

  const pts = xs.map(x => {
    const y = A * 60 * Math.sin(k * x - omega * phase);
    return `${ox + x},${oy - y}`;
  });

  return (
    <svg className="physics" viewBox="0 0 920 480">
      <Defs />
      <line x1={ox} y1={oy} x2={ox + W} y2={oy} stroke="#eadfce" strokeWidth="1" />
      <line x1={ox} y1="80" x2={ox} y2="400" stroke="#12352d" strokeWidth="1.5" />
      <text x={ox - 24} y="80" fill="#5d6964" fontSize="12" fontFamily="JetBrains Mono">y</text>
      <polyline points={pts.join(' ')} fill="none" stroke="#12352d" strokeWidth="2.5" />

      {/* highlight one particle */}
      {(() => {
        const x = 240;
        const y = A * 60 * Math.sin(k * x - omega * phase);
        return <circle cx={ox + x} cy={oy - y} r="6" fill="#c2611f" />;
      })()}

      <g transform="translate(620 100)">
        <text x="0" y="14" fill="#5d6964" fontSize="11" fontFamily="JetBrains Mono">y = A sin(kx − ωt)</text>
        <text x="0" y="34" fill="#12352d" fontSize="13" fontFamily="JetBrains Mono">λ = {lambda} m, T = {T} s</text>
        <text x="0" y="54" fill="#c2611f" fontSize="12" fontFamily="JetBrains Mono">v = λ/T = {(lambda/T).toFixed(2)} m/s</text>
      </g>
    </svg>
  );
}

// fallback (用占位说明)
function StagePlaceholder({ name }) {
  return (
    <svg className="physics" viewBox="0 0 920 480">
      <rect x="40" y="40" width="840" height="400" rx="20" fill="#fbfaf7" stroke="#eadfce" strokeDasharray="6 6" />
      <text x="460" y="220" textAnchor="middle" fill="#5d6964" fontSize="16" fontFamily="Noto Sans SC" fontWeight="700">{name}</text>
      <text x="460" y="248" textAnchor="middle" fill="#8a958f" fontSize="13" fontFamily="JetBrains Mono">动画即将上线 · 当前为占位画布</text>
      <text x="460" y="280" textAnchor="middle" fill="#8a958f" fontSize="12" fontFamily="Noto Sans SC">右侧参数面板已就绪，老师可先调试参数</text>
    </svg>
  );
}

const STAGE_BY_ID = {
  projectile: StageProjectile,
  incline: StageIncline,
  rod: StageRod,
  lens: StageLens,
  circular: StageCircular,
  particle: StageParticle,
  wave: StageWave,
};

function PhysicsStage({ id, params, t, name }) {
  const C = STAGE_BY_ID[id];
  if (!C) return <StagePlaceholder name={name} />;
  return <C params={params} t={t} />;
}

Object.assign(window, { PhysicsStage });
