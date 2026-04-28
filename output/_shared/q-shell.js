/* ============================================================
   PhysicsPath · Question Page Shell — Common JS
   Exports: window.PathQuestion(opts)
   Each question page provides physics-specific config; shell handles:
   - Topbar, mode toggle (edit ↔ export)
   - Animation loop with t, playing, speed, line width
   - KaTeX rendering for phase formulas + side-card LaTeX
   - PNG composite export (1600×900 with title + canvas + annotation + watermark)
   - GIF export (gif.js with blob-URL worker)
   - WebM export (MediaRecorder)
   - Lucide icon hookup
   ============================================================ */

(function(global){
'use strict';

function el(id){return document.getElementById(id);}

function PathQuestion(opts){
  /* opts: {
       paperTitle, paperHref,    // for back link
       eyebrow,                  // small amber line e.g. "单选 · 第 3 题"
       title,                    // h1
       subtitle,                 // optional para
       deliv: {title, sub},      // inside-canvas-card header
       phases: [                 // 1..N phases
         {
           label: '阶段 1 · 类平抛',
           formula_tex: '\\dfrac{eE}{m}',
           note: '...',
         }, ...
       ],
       evalState: (t)=>({x,y,vx,vy,phase,F:{x,y}|null}),
       drawScene: (ctx, view, state, t, opts)=>void,  // drawing scene into the canvas
       totalT: number,           // total animation duration in physical units
       speedFactor: 0.45,        // dt multiplier
       initialState,             // optional initial state for evalState
       stats: [{label, key, fmt:(state)=>string}],  // right-side live stats
       conclusions: [{label_tex, value_tex, note}], // right-side static formulas
       legend: [{swatch:{bg, border, type:'rect'|'dot'}, text}],
       timeline: [{name, sub}],  // bottom timeline cards
       defaults: {speed:1.0, lineW:3.5, vec:true, guide:true},
       teacherNote: '',          // accompanies stage indicator
     }
  */

  // === CSS framework expects these IDs in HTML ===
  // We'll BUILD the HTML from the opts to make each page tiny.

  const root = el('app') || document.body;
  // Original problem block (题面 + 原图)
  const origBlock = opts.originalProblem ? `
    <div class="orig-card">
      <div class="orig-head">
        <span class="orig-tag">原题</span>
        <span class="orig-meta">${opts.originalProblem.meta || ''}</span>
        <button class="btn orig-toggle" id="origToggle" style="margin-left:auto;font-size:12px;padding:5px 10px"><i data-lucide="chevron-up"></i>收起</button>
      </div>
      <div class="orig-body" id="origBody">
        ${opts.originalProblem.image ? `<div class="orig-fig"><img src="${opts.originalProblem.image}" alt="原题图"></div>` : ''}
        <div class="orig-text">${opts.originalProblem.text || ''}</div>
        ${opts.originalProblem.subQuestions ? `<ol class="orig-sub">${opts.originalProblem.subQuestions.map(q=>`<li>${q}</li>`).join('')}</ol>` : ''}
        ${opts.originalProblem.officialAnswer ? `<div class="orig-ans"><b>官方答案：</b>${opts.originalProblem.officialAnswer}</div>` : ''}
      </div>
    </div>
  ` : '';

  root.innerHTML = `
    <header class="topbar">
      <div>
        <p class="eyebrow">${opts.eyebrow || ''} ${opts.paperHref ? `· <a href="${opts.paperHref}">← 返回 ${opts.paperTitle || '索引'}</a>` : ''}</p>
        <h1>${opts.title}</h1>
        ${opts.subtitle ? `<p class="subtitle">${opts.subtitle}</p>` : ''}
      </div>
      <div class="actions">
        <span class="mode-pill"><span class="dot"></span><span id="modeName">编辑模式</span></span>
        <button class="btn" id="modeBtn"><i data-lucide="external-link"></i>导出预览</button>
        <button class="btn" id="dlPng"><i data-lucide="image"></i>PNG</button>
        <button class="btn" id="dlGif"><i data-lucide="film"></i>GIF</button>
        <button class="btn" id="dlVideo"><i data-lucide="video"></i>WebM</button>
        <button class="btn btn-pri" id="play"><i data-lucide="play"></i>播放</button>
        <button class="btn" id="reset"><i data-lucide="rotate-ccw"></i>重置</button>
      </div>
    </header>

    <div class="layout${opts.originalProblem ? '' : ' no-orig'}">
      ${origBlock}
      <main class="stage-card">
        <div class="deliverable">
          <div class="deliv-head">
            <div>
              <div class="deliv-title">${opts.deliv?.title || opts.title}</div>
              ${opts.deliv?.sub ? `<div class="deliv-sub">${opts.deliv.sub}</div>` : ''}
            </div>
            <div class="phase-pill" id="phasePill">${opts.phases?.[0]?.label || ''}</div>
          </div>
          <div class="canvas-wrap">
            <canvas id="cv"></canvas>
            <div class="canvas-badge">16:9 · 讲义动画 · 可投屏</div>
            <div class="watermark"><b>PhysicsPath</b> · 高考物理动态图</div>
          </div>
          ${opts.phases ? `
          <div class="annot">
            <div class="annot-bar"></div>
            <div class="annot-body">
              <span class="annot-stage" id="annotStage">${opts.phases[0]?.label_short || opts.phases[0]?.label || ''}</span>
              <div class="annot-formula" id="annotFormula"></div>
              <div class="annot-note" id="annotNote">${opts.phases[0]?.note || ''}</div>
            </div>
          </div>` : ''}
        </div>
      </main>

      <aside class="side-panel">
        <div class="side-card">
          <h2>编辑工具</h2>
          <div class="control-row">
            <span>速度</span>
            <input id="speed" type="range" min="0.2" max="2.5" step="0.1" value="${opts.defaults?.speed||1.0}">
            <span class="control-value" id="speedV">${(opts.defaults?.speed||1.0).toFixed(1)}×</span>
          </div>
          <div class="control-row">
            <span>线宽</span>
            <input id="lineW" type="range" min="1.5" max="6" step="0.1" value="${opts.defaults?.lineW||3.5}">
            <span class="control-value" id="lineWV">${(opts.defaults?.lineW||3.5).toFixed(1)}</span>
          </div>
          <div class="toggle-line">
            <span>速度/受力矢量</span>
            <button class="switch ${opts.defaults?.vec===false?'off':''}" id="vecSw"></button>
          </div>
          <div class="toggle-line">
            <span>参考虚线</span>
            <button class="switch ${opts.defaults?.guide===false?'off':''}" id="guideSw"></button>
          </div>
        </div>

        ${opts.stats ? `
        <div class="side-card">
          <h2>实时数值</h2>
          <div class="stats">
            ${opts.stats.map((s,i)=>`<div class="stat"><span>${s.label}</span><span id="stat_${i}">—</span></div>`).join('')}
          </div>
        </div>` : ''}

        ${opts.conclusions ? `
        <div class="side-card">
          <h2>结论</h2>
          <div class="stats">
            ${opts.conclusions.map((c,i)=>`<div class="stat"><span id="conc_l_${i}">${c.label_text||c.label_tex||''}</span><span id="conc_v_${i}">${c.value_text||c.value_tex||''}</span></div>`).join('')}
          </div>
        </div>` : ''}

        ${opts.legend ? `
        <div class="side-card">
          <h2>图例</h2>
          <div class="legend-list">
            ${opts.legend.map(l=>{
              const sw = l.swatch || {};
              const dot = sw.type==='dot';
              return `<div class="legend-item"><div class="legend-sw" style="background:${sw.bg};border-color:${sw.border};${dot?'border-radius:50%;width:12px;height:12px':''}"></div>${l.text}</div>`;
            }).join('')}
          </div>
        </div>` : ''}
      </aside>
    </div>

    ${opts.timeline ? `
    <div class="timeline-card">
      <div class="timeline">
        ${opts.timeline.map((t,i)=>`<div class="step-card${i===0?' active':''}" id="st${i+1}">
          <div class="step-num">${i+1}</div><b>${t.name}</b><span>${t.sub||''}</span>
        </div>`).join('')}
      </div>
    </div>` : ''}
  `;

  if(global.lucide) lucide.createIcons();

  // 原题折叠按钮
  const ot = el('origToggle');
  if(ot){
    ot.onclick = () => {
      const body = el('origBody');
      const collapsed = body.style.display === 'none';
      body.style.display = collapsed ? '' : 'none';
      ot.innerHTML = collapsed ? '<i data-lucide="chevron-up"></i>收起' : '<i data-lucide="chevron-down"></i>展开原题';
      if(global.lucide) lucide.createIcons();
    };
  }

  // ─── State ───
  const cv = el('cv');
  const ctx = cv.getContext('2d');
  const dpr = Math.max(1, devicePixelRatio||1);
  let t = 0, playing = false, last = 0;
  let speedMul = opts.defaults?.speed || 1.0;
  let lineW = opts.defaults?.lineW || 3.5;
  let showVec = opts.defaults?.vec !== false;
  let showGuide = opts.defaults?.guide !== false;
  let lastPhase = -1;
  const speedFactor = opts.speedFactor || 0.45;

  const view = {ox:0, oy:0, scale:1, w:0, h:0};
  function fit(){
    const r = cv.getBoundingClientRect();
    cv.width = r.width*dpr; cv.height = r.height*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    view.w = r.width; view.h = r.height;
    if(opts.viewBox){
      const {xmin,xmax,ymin,ymax} = opts.viewBox;
      const sx = view.w/(xmax-xmin), sy = view.h/(ymax-ymin);
      view.scale = Math.min(sx,sy);
      view.ox = -xmin*view.scale + (view.w-(xmax-xmin)*view.scale)/2;
      view.oy = ymax*view.scale + (view.h-(ymax-ymin)*view.scale)/2;
    }
  }
  view.X = x => view.ox + x*view.scale;
  view.Y = y => view.oy - y*view.scale;
  view.toScreen = (x,y) => ({x:view.X(x), y:view.Y(y)});

  // ─── Render frame ───
  function frame(now){
    if(!last) last = now;
    const dt = (now-last)/1000; last = now;
    if(playing){
      t += dt * speedMul * speedFactor;
      if(t >= opts.totalT){
        t = opts.totalT;
        playing = false;
        updatePlayBtn();
      }
    }

    fit();
    // Cream paper fill (so video/GIF capture has proper bg)
    ctx.fillStyle = '#fffdf9';
    ctx.fillRect(0, 0, view.w, view.h);

    const state = opts.evalState ? opts.evalState(t) : {phase:1};

    opts.drawScene(ctx, view, state, t, {showVec, showGuide, lineW, opts});

    // Update HUD
    if(opts.stats){
      opts.stats.forEach((s,i) => {
        const elx = el('stat_'+i);
        if(elx) elx.textContent = s.fmt(state, t);
      });
    }

    // Phase pill / annot / timeline
    const ph = state.phase || 1;
    if(opts.phases && lastPhase !== ph){
      lastPhase = ph;
      const p = opts.phases[ph-1];
      if(p){
        el('phasePill').textContent = p.label;
        const stEl = el('annotStage');
        if(stEl) stEl.textContent = p.label_short || p.label;
        const noteEl = el('annotNote');
        if(noteEl) noteEl.textContent = p.note;
        const fEl = el('annotFormula');
        if(fEl){
          if(global.katex && p.formula_tex){
            try { katex.render(p.formula_tex, fEl, {throwOnError:false, displayMode:false, output:'html'}); }
            catch(e){ fEl.textContent = p.formula_tex; }
          } else if(p.formula_text){
            fEl.textContent = p.formula_text;
          }
        }
      }
      if(opts.timeline){
        opts.timeline.forEach((_,i) => {
          const stEl = el('st'+(i+1));
          if(stEl) stEl.classList.toggle('active', i+1===ph);
        });
      }
    }

    requestAnimationFrame(frame);
  }

  // ─── Controls ───
  function updatePlayBtn(){
    const btn = el('play');
    btn.innerHTML = playing
      ? '<i data-lucide="pause"></i>暂停'
      : '<i data-lucide="play"></i>' + (t>=opts.totalT?'重播':'播放');
    if(global.lucide) lucide.createIcons();
  }

  el('play').onclick = () => {
    if(t >= opts.totalT) t = 0;
    playing = !playing;
    updatePlayBtn();
  };
  el('reset').onclick = () => {
    t = 0; playing = false; lastPhase = -1;
    updatePlayBtn();
  };
  el('speed').oninput = e => {
    speedMul = parseFloat(e.target.value);
    el('speedV').textContent = speedMul.toFixed(1)+'×';
  };
  el('lineW').oninput = e => {
    lineW = parseFloat(e.target.value);
    el('lineWV').textContent = lineW.toFixed(1);
  };
  el('vecSw').onclick = e => { showVec = !showVec; e.target.classList.toggle('off', !showVec); };
  el('guideSw').onclick = e => { showGuide = !showGuide; e.target.classList.toggle('off', !showGuide); };
  el('modeBtn').onclick = () => {
    const isExport = document.body.classList.toggle('export-mode');
    el('modeName').textContent = isExport ? '导出预览' : '编辑模式';
    el('modeBtn').innerHTML = isExport
      ? '<i data-lucide="x"></i>退出预览'
      : '<i data-lucide="external-link"></i>导出预览';
    if(global.lucide) lucide.createIcons();
    setTimeout(fit, 320);
  };

  // ─── Static LaTeX ───
  function renderStaticTeX(){
    if(!global.katex || !opts.conclusions) return;
    opts.conclusions.forEach((c,i)=>{
      if(c.label_tex){
        try { katex.render(c.label_tex, el('conc_l_'+i), {throwOnError:false, displayMode:false, output:'html'}); }catch(e){}
      }
      if(c.value_tex){
        try { katex.render(c.value_tex, el('conc_v_'+i), {throwOnError:false, displayMode:false, output:'html'}); }catch(e){}
      }
    });
  }
  if(global.katex) renderStaticTeX();
  else window.addEventListener('load', renderStaticTeX);

  // ─── PNG composite export ───
  el('dlPng').onclick = () => {
    const w = 1600, h = 900;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const o = off.getContext('2d');
    o.fillStyle = '#fbfaf7'; o.fillRect(0,0,w,h);
    // Title
    o.fillStyle = '#12352d';
    o.font = '900 36px "PingFang SC","Noto Serif SC",serif';
    o.fillText(opts.deliv?.title || opts.title, 60, 70);
    if(opts.deliv?.sub){
      o.fillStyle = '#5d6964';
      o.font = '500 16px "PingFang SC",sans-serif';
      o.fillText(opts.deliv.sub, 60, 100);
    }
    // Phase pill
    const pillTxt = el('phasePill').textContent;
    o.font = '900 14px "PingFang SC",sans-serif';
    const pw = o.measureText(pillTxt).width + 26;
    o.fillStyle = '#fdf3e6';
    if(o.roundRect){o.beginPath();o.roundRect(w-60-pw,50,pw,32,16);o.fill();}
    else o.fillRect(w-60-pw,50,pw,32);
    o.fillStyle = '#a85219';
    o.fillText(pillTxt, w-60-pw+13, 71);
    // Main canvas
    const mx=60, my=130, mw=w-120, mh=560;
    o.fillStyle = '#fffdf9';
    if(o.roundRect){o.beginPath();o.roundRect(mx,my,mw,mh,16);o.fill();}
    else o.fillRect(mx,my,mw,mh);
    o.strokeStyle = '#eadfce'; o.lineWidth = 1; o.stroke();
    o.save();
    if(o.roundRect){o.beginPath();o.roundRect(mx,my,mw,mh,16);o.clip();}
    o.drawImage(cv, mx, my, mw, mh);
    o.restore();
    // Watermark
    o.fillStyle = '#94a09b';
    o.font = '700 12px ui-monospace,monospace';
    o.fillText('PhysicsPath · 高考物理动态图', mx+mw-260, my+mh-16);
    // Annotation
    const ay = my + mh + 24;
    o.fillStyle = '#c2611f';
    o.fillRect(60, ay, 6, 90);
    o.font = '900 12px "PingFang SC",sans-serif';
    o.fillText(el('annotStage')?.textContent || '', 78, ay+18);
    o.fillStyle = '#12352d';
    o.font = '700 21px "Cambria Math","Times New Roman",serif';
    o.fillText(el('annotFormula')?.textContent || '', 78, ay+50);
    o.fillStyle = '#5d6964';
    o.font = '500 14px "PingFang SC",sans-serif';
    o.fillText(el('annotNote')?.textContent || '', 78, ay+78);
    // Download
    const link = document.createElement('a');
    link.download = (opts.fileName || opts.title) + '.png';
    link.href = off.toDataURL('image/png');
    document.body.appendChild(link); link.click(); link.remove();
  };

  // ─── GIF export ───
  let recording = false;
  el('dlGif').onclick = async () => {
    if(recording) return;
    if(!global.GIF){ alert('GIF 库未加载，稍候再试。'); return; }
    recording = true;
    const btn = el('dlGif');
    const orig = btn.innerHTML;
    btn.classList.add('recording');

    const saved = {speedMul, lineW, showVec, showGuide};
    speedMul = 1.0; lineW = 3.5; showVec = true; showGuide = true;
    el('speed').value=1.0; el('lineW').value=3.5; el('vecSw').classList.remove('off'); el('guideSw').classList.remove('off');
    el('speedV').textContent='1.0×'; el('lineWV').textContent='3.5';

    btn.innerHTML = '加载…';
    let workerBlobUrl;
    try{
      const src = await fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js').then(r=>r.text());
      workerBlobUrl = URL.createObjectURL(new Blob([src],{type:'application/javascript'}));
    }catch(e){
      alert('GIF worker 加载失败。');
      btn.innerHTML = orig; btn.classList.remove('recording'); recording=false; return;
    }
    const gif = new GIF({workers:2, quality:8, workerScript:workerBlobUrl, background:'#fffdf9'});
    t = 0; playing = true; lastPhase = -1; updatePlayBtn();
    btn.innerHTML = '采集 0%';
    const fps = 15, interval = 1000/fps;
    let lastCap = performance.now();

    await new Promise(resolve => {
      function tick(){
        const now = performance.now();
        if(now - lastCap >= interval){
          gif.addFrame(cv, {copy:true, delay:interval});
          lastCap = now;
          btn.innerHTML = '采集 ' + Math.min(99, Math.floor(t/opts.totalT*100)) + '%';
        }
        if(t >= opts.totalT - 0.001){
          gif.addFrame(cv, {copy:true, delay:800});
          resolve(); return;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    btn.innerHTML = '编码 0%';
    gif.on('progress', p => btn.innerHTML = '编码 '+Math.floor(p*100)+'%');
    gif.on('finished', blob => {
      const link = document.createElement('a');
      link.download = (opts.fileName || opts.title) + '.gif';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(()=>URL.revokeObjectURL(link.href), 2000);
      speedMul = saved.speedMul; lineW = saved.lineW; showVec = saved.showVec; showGuide = saved.showGuide;
      btn.innerHTML = orig; btn.classList.remove('recording'); recording = false;
    });
    gif.render();
  };

  // ─── WebM export ───
  el('dlVideo').onclick = async () => {
    if(recording) return;
    if(!cv.captureStream || typeof MediaRecorder==='undefined'){
      alert('当前浏览器不支持视频录制，请用 Chrome / Edge。');
      return;
    }
    recording = true;
    const btn = el('dlVideo');
    const orig = btn.innerHTML;
    btn.classList.add('recording');

    const saved = {speedMul, lineW, showVec, showGuide};
    speedMul = 1.0; lineW = 3.5; showVec = true; showGuide = true;
    el('speed').value=1.0; el('lineW').value=3.5;
    el('speedV').textContent='1.0×'; el('lineWV').textContent='3.5';

    const mimeOpts = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
    const mime = mimeOpts.find(m => MediaRecorder.isTypeSupported(m)) || '';
    const stream = cv.captureStream(30);
    const chunks = [];
    const rec = new MediaRecorder(stream, {mimeType:mime, videoBitsPerSecond:6_000_000});
    rec.ondataavailable = e => { if(e.data&&e.data.size>0) chunks.push(e.data); };

    await new Promise(resolve => {
      rec.onstop = resolve;
      t = 0; playing = true; lastPhase = -1; updatePlayBtn();
      btn.innerHTML = '录制 0%';
      rec.start(100);
      const t0 = performance.now();
      function tick(){
        btn.innerHTML = '录制 ' + Math.min(99, Math.floor(t/opts.totalT*100)) + '%';
        if(t >= opts.totalT - 0.001){
          setTimeout(()=>{try{rec.stop();}catch(e){}}, 600);
          return;
        }
        if((performance.now()-t0)/1000 > 30){try{rec.stop();}catch(e){} return;}
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    btn.innerHTML = '编码…';
    const blob = new Blob(chunks, {type: mime||'video/webm'});
    const link = document.createElement('a');
    link.download = (opts.fileName || opts.title) + '.webm';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(()=>URL.revokeObjectURL(link.href), 2000);
    speedMul = saved.speedMul; lineW = saved.lineW; showVec = saved.showVec; showGuide = saved.showGuide;
    btn.innerHTML = orig; btn.classList.remove('recording'); recording = false;
  };

  window.addEventListener('resize', fit);
  fit();
  updatePlayBtn();
  requestAnimationFrame(frame);

  // expose for debugging
  return { get t(){return t;}, set t(v){t=v;}, get playing(){return playing;}, view, ctx };
}

global.PathQuestion = PathQuestion;

/* ===== Drawing helpers (shared utility belt) ===== */

global.PPath = {
  // Unified key-point label (anchor + leader + white-bg framed text)
  label(ctx, px, py, text, sub, leader){
    const lx = px + leader.dx;
    const ly = py + leader.dy;
    ctx.strokeStyle = 'rgba(18,53,45,.32)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(lx, ly); ctx.stroke();
    ctx.fillStyle = '#c2611f';
    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.font = '800 12px "Noto Sans SC",sans-serif';
    const wMain = ctx.measureText(text).width;
    ctx.font = '500 11px "Cambria Math",Georgia,serif';
    const wSub = sub ? ctx.measureText(sub).width : 0;
    const padX = 7, gap = sub ? 5 : 0;
    const totalW = wMain + (sub?gap+wSub:0) + padX*2;
    const totalH = 18;
    const bx = lx - (leader.dx<0 ? totalW : 0);
    const by = ly - totalH/2;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(18,53,45,.18)'; ctx.lineWidth = 1;
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(bx, by, totalW, totalH, 5);
    else ctx.rect(bx, by, totalW, totalH);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#12352d';
    ctx.font = '800 12px "Noto Sans SC",sans-serif';
    ctx.fillText(text, bx+padX, by+totalH/2+4);
    if(sub){
      ctx.fillStyle = '#5d6964';
      ctx.font = '500 11px "Cambria Math",Georgia,serif';
      ctx.fillText(sub, bx+padX+wMain+gap, by+totalH/2+4);
    }
  },

  // Arrow with arrowhead
  arrow(ctx, x1, y1, x2, y2, color, lw){
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw||2;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    const a = Math.atan2(y2-y1, x2-x1);
    ctx.beginPath();
    ctx.moveTo(x2,y2);
    ctx.lineTo(x2-9*Math.cos(a-.32), y2-9*Math.sin(a-.32));
    ctx.lineTo(x2-9*Math.cos(a+.32), y2-9*Math.sin(a+.32));
    ctx.closePath(); ctx.fill();
  },

  // xy axes with labels
  axes(ctx, view, opts){
    const o = opts || {};
    const xMin = o.xMin ?? -0.16, xMax = o.xMax ?? 1.18, yMin = o.yMin ?? -0.16, yMax = o.yMax ?? 0.32;
    const X = view.X, Y = view.Y;
    ctx.strokeStyle = '#86868b'; ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(X(xMin), Y(0)); ctx.lineTo(X(xMax), Y(0));
    ctx.moveTo(X(0), Y(yMin)); ctx.lineTo(X(0), Y(yMax));
    ctx.stroke();
    PPath.arrow(ctx, X(xMax-(xMax-xMin)*.04), Y(0), X(xMax), Y(0), '#86868b', 1);
    PPath.arrow(ctx, X(0), Y(yMax-(yMax-yMin)*.05), X(0), Y(yMax), '#86868b', 1);
    ctx.fillStyle = '#1d1d1f';
    ctx.font = 'italic 700 17px "Cambria Math",Georgia,serif';
    ctx.fillText(o.xLabel||'x', X(xMax)+8, Y(0)+6);
    ctx.fillText(o.yLabel||'y', X(0)-4, Y(yMax)-8);
    ctx.font = 'italic 600 13px Georgia,serif';
    ctx.fillStyle = '#5d6964';
    if(o.showOrigin!==false) ctx.fillText('O', X(0)-14, Y(0)+18);
  },

  // Field region (rectangle + dashed border + label)
  fieldRect(ctx, view, x0, y0, x1, y1, fill, stroke, label){
    const X = view.X, Y = view.Y;
    ctx.fillStyle = fill;
    ctx.fillRect(X(x0), Y(y1), X(x1)-X(x0), Y(y0)-Y(y1));
    if(stroke){
      ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
      ctx.strokeRect(X(x0)+.5, Y(y1)+.5, X(x1)-X(x0)-1, Y(y0)-Y(y1)-1);
      ctx.setLineDash([]);
    }
    if(label){
      ctx.fillStyle = stroke || fill;
      ctx.font = '700 12px "Noto Sans SC",sans-serif';
      ctx.fillText(label.text, X(label.x), Y(label.y));
    }
  }
};

})(window);
