/* eslint-disable */
/* 单套试卷题目列表页 — 共用组件 */

const { useState, useMemo } = React;

const TYPE_LABELS = {
  'choice-single': '单选',
  'choice-multi':  '多选',
  'experiment':    '实验',
  'calc':          '计算',
};
const STATUS_LABELS = {
  anim:   { txt: '动画', dot: '●' },
  static: { txt: '静态', dot: '○' },
  soon:   { txt: '即将上线', dot: '◌' },
};

function TypeBadge({ type }) {
  return <span className={`pl-type type-${type}`}>{TYPE_LABELS[type]}</span>;
}
function StatusPill({ status }) {
  const m = STATUS_LABELS[status];
  return <span className={`pl-st tag-${status}`}><i style={{fontSize:9}}>{m.dot}</i>{m.txt}</span>;
}
function TopicChip({ t }) {
  return <span className="pl-tchip">{t}</span>;
}
function AnswerStamp({ ans, soft }) {
  if (Array.isArray(ans)) {
    return (
      <div className="pl-ans-multi">
        {ans.map((a, i) => (
          <React.Fragment key={i}>
            <span className="sub">{a.sub}</span>
            <span className="val">{a.val}</span>
          </React.Fragment>
        ))}
      </div>
    );
  }
  return soft
    ? <span className="pl-ans-soft">{ans}</span>
    : <span className="pl-ans-stamp">{ans}</span>;
}

