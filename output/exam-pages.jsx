/* eslint-disable */
// 高考真题图库 — 三个页面：真题图库（年份+地区双搜索 + 分组陈列）、卷详情、题详情

const { useState: useStateE, useMemo: useMemoE, useRef: useRefE, useEffect: useEffectE } = React;

// ─────────────────────── ExamLibrary (dual search + grouped grid) ───────────────────────
const EXAM_LIB_STATE_KEY = 'pp_examlibrary_state';
function loadExamLibState() {
  try { const s = sessionStorage.getItem(EXAM_LIB_STATE_KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
}
function saveExamLibState(state) {
  try { sessionStorage.setItem(EXAM_LIB_STATE_KEY, JSON.stringify(state)); } catch {}
}

function ExamLibrary({ go }) {
  const _saved = loadExamLibState();
  const [year, setYear] = useStateE(() => _saved?.year ?? 'all');   // 'all' | number
  const [region, setRegion] = useStateE(() => _saved?.region ?? 'all'); // 'all' | paper.id
  const [yearOpen, setYearOpen] = useStateE(false);
  const [regionOpen, setRegionOpen] = useStateE(false);
  const [page, setPage] = useStateE(() => _saved?.page ?? 0);

  // group by year — show one year per page (paginated)
  const yearsAll = year === 'all' ? window.YEARS : [year];
  const papersToShow = region === 'all' ? window.PAPERS : window.PAPERS.filter(p => p.id === region);
  const totalPages = yearsAll.length;
  const curIdx = Math.min(page, Math.max(0, totalPages - 1));
  const yearsToShow = totalPages > 0 ? [yearsAll[curIdx]] : [];

  // 持久化 year/region/page（返回此页时恢复）
  useEffectE(() => { saveExamLibState({ year, region, page }); }, [year, region, page]);

  // year/region 变化时重置 page，但跳过初次 mount（避免覆盖恢复的 page）
  const _mounted = useRefE(false);
  useEffectE(() => {
    if (_mounted.current) setPage(0);
    else _mounted.current = true;
  }, [year, region]);

  // 键盘左右箭头翻页（无输入框聚焦时）
  useEffectE(() => {
    const onKey = (e) => {
      if (totalPages <= 1) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
      if (e.key === 'ArrowLeft' && curIdx > 0) { setPage(curIdx - 1); }
      else if (e.key === 'ArrowRight' && curIdx < totalPages - 1) { setPage(curIdx + 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [curIdx, totalPages]);

  return (
    <div className="exam-page" data-screen-label="02 真题图库">
      <div style={{marginBottom: 32}}>
        <div className="eyebrow"><span style={{color:'var(--ppath-amber-700)'}}>●</span> 真题图库</div>
        <h1 style={{fontFamily:'var(--ppath-font-display)', fontSize:36, fontWeight:900, letterSpacing:'-0.04em', lineHeight:1.15, margin:'10px 0 8px'}}>
          找到任意一道高考画图题
        </h1>
        <p style={{fontSize:14, color:'var(--ppath-fg-2)', maxWidth:'58ch', lineHeight:1.7, margin:0}}>
          按年份和地区两个维度筛选。不选条件时，下方默认按年份倒序，每年所有卷型横向罗列。
        </p>
      </div>

      {/* 双搜索栏 */}
      <div className="el-search">
        <div className="el-field">
          <label>年份</label>
          <button className="el-pick" onClick={() => { setYearOpen(o => !o); setRegionOpen(false); }}>
            <window.Icon name="calendar" size={14} />
            <span>{year === 'all' ? '全部年份' : `${year} 年`}</span>
            <window.Icon name="chevron-down" size={14} />
          </button>
          {yearOpen && (
            <div className="el-pop">
              <div className={`el-opt ${year === 'all' ? 'on' : ''}`} onClick={() => { setYear('all'); setYearOpen(false); }}>
                全部年份 <span>{window.YEARS.length} 年</span>
              </div>
              {window.YEARS.map(y => (
                <div key={y} className={`el-opt ${year === y ? 'on' : ''}`} onClick={() => { setYear(y); setYearOpen(false); }}>
                  {y} 年
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="el-field">
          <label>地区 / 卷型</label>
          <button className="el-pick" onClick={() => { setRegionOpen(o => !o); setYearOpen(false); }}>
            <window.Icon name="map-pin" size={14} />
            <span>{region === 'all' ? '全部地区' : window.PAPERS.find(p => p.id === region).name}</span>
            <window.Icon name="chevron-down" size={14} />
          </button>
          {regionOpen && (
            <div className="el-pop">
              <div className={`el-opt ${region === 'all' ? 'on' : ''}`} onClick={() => { setRegion('all'); setRegionOpen(false); }}>
                全部地区 <span>{window.PAPERS.length} 套</span>
              </div>
              <div className="el-opt-group">全国卷</div>
              {window.PAPERS.filter(p => p.tier === 'core').map(p => (
                <div key={p.id} className={`el-opt ${region === p.id ? 'on' : ''}`} onClick={() => { setRegion(p.id); setRegionOpen(false); }}>
                  {p.name}
                </div>
              ))}
              <div className="el-opt-group">地方卷</div>
              {window.PAPERS.filter(p => p.tier === 'local').map(p => (
                <div key={p.id} className={`el-opt ${region === p.id ? 'on' : ''}`} onClick={() => { setRegion(p.id); setRegionOpen(false); }}>
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{flex:1}}></div>
        {(year !== 'all' || region !== 'all') && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setYear('all'); setRegion('all'); }}>
            <window.Icon name="x" size={12}/>清空筛选
          </button>
        )}
      </div>

      {/* 默认按年份分组陈列 — 一年一页 */}
      <div className="el-groups">
        {yearsToShow.map(y => (
          <div key={y} className="el-group">
            <div className="el-yhead">
              <h3>{y}</h3>
              <span>高考 · 物理</span>
              <div style={{flex:1, height:1, background:'var(--ppath-line)', marginLeft:14}}></div>
              <span style={{fontSize:'12px', color:'var(--ppath-fg-3)'}}>{papersToShow.length} 套</span>
            </div>
            <div className="el-pgrid">
              {papersToShow.map(p => (
                <div key={p.id} className="el-pcard" onClick={() => go('paper', { year: y, paper: p.id })}>
                  <div className="el-pthumb">
                    <window.PaperThumb year={y} paper={p} />
                  </div>
                  <div className="el-pbody">
                    <div className="el-pmark">
                      <span className="el-region">{p.region}</span>
                      <span className="el-tier">{p.tier === 'core' ? '全国卷' : '地方卷'}</span>
                    </div>
                    <div className="el-pname">{p.name}</div>
                    <div className="el-pmeta">
                      <span>{y} 年 · 物理</span>
                      <window.Icon name="arrow-up-right" size={13}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {yearsToShow.length === 0 && (
          <div style={{padding:'48px', textAlign:'center', color:'var(--ppath-fg-3)'}}>没有匹配的卷子。</div>
        )}
      </div>

      {/* 翻页（底部 dots + 左右浮动按钮）*/}
      {totalPages > 1 && (
        <>
          <div className="el-pager">
            <div className="el-pdots">
              {yearsAll.map((y, i) => (
                <button key={y} className={`el-pdot ${i === curIdx ? 'on' : ''}`} onClick={() => setPage(i)}>
                  {y}
                </button>
              ))}
            </div>
          </div>
          {/* 浮动左右按钮：稳居屏幕左右边缘随滚动条始终可见 */}
          <button
            className="el-pfixed el-pfixed-left"
            disabled={curIdx === 0}
            onClick={() => setPage(curIdx - 1)}
            aria-label="上一年"
            title="上一年（← 键）"
          >
            <window.Icon name="chevron-left" size={20}/>
          </button>
          <button
            className="el-pfixed el-pfixed-right"
            disabled={curIdx >= totalPages - 1}
            onClick={() => setPage(curIdx + 1)}
            aria-label="下一年"
            title="下一年（→ 键）"
          >
            <window.Icon name="chevron-right" size={20}/>
          </button>
        </>
      )}
    </div>
  );
}

// ─────────────────────── PaperDetail (problem list) ───────────────────────
// 模块 → V1 颜色（用于头部考点 donut）
const MODULE_COLOR = {
  '力学':     '#1f3a2e',
  '电磁学':   '#7a3a26',
  '振动波动': '#3a4a26',
  '光学':     '#2c4858',
  '热学':     '#6b4a26',
  '实验':     '#5a4a6a',
  '近代':     '#4a3a52',
  '天体':     '#3a5860',
  '运动学':   '#2a4a3a',
  '原子物理': '#5a4a6a',
};

function PaperDetail({ params, go }) {
  const { year, paper } = params || {};
  const paperObj = window.PAPERS.find(p => p.id === paper);
  const list = window.PROBLEMS.filter(p => p.year === year && p.paper === paper);

  if (!paperObj) {
    return <div className="exam-page"><p>卷型未找到。<button className="btn btn-line btn-sm" onClick={() => go('library')}>返回</button></p></div>;
  }

  // ─── 数据转换：REAL_PROBLEMS schema → V1 schema ───
  const problems = list.map(p => {
    const m = (window.PROBLEM_META || {})[p.id] || {};
    return {
      id:     p.id,                       // 用于 onCard 跳详情
      no:     p.no,
      type:   m.type || 'choice-single',
      title:  p.title,
      answer: m.answer != null ? m.answer : '—',
      topic:  [p.module || '其他'],
      status: p.hasAnim ? 'anim' : 'static',
      online: !!p.htmlPath || !!p.tplId,   // 有 htmlPath 或工坊模板都视为可点
      note:   p.summary || '',
    };
  });

  // ─── 考点 donut 分布 ───
  const moduleCount = {};
  problems.forEach(p => {
    const k = p.topic[0];
    moduleCount[k] = (moduleCount[k] || 0) + 1;
  });
  const topicDistribution = Object.keys(moduleCount).map(k => ({
    key:   k,
    count: moduleCount[k],
    color: MODULE_COLOR[k] || '#5a4a6a',
  }));

  const onlineCount = problems.filter(p => p.online).length;

  const meta = {
    year,
    paperShort:     paperObj.short,
    paperFull:      `${year} 年普通高等学校招生全国统一考试 (${paperObj.name})`,
    subject:        '物理',
    totalQuestions: problems.length,
    onlineCount,
    topicDistribution,
  };

  if (problems.length === 0) {
    return (
      <div className="paper-page" data-screen-label={`03 ${year} ${paperObj.short}`}>
        <button className="paper-back" onClick={() => go('library')}>
          <window.Icon name="arrow-left" size={13} /> 返回真题图库
        </button>
        <div style={{padding:'48px 24px', textAlign:'center', color:'var(--ppath-fg-3)', background:'var(--ppath-card)', border:'1px solid var(--ppath-line)', borderRadius:16, margin:'24px 32px'}}>
          <window.Icon name="inbox" size={28}/>
          <p style={{marginTop:12, fontSize:14}}>这套卷暂无已上架的画图题。</p>
          <p style={{fontSize:12.5}}>我们会持续补充，可点击下方提交收录请求。</p>
          <button className="btn btn-line btn-sm" style={{marginTop:8}}>提交收录请求</button>
        </div>
      </div>
    );
  }

  // ─── 渲染 V1 ───
  if (!window.PaperListV1) {
    return <div style={{padding:32}}>正在加载…</div>;
  }
  return (
    <div data-screen-label={`03 ${year} ${paperObj.short}`}>
      <window.PaperListV1
        meta={meta}
        problems={problems}
        density="loose"
        palette="cream"
        titleFont="sans"
        onCard={p => go('problem', { id: p.id })}
        onBack={() => go('library')}
      />
    </div>
  );
}

// ─────────────────────── ProblemDetail ───────────────────────
function ProblemDetail({ params, go, openModal }) {
  const { id } = params || {};
  const problem = window.PROBLEMS.find(p => p.id === id);
  const paperObj = problem ? window.PAPERS.find(p => p.id === problem.paper) : null;
  const tplId = problem?.tplId;
  const tpl = tplId ? window.TEMPLATES.find(t => t.id === tplId) : null;
  const spec = tplId ? window.getParamSpec(tplId) : null;

  const [values, setValues] = useStateE(() => tplId ? window.getDefaultValues(tplId) : {});
  const [t, setT] = useStateE(0);
  const [playing, setPlaying] = useStateE(true);
  const [unlocked, setUnlocked] = useStateE(false);
  const rafRef = useRefE();
  const lastRef = useRefE();

  useEffectE(() => {
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

  if (!problem) {
    return <div className="exam-page"><p>题目未找到。<button className="btn btn-line btn-sm" onClick={() => go('library')}>返回</button></p></div>;
  }

  const setV = (k, v) => setValues(prev => ({ ...prev, [k]: v }));
  const reset = () => { setValues(window.getDefaultValues(tplId)); setT(0); };

  const showPaywall = problem.paid && !unlocked;

  const knowns = useMemoE(() => {
    const m = [];
    const text = problem.summary;
    const patterns = [
      [/v[₀0]\s*=\s*([\d.]+)\s*m\/s/, '初速度 v₀'],
      [/v\s*=\s*([\d.]+)\s*m\/s/, '速度 v'],
      [/h\s*=\s*([\d.]+)\s*m/, '高度 h'],
      [/L\s*=\s*([\d.]+)\s*m/, '长度 L'],
      [/B\s*=\s*([\d.]+)\s*T/, '磁感应强度 B'],
      [/R\s*=\s*([\d.]+)\s*[Ωω]/, '电阻 R'],
      [/U\s*=\s*([\d.]+)\s*V/, '电压 U'],
      [/d\s*=\s*([\d.]+)\s*(?:c?m)/, '间距 d'],
      [/[θ]\s*=\s*([\d.]+)\s*°/, '倾角 θ'],
      [/[μ]\s*=\s*([\d.]+)/, '摩擦系数 μ'],
      [/m\s*=\s*([\d.]+)\s*kg/, '质量 m'],
      [/r\s*=\s*([\d.]+)\s*m/, '半径 r'],
    ];
    patterns.forEach(([re, lbl]) => {
      const x = text.match(re);
      if (x) m.push([lbl, x[0].split('=')[1].trim()]);
    });
    return m;
  }, [problem.id]);

  return (
    <div className="problem-page" data-screen-label={`04 ${problem.year} ${paperObj.short} 第${problem.no}题`}>
      <div className="problem-bar">
        <div className="crumb">
          <button className="paper-back" style={{margin:0}} onClick={() => go('library')}>
            <window.Icon name="arrow-left" size={12}/> 真题图库
          </button>
          <span className="sep">/</span>
          <button className="paper-back" style={{margin:0}} onClick={() => go('paper', { year: problem.year, paper: problem.paper })}>
            {problem.year} {paperObj.short}
          </button>
          <span className="sep">/</span>
          <b>第 {problem.no} 题</b>
          <span className={`diff-pill ${problem.diff}`} style={{marginLeft:6}}>{problem.diff}</span>
          <span className="tag tag-soft" style={{fontSize:11}}>{problem.module}</span>
        </div>
        <div className="acts">
          <button className="btn btn-line btn-sm"><window.Icon name="bookmark" size={12}/>收藏</button>
          <button className="btn btn-line btn-sm"><window.Icon name="copy" size={12}/>复制题干</button>
          <button className="btn btn-line btn-sm" onClick={() => openModal('export-png')}><window.Icon name="image" size={12}/>下载 PNG</button>
          <button className="btn btn-pri btn-sm" onClick={() => openModal('export-gif')}><window.Icon name="film" size={12}/>导出 GIF</button>
        </div>
      </div>

      <div className="problem-body" style={problem.htmlPath ? {gridTemplateColumns: '1fr'} : undefined}>
        {/* LEFT: 题干（真实题 htmlPath 模式下，iframe 内已经自带原题面，避免重复挤占空间） */}
        {!problem.htmlPath && (
        <aside className="problem-stem">
          <div>
            <div className="e">题号 {problem.no} · {problem.module} · 难度{problem.diff}</div>
            <h2>{problem.title}</h2>
          </div>
          <div className="stem-card">
            <div className="stem-eyebrow">题干原文</div>
            {problem.summary}
          </div>

          {knowns.length > 0 && (
            <div className="knowns">
              <h5>已识别的已知量</h5>
              <div className="kv">
                {knowns.map(([k, v], i) => (
                  <React.Fragment key={i}>
                    <span className="k">{k}</span>
                    <span className="v">{v}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="knowns">
            <h5>对应工坊模板</h5>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{width:50, height:50, background:'var(--ppath-card)', border:'1px solid var(--ppath-line)', borderRadius:10, padding:6, flexShrink:0}}>
                {tpl && <window.TemplateThumb id={tplId} />}
              </div>
              <div style={{flex:1}}>
                <b style={{fontSize:13}}>{tpl?.name || '—'}</b>
                <div style={{fontSize:11.5, color:'var(--ppath-fg-3)', marginTop:2}}>{tpl?.types}</div>
              </div>
              <button className="btn btn-line btn-sm" onClick={() => window.__go('workshop', { templateId: tplId })}>
                <window.Icon name="external-link" size={11}/>打开
              </button>
            </div>
          </div>
        </aside>
        )}

        {/* RIGHT: 动画 + 参数 */}
        <section className="problem-stage-wrap">
          {/* 真实题动画 — 通过 iframe 嵌入独立 HTML（含完整 4 关 agent 审核） */}
          {problem.htmlPath ? (
            <div style={{flex:1, position:'relative', background:'var(--ppath-paper)', overflow:'hidden'}}>
              <iframe
                src={problem.htmlPath}
                style={{width:'100%', height:'100%', border:0, display:'block'}}
                title={problem.title}
                loading="lazy"
              />
              {showPaywall && (
                <div className="paywall" style={{position:'absolute', inset:0, zIndex:10}}>
                  <div className="ic"><window.Icon name="lock" size={26}/></div>
                  <h3>会员动画 · 解锁后可调参</h3>
                  <p>题干永久免费查看。动态图、参数调节、GIF 导出需要老师 PRO 会员或单题积分解锁（5 积分）。</p>
                  <div className="acts">
                    <button className="btn btn-pri" onClick={() => setUnlocked(true)}>
                      <window.Icon name="check" size={12}/> 用 5 积分解锁
                    </button>
                    <button className="btn btn-line"><window.Icon name="crown" size={12}/>升级老师 PRO</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
          <>
          <div className="ws-stage" style={{flex:1, position:'relative'}}>
            <div className="grid-bg"></div>
            {tplId && <window.PhysicsStage id={tplId} params={values} t={showPaywall ? 0.3 : t} name={tpl?.name} />}

            {spec?.formula && (
              <div className="ws-formula">
                <div className="lbl">{spec.formula.lbl}</div>
                <div className="eq">{spec.formula.text}</div>
              </div>
            )}

            {showPaywall && (
              <div className="paywall">
                <div className="ic"><window.Icon name="lock" size={26}/></div>
                <h3>会员动画 · 解锁后可调参</h3>
                <p>题干永久免费查看。动态图、参数调节、GIF 导出需要老师 PRO 会员或单题积分解锁（5 积分）。</p>
                <div className="acts">
                  <button className="btn btn-pri" onClick={() => setUnlocked(true)}>
                    <window.Icon name="check" size={12}/> 用 5 积分解锁
                  </button>
                  <button className="btn btn-line"><window.Icon name="crown" size={12}/>升级老师 PRO</button>
                </div>
              </div>
            )}
          </div>

          <div className="ws-trans" style={{flexShrink:0}}>
            <button className="play" onClick={() => setPlaying(p => !p)} disabled={showPaywall}>
              <window.Icon name={playing ? 'pause' : 'play'} size={14} />
            </button>
            <button className="ttool" onClick={reset} title="重置" disabled={showPaywall}>
              <window.Icon name="rotate-ccw" />
            </button>
            <div className="timeline">
              <div className="timeline-track">
                <div className="timeline-fill" style={{width: `${Math.min(100, t * 100)}%`}}></div>
                <div className="timeline-thumb" style={{left: `${Math.min(100, t * 100)}%`}}></div>
              </div>
              <div className="timeline-meta">
                <span>0.00s</span>
                <span>关键帧 · 起始 / 中段 / 末态</span>
                <span>1.00s</span>
              </div>
            </div>
            <button className="btn btn-line btn-sm" onClick={() => openModal('explain')}>
              <window.Icon name="sparkles" size={12} /> 生成讲解词
            </button>
          </div>

          {spec && !showPaywall && (
            <div style={{borderTop:'1px solid var(--ppath-line)', background:'var(--ppath-card)', padding:'14px 24px', display:'flex', gap:18, overflowX:'auto', flexShrink:0}}>
              {spec.groups.flatMap(g => g.params || []).slice(0, 5).map(p => (
                <div key={p.key} style={{minWidth:160, flexShrink:0}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--ppath-fg-3)', fontWeight:600, marginBottom:4}}>
                    <span>{p.label} <span style={{fontFamily:'var(--ppath-font-mono)'}}>{p.sym}</span></span>
                    <span style={{color:'var(--ppath-fg-1)', fontFamily:'var(--ppath-font-mono)'}}>{Number(values[p.key]).toFixed(p.step < 1 ? 2 : 0)}{p.unit && ` ${p.unit}`}</span>
                  </div>
                  <input type="range" min={p.min} max={p.max} step={p.step}
                    value={values[p.key]} onChange={e => setV(p.key, parseFloat(e.target.value))}
                    style={{width:'100%'}} />
                </div>
              ))}
            </div>
          )}
          </>
          )}
        </section>
      </div>
    </div>
  );
}

// ─────────────────────── AI page (replaced as "soon") ───────────────────────
function AIPageSoon() {
  return (
    <div className="page" data-screen-label="06 AI 即将上线">
      <div className="soon-wrap">
        <div className="ic"><window.Icon name="wand-2" size={36}/></div>
        <div className="eyebrow" style={{color:'var(--ppath-amber-700)'}}>● 即将上线</div>
        <h1>AI 自动识别题目，生成动态图</h1>
        <p>第二阶段我们会把"贴题干 → 自动出动画"这个能力做出来。目前模型还无法稳定生成精确到参数级的物理图解，所以暂不上线，避免给老师在课堂上挖坑。</p>
        <p style={{fontSize:13.5, color:'var(--ppath-fg-3)'}}>当前可用：<b style={{color:'var(--ppath-fg-1)'}}>真题图库</b>（覆盖近 10 年高考画图题）+ <b style={{color:'var(--ppath-fg-1)'}}>图解工坊</b>（手动选模型调参）。</p>
        <div style={{display:'flex', gap:10, justifyContent:'center', marginTop:8}}>
          <button className="btn btn-pri" onClick={() => window.__go('library')}><window.Icon name="arrow-left" size={12}/>去真题图库</button>
          <button className="btn btn-line">订阅上线通知</button>
        </div>
      </div>
    </div>
  );
}

// ─── Paper thumbnail (mock 试卷封面 SVG) ───
function PaperThumb({ year, paper }) {
  // hash for variation
  const h = (year * 7 + (paper.id.charCodeAt(0) || 0)) % 4;
  const accentColors = ['#1f3a2e', '#7a3a26', '#3a4a26', '#26343a'];
  const accent = accentColors[h];
  const bands = [
    [{x:18,w:120},{x:18,w:88},{x:18,w:104}],
    [{x:18,w:96},{x:18,w:120},{x:18,w:72}],
    [{x:18,w:108},{x:18,w:84},{x:18,w:120}],
    [{x:18,w:80},{x:18,w:118},{x:18,w:96}],
  ][h];
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{width:'100%', height:'100%', display:'block'}}>
      {/* paper sheet */}
      <rect x="22" y="14" width="156" height="172" fill="#fdfaf2" stroke="#d8cfb8" strokeWidth="1"/>
      <rect x="22" y="14" width="156" height="3" fill={accent} opacity="0.85"/>
      {/* fold shadow */}
      <path d="M 178 14 L 168 24 L 178 24 Z" fill="#c9bf9c" opacity="0.5"/>
      {/* header band */}
      <text x="32" y="34" fontFamily="serif" fontSize="9" fontWeight="700" fill="#2a2418">普通高等学校招生全国统一考试</text>
      <text x="32" y="52" fontFamily="serif" fontSize="14" fontWeight="900" fill={accent} letterSpacing="0.5">{year} · {paper.short}</text>
      <text x="32" y="64" fontFamily="serif" fontSize="7.5" fill="#6a6048" letterSpacing="0.4">PHYSICS · 物理</text>
      <line x1="32" y1="72" x2="168" y2="72" stroke={accent} strokeWidth="0.6" opacity="0.6"/>
      {/* question label */}
      <text x="32" y="86" fontFamily="serif" fontSize="6.5" fontWeight="700" fill="#2a2418">一、选择题</text>
      {/* ruled lines */}
      {bands.map((b, i) => (
        <g key={i}>
          <rect x={b.x + 14} y={92 + i*9} width={b.w} height="1.4" fill="#9a8e6e" opacity="0.55"/>
        </g>
      ))}
      <text x="32" y="130" fontFamily="serif" fontSize="6.5" fontWeight="700" fill="#2a2418">二、计算题</text>
      {/* tiny diagram (varies by hash) */}
      {h === 0 && (
        <g transform="translate(38,138)">
          <line x1="0" y1="22" x2="60" y2="22" stroke="#3a3120" strokeWidth="0.8"/>
          <path d="M 0 22 Q 30 0, 60 22" fill="none" stroke={accent} strokeWidth="0.9" strokeDasharray="2 1.5"/>
          <circle cx="30" cy="11" r="2" fill={accent}/>
        </g>
      )}
      {h === 1 && (
        <g transform="translate(38,138)">
          <rect x="0" y="14" width="22" height="14" fill="none" stroke="#3a3120" strokeWidth="0.8"/>
          <line x1="22" y1="21" x2="60" y2="21" stroke="#3a3120" strokeWidth="0.8"/>
          <path d="M 28 21 L 36 17 L 36 25 Z" fill={accent}/>
        </g>
      )}
      {h === 2 && (
        <g transform="translate(38,138)">
          <circle cx="14" cy="22" r="10" fill="none" stroke="#3a3120" strokeWidth="0.8"/>
          <circle cx="14" cy="22" r="2" fill={accent}/>
          <line x1="14" y1="22" x2="56" y2="22" stroke="#3a3120" strokeWidth="0.6" strokeDasharray="1.5 1.5"/>
          <text x="48" y="20" fontSize="5" fill={accent} fontWeight="700">v</text>
        </g>
      )}
      {h === 3 && (
        <g transform="translate(38,138)">
          {[0,1,2,3,4].map(i => <line key={i} x1={i*12} y1="14" x2={i*12} y2="30" stroke={accent} strokeWidth="0.6"/>)}
          <line x1="0" y1="14" x2="50" y2="14" stroke="#3a3120" strokeWidth="0.8"/>
          <line x1="0" y1="30" x2="50" y2="30" stroke="#3a3120" strokeWidth="0.8"/>
          <text x="56" y="24" fontSize="5" fill={accent} fontWeight="700">B</text>
        </g>
      )}
      {/* page number */}
      <text x="100" y="178" textAnchor="middle" fontFamily="serif" fontSize="5.5" fill="#9a8e6e">— 第 1 页 共 8 页 —</text>
    </svg>
  );
}

Object.assign(window, { ExamLibrary, PaperDetail, ProblemDetail, AIPageSoon, PaperThumb });
