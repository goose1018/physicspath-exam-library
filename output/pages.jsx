/* eslint-disable */
// 物理图解工坊 — 各页面组件 (Landing, Library, Workshop, AI, Modal)

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP, useMemo: useMemoP } = React;

function Icon({ name, size = 14 }) {
  const ref = useRefP(null);
  useEffectP(() => {
    if (window.lucide && ref.current) {
      ref.current.setAttribute('data-lucide', name);
      ref.current.innerHTML = '';
      window.lucide.createIcons({ nameAttr: 'data-lucide' });
    }
  }, [name]);
  return <i ref={ref} data-lucide={name} style={{ width: size, height: size, display: 'inline-flex' }} />;
}

// ─── Top Nav ───
function TopNav({ route, go, credits, onOpenModal }) {
  const items = [
    { id: 'home', label: '首页' },
    { id: 'library', label: '真题图库', primary: true },
    { id: 'workshop', label: '图解工坊' },
    { id: 'ai', label: 'AI 题目转图', soon: true },
  ];
  return (
    <header className="topbar">
      <div className="topbar-l">
        <div className="brand-mark">
          <div className="mark">物</div>
          <div className="name">
            物理图解工坊
            <small>PhysicsPath · Teacher Studio</small>
          </div>
        </div>
        <nav className="nav">
          {items.map(it => {
            const active = route === it.id || (it.id === 'library' && (route === 'paper' || route === 'problem'));
            return (
              <button key={it.id} className={active ? 'on' : ''} onClick={() => go(it.id)}>
                {it.label}
                {it.soon && <span style={{marginLeft:6, fontSize:9.5, fontWeight:700, padding:'1px 5px', borderRadius:4, background:'var(--ppath-amber-50)', color:'var(--ppath-amber-700)', verticalAlign:'1px'}}>SOON</span>}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="topbar-r">
        <button className="credit-pill" onClick={onOpenModal} title="点击查看积分明细">
          <span className="dot"></span>
          <span className="lbl">积分</span>
          <b>{credits}</b>
        </button>
        <button className="btn btn-line btn-sm">
          <Icon name="presentation" size={13} />投屏模式
        </button>
        <div className="user-chip" title="刘老师">刘</div>
      </div>
    </header>
  );
}

// ─── Landing ───
function Landing({ go }) {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="ko">●</span> 高中物理 · 老师专用
            </div>
            <h1>近十年高考物理真题，<em>动态演示轨迹图全收录。</em></h1>
            <p className="lead">
              收录 2016-2025 年全国所有高考物理真题需要画图的题目。
              全国甲乙卷、新高考 I/II 卷、地方卷一网打尽，每一道题都配套动态演示与可调参数。
            </p>
            <div className="hero-cta">
              <button className="btn btn-pri btn-lg" onClick={() => go('library')}>
                进入真题图库 <Icon name="arrow-right" />
              </button>
              <button className="btn btn-line btn-lg" onClick={() => go('workshop')}>
                打开图解工坊
              </button>
            </div>
            <div className="hero-meta">
              <span><b>10</b> 年高考</span>
              <span><b>8</b> 套主流卷型</span>
              <span>每题<b>动态演示</b> · <b>参数可调</b></span>
            </div>
          </div>
          <div className="hero-canvas">
            <div className="toolbar-row">
              <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
              <span className="file-name">projectile-motion.physpath</span>
            </div>
            <div className="frame">
              <span className="frame-tag">2025 新高考 I 卷 · 第 25 题 · 平抛运动</span>
              <svg width="100%" height="100%" viewBox="0 0 600 400" style={{position:'absolute', inset:0}}>
                <line x1="60" y1="60" x2="60" y2="340" stroke="#12352d" strokeWidth="1.5"/>
                <line x1="60" y1="340" x2="540" y2="340" stroke="#12352d" strokeWidth="1.5"/>
                <path d="M 60 60 Q 250 60 540 340" fill="none" stroke="#c2611f" strokeWidth="2" strokeDasharray="4 4"/>
                <circle cx="320" cy="170" r="9" fill="#12352d"/>
                <line x1="320" y1="170" x2="380" y2="170" stroke="#12352d" strokeWidth="1.5"/>
                <line x1="320" y1="170" x2="320" y2="220" stroke="#c2611f" strokeWidth="1.5"/>
                <text x="328" y="200" fill="#c2611f" fontSize="13" fontFamily="JetBrains Mono">vy</text>
                <text x="345" y="164" fill="#12352d" fontSize="13" fontFamily="JetBrains Mono">vx</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="sell">
        <div className="eyebrow">为什么物理老师都在用</div>
        <h2 style={{fontFamily:'var(--ppath-font-display)', fontSize:'34px', fontWeight:900, letterSpacing:'-0.04em', marginTop:'10px', maxWidth:'18ch'}}>
          不是替你讲题。<br/>是把你想画的图，准确地画出来。
        </h2>
        <div className="sell-grid">
          <div className="sell-card">
            <div className="num">01</div>
            <h3>近十年高考画图题·全部在这里</h3>
            <p>2016-2025，全国甲乙、新高考 I/II、上海北京天津浙江卷。需要画图分析的题一道不漏。</p>
            <div className="demo">
              <span style={{color:'#12352d', fontWeight:700}}>10</span> 年 × <span style={{color:'#12352d', fontWeight:700}}>8</span> 套卷 × 几十道题<br/>
              <span style={{color:'#5d6964'}}>考完一道，补上一道</span>
            </div>
          </div>
          <div className="sell-card">
            <div className="num">02</div>
            <h3>题干原文 + 动态轨迹 + 参数可调</h3>
            <p>点进任一道题，左边是题干原文，右边是动态演示，底部可以拖动参数看变化。</p>
            <div className="demo">
              <span style={{color:'#5d6964'}}>v₀ ──●─────────── 15 m/s</span><br/>
              <span style={{color:'#5d6964'}}>h  ●────────────── 20 m</span><br/>
              <span style={{color:'#c2611f'}}>→ 轨迹实时重画</span>
            </div>
          </div>
          <div className="sell-card">
            <div className="num">03</div>
            <h3>人工预连·不走 LLM 生成</h3>
            <p>每一道题都由老师对照标准动画模型预连。课堂上你看到的轨迹 = 高考原题该有的轨迹。</p>
            <div className="demo">
              <span style={{color:'#12352d', fontWeight:700}}>人工预连</span> · 不走 LLM<br/>
              <span style={{color:'#5d6964'}}>课堂上不会出错</span><br/>
              <span style={{color:'#c2611f'}}>AI 题目识别 · <span className="dim">即将上线</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="tprev">
        <div className="tprev-head">
          <div>
            <div className="eyebrow">最近收录 · 抢先看</div>
            <h3 style={{fontSize:'24px', fontWeight:800, letterSpacing:'-0.02em', margin:'8px 0 0'}}>2025 年高考刚出炉的几道画图题</h3>
          </div>
          <button className="btn btn-line" onClick={() => go('library')}>进入真题图库 <Icon name="arrow-right" /></button>
        </div>
        <div className="tprev-grid">
          {[
            { id: '2025-xgk1-25', tplId: 'rod' },
            { id: '2025-xgk1-18', tplId: 'projectile' },
            { id: '2025-bj-22',   tplId: 'lens' },
          ].map(({id, tplId}) => {
            const p = window.PROBLEMS.find(x => x.id === id);
            const paperObj = window.PAPERS.find(pp => pp.id === p.paper);
            return (
              <div key={id} className="tcard" onClick={() => go('problem', { id })}>
                <div className="thumb">
                  <div className="thumb-tags">
                    <span className="tag">{p.year} · {paperObj.short}</span>
                    {p.hasAnim && <span className="tag tag-amber">动态图</span>}
                  </div>
                  <window.TemplateThumb id={tplId} />
                </div>
                <div className="meta">
                  <h4>第 {p.no} 题 · {p.title}</h4>
                  <div className="sub">{p.module} · 难度 {p.diff}</div>
                  <div className="row">
                    <span className="uses">本月查看 {p.heat.toLocaleString()} 次</span>
                    <span className="btn btn-ghost btn-sm">查看原题 <Icon name="arrow-up-right" /></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Library ───
function Library({ go }) {
  const [cat, setCat] = useStateP('all');
  const [q, setQ] = useStateP('');
  const [filter, setFilter] = useStateP('all');

  const list = window.TEMPLATES.filter(t => {
    if (cat !== 'all' && t.cat !== cat) return false;
    if (q && !(t.name + t.types + t.module).toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === 'anim' && !t.anim) return false;
    if (filter === 'free' && t.pro) return false;
    return true;
  });

  const counts = {};
  window.CATEGORIES.forEach(c => {
    counts[c.id] = c.id === 'all' ? window.TEMPLATES.length : window.TEMPLATES.filter(t => t.cat === c.id).length;
  });

  return (
    <div className="page lib">
      <aside className="lib-side">
        <h4>分类</h4>
        {window.CATEGORIES.map(c => (
          <div key={c.id} className={`cat ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
            {c.label}<span>{counts[c.id]}</span>
          </div>
        ))}
        <div className="ggap"></div>
        <h4>属性</h4>
        <div className={`cat ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>全部<span>{window.TEMPLATES.length}</span></div>
        <div className={`cat ${filter === 'anim' ? 'on' : ''}`} onClick={() => setFilter('anim')}>支持动画<span>{window.TEMPLATES.filter(t => t.anim).length}</span></div>
        <div className={`cat ${filter === 'free' ? 'on' : ''}`} onClick={() => setFilter('free')}>免费可用<span>{window.TEMPLATES.filter(t => !t.pro).length}</span></div>
      </aside>

      <main className="lib-main">
        <div style={{marginBottom:'24px'}}>
          <div className="eyebrow">模板库</div>
          <h1 style={{fontSize:'28px', fontWeight:800, letterSpacing:'-0.02em', margin:'10px 0 6px'}}>16 个高考高频物理模型</h1>
          <p className="muted" style={{fontSize:'14px', maxWidth:'58ch'}}>
            按高中物理教材模块分类整理。每一个模板都标注了适用题型、是否支持动画、以及是否需要会员。
            选中后进入图解工坊调参数。
          </p>
        </div>

        <div className="lib-tools">
          <div className="search">
            <Icon name="search" />
            <input placeholder="搜索：平抛、洛伦兹力、凸透镜、读数..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>

        <div className="tcards">
          {list.map(t => (
            <div key={t.id} className="tcard" onClick={() => go('workshop', { templateId: t.id })}>
              <div className="thumb">
                <div className="thumb-tags">
                  <span className="tag">{t.module}</span>
                  {t.anim && <span className="tag tag-amber">动画</span>}
                  {t.pro && <span className="tag tag-pro">会员</span>}
                </div>
                <div className="thumb-tr">
                  <Icon name="flame" size={11} /> {(t.uses / 1000).toFixed(1)}k
                </div>
                <window.TemplateThumb id={t.id} />
              </div>
              <div className="meta">
                <h4>{t.name}</h4>
                <div className="sub">{t.types}</div>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div style={{gridColumn:'1/-1', padding:'48px', textAlign:'center', color:'var(--ppath-fg-3)'}}>
              没找到相关模板。试试更短的关键词，或选择别的分类。
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Workshop ───
function Workshop({ initial, openModal }) {
  const [tplId, setTplId] = useStateP(initial?.templateId || 'projectile');
  const [cat, setCat] = useStateP('all');
  const tpl = window.TEMPLATES.find(t => t.id === tplId) || window.TEMPLATES[0];
  const spec = window.getParamSpec(tplId);
  const [values, setValues] = useStateP(window.getDefaultValues(tplId));
  const [t, setT] = useStateP(0);
  const [playing, setPlaying] = useStateP(true);
  const rafRef = useRefP();
  const lastRef = useRefP();

  useEffectP(() => {
    setValues(window.getDefaultValues(tplId));
    setT(0);
    setPlaying(true);
  }, [tplId]);

  useEffectP(() => {
    if (!playing) { cancelAnimationFrame(rafRef.current); return; }
    const tick = (now) => {
      if (!lastRef.current) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setT(prev => {
        const nx = prev + dt * 0.35;
        return nx > 1.05 ? 0 : nx;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [playing]);

  const setV = (k, v) => setValues(prev => ({ ...prev, [k]: v }));
  const reset = () => { setValues(window.getDefaultValues(tplId)); setT(0); };

  const visibleTpls = window.TEMPLATES.filter(x => cat === 'all' || x.cat === cat);

  // readout — handful of derived values per template
  const readout = useMemoP(() => {
    if (tplId === 'projectile') {
      const T_ = Math.sqrt(2 * values.h / 9.8);
      return [
        ['t', `${(t * T_).toFixed(2)} s`],
        ['x', `${(values.v0 * t * T_).toFixed(1)} m`],
        ['总时间', `${T_.toFixed(2)} s`],
      ];
    }
    if (tplId === 'rod') {
      const E = values.B * values.v * values.L;
      return [['ε', `${E.toFixed(2)} V`], ['I', `${(E/values.R).toFixed(3)} A`], ['P', `${(E*E/values.R).toFixed(2)} W`]];
    }
    if (tplId === 'incline') {
      const a = 9.8 * (Math.sin(values.theta * Math.PI/180) - values.mu * Math.cos(values.theta * Math.PI/180));
      return [['a', `${a.toFixed(2)} m/s²`], ['μ', values.mu.toFixed(2)], ['m', `${values.m} kg`]];
    }
    if (tplId === 'lens') {
      const v = (values.f * values.u) / (values.u - values.f);
      return [['v', isFinite(v) ? `${v.toFixed(1)} cm` : '∞'], ['M', isFinite(v) ? (-v/values.u).toFixed(2) : '—']];
    }
    if (tplId === 'circular') return [['F', `${(values.m * values.omega**2 * values.r).toFixed(2)} N`], ['v', `${(values.omega * values.r).toFixed(2)} m/s`]];
    if (tplId === 'wave') return [['v', `${(values.lambda/values.T).toFixed(2)} m/s`], ['f', `${(1/values.T).toFixed(2)} Hz`]];
    return [['t', t.toFixed(2)]];
  }, [tplId, values, t]);

  return (
    <div className="workshop">
      {/* LEFT: template list */}
      <aside className="ws-left">
        <div className="head">
          <h4>模板库</h4>
          <p>切换不同物理模型 · {visibleTpls.length} 个</p>
        </div>
        <div className="cat-list">
          {window.CATEGORIES.slice(0, 6).map(c => (
            <button key={c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>{c.label}</button>
          ))}
        </div>
        <div className="scroll">
          {visibleTpls.map(it => (
            <div key={it.id} className={`tmpl ${tplId === it.id ? 'on' : ''}`} onClick={() => setTplId(it.id)}>
              <div className="ic"><window.TemplateThumb id={it.id} /></div>
              <div className="info"><b>{it.name}</b><span>{it.types}</span></div>
            </div>
          ))}
        </div>
      </aside>

      {/* MIDDLE: canvas */}
      <section className="ws-canvas">
        <div className="ws-cbar">
          <div className="ws-title">
            <div className="crumb">{spec.crumb} <Icon name="chevron-right" size={11}/> {tpl.name}</div>
            <h2>{tpl.name} <span className="tag tag-soft" style={{marginLeft:8, fontSize:11}}>{tpl.module}</span></h2>
          </div>
          <div className="ws-cbar-r">
            <button className="btn btn-line btn-sm"><Icon name="copy" size={12}/>复制到 PPT</button>
            <button className="btn btn-line btn-sm" onClick={() => openModal('export-png')}><Icon name="image" size={12}/>下载 PNG</button>
            <button className="btn btn-line btn-sm" onClick={() => openModal('export-svg')}><Icon name="file-code" size={12}/>下载 SVG</button>
            <button className="btn btn-pri btn-sm" onClick={() => openModal('export-gif')}><Icon name="film" size={12}/>导出 GIF</button>
          </div>
        </div>

        <div className="ws-stage">
          <div className="grid-bg"></div>
          <window.PhysicsStage id={tplId} params={values} t={t} name={tpl.name} />

          {spec.formula && (
            <div className="ws-formula">
              <div className="lbl">{spec.formula.lbl}</div>
              <div className="eq">{spec.formula.text}</div>
            </div>
          )}

          <div className="ws-readout">
            {readout.map(([k, v], i) => (
              <div key={i} className="row"><span className="k">{k}</span><span className="v">{v}</span></div>
            ))}
          </div>
        </div>

        <div className="ws-trans">
          <button className="play" onClick={() => setPlaying(p => !p)}>
            <Icon name={playing ? 'pause' : 'play'} size={14} />
          </button>
          <button className="ttool" onClick={reset} title="重置">
            <Icon name="rotate-ccw" />
          </button>
          <div className="timeline">
            <div className="timeline-track">
              <div className="timeline-fill" style={{width: `${Math.min(100, t * 100)}%`}}></div>
              <div className="timeline-thumb" style={{left: `${Math.min(100, t * 100)}%`}}></div>
            </div>
            <div className="timeline-meta">
              <span>0.00s</span>
              <span>关键帧 · 起始 / 中段 / 落地</span>
              <span>1.00s</span>
            </div>
          </div>
          <div className="keyframes">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(k => (
              <div key={k} className={`kf ${Math.abs(k - t) < 0.08 ? 'act' : ''}`}></div>
            ))}
          </div>
          <button className="btn btn-line btn-sm" onClick={() => openModal('explain')}>
            <Icon name="sparkles" size={12} /> 生成讲解词
          </button>
        </div>
      </section>

      {/* RIGHT: params */}
      <aside className="ws-right">
        <div className="head">
          <div className="eyebrow">参数面板</div>
          <h3>{tpl.name}</h3>
        </div>
        <div className="scroll">
          {spec.groups.map((g, gi) => (
            <div key={gi} className={gi > 0 ? 'param-group' : ''}>
              <h5>{g.title}</h5>
              {(g.params || []).map(p => (
                <div key={p.key} className="param">
                  <div className="param-row">
                    <label><span>{p.label}</span> <span className="sym">{p.sym}</span></label>
                    <span className="val">{Number(values[p.key]).toFixed(p.step < 1 ? 2 : 0)}{p.unit && ` ${p.unit}`}</span>
                  </div>
                  <input type="range" min={p.min} max={p.max} step={p.step}
                    value={values[p.key]} onChange={e => setV(p.key, parseFloat(e.target.value))} />
                </div>
              ))}
              {(g.toggles || []).map(tg => (
                <div key={tg.key} className="toggle-row">
                  <div>
                    <div>{tg.label}</div>
                    <div className="small">仅影响画布显示，不影响导出</div>
                  </div>
                  <div className={`switch ${values[tg.key] ? 'on' : ''}`} onClick={() => setV(tg.key, !values[tg.key])}></div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="export-row">
          <div className="cost-line">
            <span className="coin">¢</span>
            导出动画 GIF 消耗 <b>5 积分</b> · 当前可用 <b>120</b>
          </div>
          <button className="btn btn-ghost"><Icon name="bookmark" size={12}/>保存到素材库</button>
          <button className="btn btn-pri" onClick={() => openModal('export-gif')}>
            <Icon name="download" size={12}/>导出当前
          </button>
        </div>
      </aside>
    </div>
  );
}

// ─── AI ───
function AIPage() {
  const [text, setText] = useStateP('');
  const [step, setStep] = useStateP('input'); // input | analyzing | result | unknown

  const samples = [
    { lbl: '平抛例题', text: '一物体从离地面 20m 高的平台水平抛出，初速度为 15m/s，求落地时的水平距离与速度方向。（g 取 9.8 m/s²）' },
    { lbl: '导体棒', text: '在水平放置的两条平行光滑导轨上，磁感应强度 B=0.5T 的匀强磁场垂直于导轨平面向下，导轨间距 L=0.8m。一根质量可忽略的导体棒以 v=4m/s 的速度匀速向右运动，外接电阻 R=2Ω，求感应电流。' },
    { lbl: '凸透镜', text: '焦距为 15cm 的凸透镜，物体放在主光轴上距离透镜 30cm 处，求像的位置和性质。' },
  ];

  const analyze = () => {
    setStep('analyzing');
    setTimeout(() => {
      const t = text.toLowerCase();
      if (t.includes('平抛') || t.includes('水平抛出') || t.includes('15m/s')) setStep('result-projectile');
      else if (t.includes('导体棒') || t.includes('磁感应') || t.includes('感应电流')) setStep('result-rod');
      else if (t.includes('凸透镜') || t.includes('焦距')) setStep('result-lens');
      else setStep('unknown');
    }, 1100);
  };

  const renderResult = () => {
    if (step === 'analyzing') {
      return (
        <div className="ai-result empty">
          <Icon name="loader" size={32} />
          <h4>正在识别题型...</h4>
          <p>AI 正在比对题干关键词与已覆盖的高频物理模型。</p>
        </div>
      );
    }
    if (step === 'unknown') {
      return (
        <div className="ai-result">
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span className="tag" style={{background:'var(--ppath-warning-100)', color:'var(--ppath-warning-700)'}}>
              <Icon name="circle-alert" size={11}/> 未在覆盖模型内
            </span>
          </div>
          <p style={{fontSize:13, color:'var(--ppath-fg-2)', lineHeight:1.7, margin:0}}>
            这道题超出了第一版覆盖的 16 个高频模型。我们暂时无法可靠地为它生成动画。
          </p>
          <p style={{fontSize:13, color:'var(--ppath-fg-2)', lineHeight:1.7, margin:0}}>
            你可以：
          </p>
          <ul style={{paddingLeft:18, margin:0, fontSize:13, color:'var(--ppath-fg-2)', lineHeight:1.9}}>
            <li>从模板库中手动选择一个最接近的场景</li>
            <li>把这道题加入 <b>等待覆盖列表</b>，我们会按需求排期</li>
            <li>简化题干后再试一次</li>
          </ul>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button className="btn btn-pri btn-sm">手动选择模板</button>
            <button className="btn btn-line btn-sm">加入等待列表</button>
          </div>
        </div>
      );
    }
    if (step.startsWith('result-')) {
      const map = {
        'result-projectile': { id:'projectile', name:'平抛运动', conf:0.94, kv:[['题型','平抛运动'],['初速度','15 m/s'],['抛出高度','20 m'],['未知量','水平距离 / 落地速度']]},
        'result-rod':        { id:'rod',        name:'导体棒切割磁感线', conf:0.91, kv:[['题型','电磁感应 / 导体棒'],['B','0.5 T'],['L','0.8 m'],['v','4 m/s'],['R','2 Ω'],['未知量','感应电流']]},
        'result-lens':       { id:'lens',       name:'凸透镜成像',     conf:0.97, kv:[['题型','凸透镜成像'],['焦距 f','15 cm'],['物距 u','30 cm'],['未知量','像距 / 像的性质']]},
      };
      const r = map[step];
      return (
        <div className="ai-result">
          <div className="ai-confidence">
            <Icon name="check-circle-2" size={16} />
            <div className="bar"><div style={{width: `${r.conf*100}%`}}></div></div>
            <b>识别置信度 {(r.conf*100).toFixed(0)}%</b>
          </div>
          <div className="ai-template">
            <div className="thumb"><window.TemplateThumb id={r.id} /></div>
            <div style={{flex:1}}>
              <b>推荐模板：{r.name}</b>
              <span>已自动填入下列参数 · 老师可手动修改</span>
            </div>
            <Icon name="chevron-right" size={16} />
          </div>
          <div className="ai-extracted">
            <h5>已识别的关键参数</h5>
            <div className="kv">
              {r.kv.map(([k, v], i) => (
                <React.Fragment key={i}>
                  <span className="k">{k}</span><span className="v">{v}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{display:'flex', gap:8, marginTop:4}}>
            <button className="btn btn-pri" onClick={() => window.__go('workshop', { templateId: r.id })}>
              <Icon name="arrow-right" size={12}/> 用此模板生成
            </button>
            <button className="btn btn-line">换一个模板</button>
          </div>
          <p className="dim" style={{fontSize:11.5, marginTop:6, lineHeight:1.6}}>
            注：AI 识别仅作辅助，第一版仅覆盖 16 个高频模型。建议老师生成后核对参数与题干是否一致。
          </p>
        </div>
      );
    }
    return (
      <div className="ai-result empty">
        <Icon name="sparkles" size={32} />
        <h4>等你输入一道题</h4>
        <p>AI 会识别题型、提取已知参数、推荐合适的动画模板。识别失败时会如实告诉你。</p>
      </div>
    );
  };

  return (
    <div className="ai-wrap">
      <div className="ai-head">
        <div className="eyebrow">AI 题目转图 · Beta</div>
        <h1>把题干贴进来，<br/>看它能不能画出来。</h1>
        <p>仅支持已经覆盖的 16 个高频物理模型。识别不到时，会让你手动选模板，绝不强行生成。</p>
      </div>

      <div className="ai-stage">
        <div className="ai-input">
          <label><Icon name="text-cursor-input" size={13} /> 题目原文</label>
          <textarea
            placeholder={'例：一物体从离地面 20m 高的平台水平抛出，初速度为 15m/s，求...'}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="examples">
            <b>示例：</b>
            {samples.map((s, i) => (
              <button key={i} onClick={() => setText(s.text)}>{s.lbl}</button>
            ))}
          </div>
          <div style={{display:'flex', gap:8, justifyContent:'space-between', alignItems:'center'}}>
            <span className="dim" style={{fontSize:11.5}}>消耗 <b style={{color:'var(--ppath-amber-700)'}}>2 积分</b> · 识别成功才扣</span>
            <button className="btn btn-pri" disabled={!text.trim() || step === 'analyzing'} onClick={analyze}>
              <Icon name="wand-2" size={12}/>识别题型
            </button>
          </div>
        </div>

        {renderResult()}
      </div>
    </div>
  );
}

// ─── Modal: credits / export gating ───
function CreditModal({ kind, onClose, credits, setCredits }) {
  const map = {
    'export-png':   { title: '下载高清 PNG', sub: '导出 1080×720 物理示意图，可直接拖入 PPT 或讲义。', cost: 1, item: 'PNG · 1080×720' },
    'export-svg':   { title: '下载矢量 SVG', sub: '可在 PPT / Keynote 内任意缩放、改色、再编辑。', cost: 2, item: 'SVG · 矢量' },
    'export-gif':   { title: '导出动画 GIF', sub: '保留 60 帧动画，适合做课件循环展示。', cost: 5, item: 'GIF · 60 帧' },
    'explain':      { title: '生成配套讲解词', sub: '基于当前画布与参数，AI 写一段课堂讲解稿（你审核后再用）。', cost: 3, item: '讲解词 · 约 200 字' },
    'credits':      { title: '我的积分', sub: '查看积分明细与会员权益。', cost: 0, item: null },
  };
  const c = map[kind] || map.credits;
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="head">
          <div className="eyebrow">{c.cost > 0 ? '需要消耗积分' : '当前账户'}</div>
          <h3>{c.title}</h3>
          <p>{c.sub}</p>
        </div>
        <div className="body">
          <div className="row"><span className="k">当前积分</span><span className="v">{credits}</span></div>
          <div className="row"><span className="k">本次消耗</span><span className="v warn">{c.item ? `−${c.cost} 积分` : '—'}</span></div>
          <div className="row"><span className="k">本月剩余下载</span><span className="v">28 / 50</span></div>
          <div className="total">
            <span>导出后剩余</span>
            <b>{credits - (c.cost || 0)}</b>
          </div>
        </div>
        <div className="upsell">
          <div className="ic"><Icon name="crown" size={13}/></div>
          <div>
            <h5>升级老师 PRO · ¥39 / 月</h5>
            <p>无限次 PNG / SVG · GIF & MP4 & 讲解词每月 100 次 · 解锁全部 16 个模型</p>
          </div>
        </div>
        <div className="actions">
          {c.cost > 0 ? (
            <button className="btn btn-pri" onClick={() => { setCredits(x => Math.max(0, x - c.cost)); onClose(); }}>
              <Icon name="check" size={12}/>消耗 {c.cost} 积分继续
            </button>
          ) : (
            <button className="btn btn-pri" onClick={onClose}>查看积分明细</button>
          )}
          <button className="btn btn-line" onClick={onClose} style={{justifyContent:'center'}}>
            <Icon name="crown" size={12}/>升级会员（不再消耗积分）
          </button>
          <div className="close-row">
            <button onClick={onClose}>取消</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TopNav, Landing, Library, Workshop, AIPage, CreditModal, Icon });