/* ───── 头部（共用） ───── */
function PaperHeader({ meta, variant = 'default', onBack }) {
  const total = meta.topicDistribution.reduce((s, t) => s + t.count, 0);
  const pct = Math.round((meta.onlineCount / meta.totalQuestions) * 100);
  // 计算 donut 路径
  const donut = (() => {
    const r = 36, cx = 44, cy = 44;
    let acc = 0;
    return meta.topicDistribution.map((t, i) => {
      const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
      acc += t.count;
      const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
      const large = (a1 - a0) > Math.PI ? 1 : 0;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      return <path key={i} d={`M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`} fill={t.color} />;
    });
  })();

  return (
    <div className="pl-head">
      <div style={{ minWidth: 0 }}>
        <div className="pl-back" onClick={onBack} style={onBack ? {cursor:'pointer'} : undefined}>← 返回试卷书架</div>
        <div className="pl-eyebrow">{meta.year} · {meta.subject}</div>
        <h1 className="pl-title">{meta.year} {meta.paperShort} · {meta.subject}</h1>
        <div className="pl-subtitle">{meta.paperFull}</div>
        <div className="pl-progress" style={{ maxWidth: 380 }}>
          <div className="pl-progress-bar">
            <div className="pl-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="pl-progress-meta">
            <span>可用静 / 动态图展示的题目 共 {meta.onlineCount} / {meta.totalQuestions} 题</span>
            <span>{pct}%</span>
          </div>
        </div>
      </div>
      <div className="pl-topics">
        <svg className="pl-donut" viewBox="0 0 88 88">
          {donut}
          <circle cx="44" cy="44" r="20" fill="var(--ppath-card)" />
          <text x="44" y="42" textAnchor="middle" fontSize="10" fill="var(--ppath-fg-3)" fontWeight="700">考点</text>
          <text x="44" y="54" textAnchor="middle" fontSize="13" fill="var(--ppath-fg-1)" fontWeight="900">{total}</text>
        </svg>
        <div className="pl-topic-list">
          {meta.topicDistribution.map(t => (
            <div className="row" key={t.key}>
              <span className="sw" style={{ background: t.color }} />
              <span className="lbl">{t.key}</span>
              <span className="ct">{t.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───── 过滤工具栏 ───── */
function FilterBar({ tab, onTab, q, onQ, problems, compact }) {
  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'choice-single', label: '单选' },
    { id: 'choice-multi',  label: '多选' },
    { id: 'experiment',    label: '实验' },
    { id: 'calc',          label: '计算' },
  ];
  const counts = useMemo(() => {
    const c = { all: problems.length };
    problems.forEach(p => { c[p.type] = (c[p.type] || 0) + 1; });
    return c;
  }, [problems]);
  return (
    <div className="pl-tabs">
      {tabs.map(t => (
        <button key={t.id} className={`pl-tab ${tab === t.id ? 'on' : ''}`} onClick={() => onTab(t.id)}>
          {t.label}<span className="ct">{counts[t.id] || 0}</span>
        </button>
      ))}
      <div className="pl-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input value={q} onChange={e => onQ(e.target.value)} placeholder="题号 / 考点 / 关键词" />
      </div>
    </div>
  );
}

function useFiltered(problems, tab, q) {
  return useMemo(() => problems.filter(p => {
    if (tab !== 'all' && p.type !== tab) return false;
    if (!q) return true;
    const hay = (p.no + p.title + p.topic.join('') + p.note).toLowerCase();
    return hay.includes(q.toLowerCase());
  }), [problems, tab, q]);
}

/* ───── v1 稳健版 ───── */
function PaperListV1({ meta, problems, density = 'loose', palette = 'cream', titleFont = 'sans', onCard, onBack }) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const filtered = useFiltered(problems, tab, q);
  const cls = `pl-art v1 density-${density} palette-${palette} titlefont-${titleFont}`;
  return (
    <div className={cls}>
      <PaperHeader meta={meta} onBack={onBack} />
      <FilterBar tab={tab} onTab={setTab} q={q} onQ={setQ} problems={problems} />
      <div className="pl-grid-v1">
        {filtered.map(p => (
          <div key={p.no}
               className={`pl-card-v1 ${!p.online ? 'disabled' : ''}`}
               data-st={p.status}
               onClick={onCard && p.online ? () => onCard(p) : undefined}>
            <div className="top">
              <span className="no">{p.no}</span>
              <TypeBadge type={p.type} />
            </div>
            <h4>{p.title}</h4>
            <div className="ans-row">
              <AnswerStamp ans={p.answer} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{gridColumn:'1/-1', padding:'56px 24px', textAlign:'center', color:'var(--ppath-fg-3)', background:'var(--ppath-paper-deep)', border:'1px dashed var(--ppath-line)', borderRadius:12}}>
            没有匹配的题目。换个关键词或题型？
          </div>
        )}
      </div>
    </div>
  );
}

/* ───── v2 教辅书版 ───── */
function PaperListV2({ meta, problems }) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const filtered = useFiltered(problems, tab, q);
  return (
    <div className="pl-art book v2">
      <PaperHeader meta={meta} />
      <FilterBar tab={tab} onTab={setTab} q={q} onQ={setQ} problems={problems} />
      <div className="pl-list-v2">
        {filtered.map(p => (
          <div key={p.no} className={`pl-row-v2 ${!p.online ? 'disabled' : ''}`}>
            <div className="no-block">
              <div className="n">{p.no}</div>
              <div className="lbl">第 {p.no} 题</div>
            </div>
            <div className="body">
              <h4>{p.title}</h4>
              <div className="meta">
                <TypeBadge type={p.type} />
                {p.topic.map(t => <TopicChip key={t} t={t} />)}
                <StatusPill status={p.status} />
              </div>
              <div className="note">考查：{p.note}</div>
              <div style={{marginTop:10}}>
                <AnswerStamp ans={p.answer} />
              </div>
            </div>
            <div className="end">
              <div className="cta">{p.online ? '查看动画讲义 →' : '敬请期待'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── v3 信息密集表格版 ───── */
function PaperListV3({ meta, problems }) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const filtered = useFiltered(problems, tab, q);
  return (
    <div className="pl-art v3">
      <PaperHeader meta={meta} />
      <FilterBar tab={tab} onTab={setTab} q={q} onQ={setQ} problems={problems} />
      <table className="pl-table-v3">
        <thead>
          <tr>
            <th>题号</th>
            <th>题型</th>
            <th>题目 / 考点</th>
            <th>官方答案</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.no} className={!p.online ? 'disabled' : ''}>
              <td className="no">{p.no}</td>
              <td><TypeBadge type={p.type} /></td>
              <td className="title">
                {p.title}
                <div className="tags">{p.topic.map(t => <TopicChip key={t} t={t} />)}</div>
                <div className="tt-meta">{p.note}</div>
              </td>
              <td className="ans">
                {Array.isArray(p.answer)
                  ? p.answer.map((a, i) => <div key={i}>{a.sub} {a.val}</div>)
                  : p.answer}
              </td>
              <td><StatusPill status={p.status} /></td>
              <td className="act">
                {p.online ? <a>查看 →</a> : <span style={{color:'var(--ppath-fg-3)', fontSize:11}}>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { PaperListV1, PaperListV2, PaperListV3 });
