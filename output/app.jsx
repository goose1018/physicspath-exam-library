/* eslint-disable */
// 物理图解工坊 — App entry & Tweaks integration

const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#c2611f",
  "primary": "#12352d",
  "fontScale": 100,
  "sidebarWidth": 240,
  "animSpeed": 100,
  "cardDensity": "comfy"
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useStateA('home');
  const [routeParams, setRouteParams] = useStateA(null);
  // routes: home (Year×Paper grid) | paper (problem list) | problem (detail) | library | workshop | ai
  const [credits, setCredits] = useStateA(120);
  const [modal, setModal] = useStateA(null);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // 路由滚动管理：进新路由前保存当前路由滚动位置，进新路由后恢复（如有保存）或归零
  const _scrollKey = (r, params) => {
    if (r === 'paper' && params) return `pp_scroll_paper_${params.year}_${params.paper}`;
    if (r === 'library') return 'pp_scroll_library';
    return null;  // home/problem/workshop/ai 不保存（每次进都视为新内容）
  };
  const go = (r, params = null) => {
    // 保存当前路由滚动位置
    const curKey = _scrollKey(route, routeParams);
    if (curKey) { try { sessionStorage.setItem(curKey, String(window.scrollY)); } catch {} }
    // 切路由
    setRoute(r);
    setRouteParams(params);
    // 等 DOM 渲染后恢复或归零
    const newKey = _scrollKey(r, params);
    const saved = newKey ? (() => { try { return sessionStorage.getItem(newKey); } catch { return null; } })() : null;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, saved != null ? Number(saved) : 0);
      });
    });
  };
  window.__go = go;

  // apply tweaks as CSS vars
  useEffectA(() => {
    const root = document.documentElement;
    root.style.setProperty('--ppath-amber-600', tweaks.accent);
    root.style.setProperty('--ppath-ink-green-800', tweaks.primary);
    root.style.fontSize = `${tweaks.fontScale}%`;
  }, [tweaks.accent, tweaks.primary, tweaks.fontScale]);

  return (
    <div className="app-shell" data-screen-label={
      route === 'home' ? '01 Landing' :
      route === 'library' ? '02 真题图库' :
      route === 'paper' ? '03 Paper Detail' :
      route === 'problem' ? '04 Problem Detail' :
      route === 'workshop' ? '05 Workshop' :
      route === 'ai' ? '06 AI (Soon)' : route
    }>
      <window.TopNav route={route} go={go} credits={credits} onOpenModal={() => setModal('credits')} />
      {route === 'home' && <window.Landing go={go} />}
      {route === 'library' && <window.ExamLibrary go={go} />}
      {route === 'paper' && <window.PaperDetail params={routeParams} go={go} />}
      {route === 'problem' && <window.ProblemDetail params={routeParams} go={go} openModal={setModal} />}
      {route === 'workshop' && <window.Workshop initial={routeParams} openModal={setModal} />}
      {route === 'ai' && <window.AIPageSoon />}

      {modal && <window.CreditModal kind={modal} onClose={() => setModal(null)} credits={credits} setCredits={setCredits} />}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="主题色">
          <window.TweakColor label="主色 (深墨绿)" value={tweaks.primary} onChange={v => setTweak('primary', v)} />
          <window.TweakColor label="强调色 (暖橙)" value={tweaks.accent} onChange={v => setTweak('accent', v)} />
        </window.TweakSection>
        <window.TweakSection title="排版与密度">
          <window.TweakSlider label="字号档位" value={tweaks.fontScale} onChange={v => setTweak('fontScale', v)} min={90} max={120} step={5} unit="%" />
          <window.TweakRadio label="卡片密度" value={tweaks.cardDensity} onChange={v => setTweak('cardDensity', v)}
            options={[{value:'comfy', label:'宽松'}, {value:'dense', label:'紧凑'}]} />
        </window.TweakSection>
        <window.TweakSection title="跳转">
          <window.TweakButton onClick={() => go('home')}>首页·介绍页</window.TweakButton>
          <window.TweakButton onClick={() => go('library')}>真题图库·双搜索</window.TweakButton>
          <window.TweakButton onClick={() => go('paper', { year: 2025, paper: 'xgk1' })}>2025 新高考 I 卷</window.TweakButton>
          <window.TweakButton onClick={() => go('problem', { id: '2025-xgk1-25' })}>题详情·导体棒</window.TweakButton>
          <window.TweakButton onClick={() => go('problem', { id: '2025-gk1-23' })}>题详情·付费颗</window.TweakButton>
          <window.TweakButton onClick={() => go('workshop', { templateId: 'projectile' })}>工作台 · 平抛</window.TweakButton>
          <window.TweakButton onClick={() => go('workshop', { templateId: 'rod' })}>工作台 · 导体棒</window.TweakButton>
          <window.TweakButton onClick={() => go('workshop', { templateId: 'lens' })}>工作台 · 凸透镜</window.TweakButton>
          <window.TweakButton onClick={() => go('ai')}>AI 题目转图</window.TweakButton>
          <window.TweakButton onClick={() => setModal('export-gif')}>打开导出弹窗</window.TweakButton>
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
