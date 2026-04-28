# PhysicsPath · 高考物理动画讲义 · 标准化文档

> 给下一个对话框 / 协作者：先读完本文件再动手。所有约定、设计令牌、流水线规则都在这里。

---

## 1 · 项目背景

把 2017–2025 年中国高考物理真题（解析版 DOCX）转成**可动画讲义网页**，每题包含：
- 原题题面 + 原题图（来自 DOCX）
- 我们手写的 Canvas 动画
- 公式（KaTeX 渲染）
- 实时数据面板
- 三段过程时间轴
- 可下载素材：PNG / GIF / WebM

最终目标：老师付费下载素材包、塞进 PPT 即用。学生付费浏览动画。

品牌：**PhysicsPath**（"名师 AI 解题教练"）。设计系统在 `_shared/design-system/`。

---

## 2 · 目录结构

```
C:\Users\60507\physics_anim\output\
├── index.html                        ← ★ React SPA 入口（"物理图解工坊 · PhysicsPath Teacher Studio"）
├── app.jsx                           ←   主 App（路由：home/library/paper/problem/workshop/ai）
├── exams.jsx                         ←   YEARS / PAPERS / PROBLEMS 数据（**新增 REAL_PROBLEMS**）
├── exam-pages.jsx                    ←   ExamLibrary / PaperDetail / ProblemDetail（**改 htmlPath 分支**）
├── pages.jsx                         ←   Landing / Library / Workshop
├── templates.jsx                     ←   动画模板库（rod/projectile/particle/...）
├── params.jsx, stages.jsx,
├── tweaks-panel.jsx                  ←   设计师调色面板
├── styles/
│   ├── ppath-tokens.css              ←   PhysicsPath 设计令牌
│   ├── app.css, exam.css             ←   React app 样式
├── STANDARD.md                       ← 本文件
├── AUDIT_LOG.md                      ← 滚动审核日志
├── _shared/                          ← 共享资源（独立 HTML 引用）
│   ├── design-system/                ← PhysicsPath 品牌系统（用户给的）
│   │   ├── colors_and_type.css       ← 颜色 + 字体 token（必读）
│   │   ├── README.md                 ← 品牌指南（不要可爱、不要紫色霓虹）
│   │   └── ...
│   ├── q-shell.css                   ← 页面框架 CSS（3 列 layout、原题卡、矢量、时间轴）
│   └── q-shell.js                    ← 通用动画引擎（PathQuestion + PPath helpers）
├── 2025_陕晋宁青/                    ← 一份卷子一个文件夹
│   ├── source/                       ← DOCX 提取产物
│   │   ├── extract.py                ← 标准提取脚本（python-docx）
│   │   ├── full_text.md              ← 提取的纯文本（含 ![](imageN.png) 图片锚点）
│   │   ├── paragraph_index.json      ← 结构化索引
│   │   ├── images/                   ← 提取的所有 png/wmf 图
│   │   └── unpacked/                 ← DOCX 解包原文件
│   ├── manifest.json                 ← 题目分级清单（A 关 agent 识别产物）
│   ├── index.html                    ← 卷子级首页（搜索/筛选/状态）
│   └── questions/
│       ├── q01/index.html
│       ├── q02/index.html
│       └── ...
├── 2024_全国甲卷/
└── ...
```

**关键约定**：
- 题目页相对路径：`questions/qNN/index.html` → 引用 `../../../_shared/q-shell.{css,js}` 与 `../../source/images/imageN.png`
- 卷子目录命名：`{年份}_{卷别简称}/`，例如 `2024_新课标卷`、`2024_山东卷`、`2024_浙江1月`

---

## 3 · 视觉系统（PhysicsPath 设计令牌）

**只能用 `_shared/design-system/colors_and_type.css` 里的 `--ppath-*` token，不准硬编码 hex。**

### 主色板（4 色为主）

| 角色 | Token | Hex | 用法 |
|---|---|---|---|
| 主品牌色（墨绿） | `--ppath-ink-green-800` | `#12352d` | 标题、主按钮、轨迹线 |
| 强调色（暖琥珀） | `--ppath-amber-600` | `#c2611f` | 仅"下一步/答案/关键点"，每屏最多一处 |
| 米黄底 | `--ppath-paper` | `#fbfaf7` | 页面底色 |
| 米黄深 | `--ppath-paper-deep` | `#f6f2ea` | 原题卡底色、hero 底 |
| 卡片白 | `--ppath-card` | `#ffffff` | 主图、动画卡片 |
| 暖描边 | `--ppath-line` | `#eadfce` | 1px 线，永不用灰 |

### 语义色

| 角色 | Token | 用法 |
|---|---|---|
| 成功/正确 | `--ppath-success-700` `#16613f` | ✓、绿色高亮 |
| 警告/失败 | `--ppath-danger-700` `#9b2226` | ✗ |
| 力（红） | `--ppath-amber-700` 或 `#b4442e` | 力箭头 |

### 禁用

- 蓝色 `#1d4ed8` / `#3f6f8f`：被 PhysicsPath 设计系统**明确退役**（"读起来像 SaaS"），但**实际生产中难免出现**（如 v 速度向量），如非必要避免使用，要用就压一压饱和度。
- 紫色霓虹、AI 神秘紫：禁。
- 渐变 hero 底：禁。
- 黑色实底大块：避免（轮胎类除外，有视觉理由）。
- emoji：**绝对禁**（文案里也禁，UI 里也禁）。
- 中文圆圈数字 `①②③`：在 KaTeX `\text{}` 里渲染会偏移，**用 `(1)(2)(3)` 或纯英文 `①` 单独成 UTF-8** 而不是 LaTeX。

### 字体

- 中文正文：`var(--ppath-font-sans)` = `"Noto Sans SC", "PingFang SC"…`
- 中文标题：`var(--ppath-font-display)` = `"Noto Serif SC", "Songti SC"…`
- 公式行内：`var(--ppath-font-mono)` = `"JetBrains Mono"…`
- 数学排版：**KaTeX**（CDN）。绝不用 Unicode 拼分数（`/`）、上下标（`²`、`₁`）拼公式。
- 坐标轴标签 `x`、`y`：用 italic Georgia/Cambria Math。

### 图标

- **Lucide** 线性款（CDN）。不用 emoji、不用填充图标。
- 常用：`play`、`pause`、`rotate-ccw`、`download`、`image`、`film`、`video`、`external-link`、`x`、`chevron-up`、`chevron-down`。

---

## 3.5 · 顶层 React SPA 架构（**用户设计稿，已锁定**）

`output/index.html` 是 React SPA 入口（"物理图解工坊"），由用户外部 design 团队预先设计。
**不要重写它**——这是固定外壳。我们只负责往 `PROBLEMS` 数组追加真实题数据。

### 路由

| 路由 | 渲染组件 | 用途 |
|---|---|---|
| `home` | `Landing` | 首页介绍 |
| `library` | `ExamLibrary` | **真题图库**（年份×卷型双搜索 + 分组陈列） |
| `paper` | `PaperDetail` | 卷详情：题目列表 |
| `problem` | `ProblemDetail` | 题详情：题干 + 动画 + 控制条 |
| `workshop` | `Workshop` | 工坊：用户调参做自定义动画 |
| `ai` | `AIPageSoon` | AI 题目转图（即将上线） |

### 数据结构（`exams.jsx`）

```js
const PAPERS = [
  { id:'gk1',  short:'全国甲', name:'全国甲卷',     region:'全国', tier:'core' },
  { id:'gk2',  short:'全国乙', name:'全国乙卷',     region:'全国', tier:'core' },
  { id:'xgk1', short:'新高考Ⅰ', name:'新高考 I 卷',  region:'全国', tier:'core' },
  { id:'xgk2', short:'新高考Ⅱ', name:'新高考 II 卷', region:'全国', tier:'core' },
  { id:'bj',   short:'北京',  name:'北京卷',        region:'地方', tier:'local' },
  { id:'sh', 'tj', 'zj' ... }
];
const YEARS = [2025, 2024, ..., 2016];

// 每题：
{
  id: '2024-gk1-q01',          // 唯一 id：年份-卷型-题号
  year: 2024, paper:'gk1', no:'1',
  module: '近代/力学/电磁学/...',
  tplId: null,                  // 模板模式必填；iframe 模式可 null
  title: '题目标题',
  summary: '题干摘要',
  diff: '易/中/难',
  heat: 100,                    // 热度（用于排序）
  hasAnim: true,
  htmlPath: '2024_全国甲卷/questions/q01/index.html',  // ← ★ 新增字段：iframe 嵌入
  paid: true                    // 可选：会员题（显示 paywall）
}
```

### iframe 嵌入机制（**我们的接入方式**）

`exam-pages.jsx` 的 `ProblemDetail` 已被改造：
- 如果 `problem.htmlPath` 存在 → 渲染 iframe 嵌入我们的独立 HTML
- 否则 → 渲染 `<window.PhysicsStage>` 用 `tplId` + 工坊模板

```jsx
{problem.htmlPath ? (
  <iframe src={problem.htmlPath} style={{width:'100%',height:'100%',border:0}} />
) : (
  <PhysicsStage id={tplId} params={values} t={t} />
)}
```

**Paywall**（会员墙）依然生效：`paid && !unlocked` 时覆盖一层提示，5 积分解锁。

### 新增题目的标准流程（**新版**）

1. 按现有约定生产独立 HTML（`{年份}_{卷别}/questions/qNN/index.html`），跑四关 agent 审
2. 在 `output/exams.jsx` 的 `REAL_PROBLEMS` 数组**末尾追加**一条 entry，包含 `htmlPath`
3. 刷新 React app → 题库自动收录

**不要**：
- 不要在每份卷子下面再建独立的 `index.html`（卷子级首页）—— 这是旧架构残留，现在卷子列表由 React SPA 接管
- 但已存在的 `2024_全国甲卷/index.html`、`2025_陕晋宁青/index.html` 保留作为**备用直链**（教师可单独分享）

---

## 4 · 布局规范（**重要 · 已锁定**）

### 3 列主布局（每题页面默认）

```
┌──────────────────────────────────────────────────┐
│  topbar：eyebrow + h1 + subtitle + actions       │
├──────────┬─────────────────────────────┬────────┤
│  原题     │  动画主图                     │  控制   │
│  原图     │  注释条（公式 + 老师提示）      │  实时    │
│  小题列    │                             │  数值    │
│  官方答案  │                             │  结论    │
│  320px    │  flex 1                      │  280px  │
└──────────┴─────────────────────────────┴────────┘
[底部 timeline 三段过程卡]
```

CSS：
```css
.layout{
  display: grid;
  grid-template-columns: 320px minmax(0,1fr) 280px;
  gap: 18px;
  align-items: start;
}
```

### 原题图尺寸（**严格限制**）

```css
.orig-fig img{
  max-width: 100%;
  max-height: 240px;        /* ← 关键：图永远不超过 240px 高 */
  width: auto;
  height: auto;
  object-fit: contain;
}
```

如果用户嫌 240px 还大，候选 180px。**不要让原题图占主体**——它是辅助参考，主体是动画。

### 响应式

| 屏宽 | 行为 |
|---|---|
| ≥1100 px | 3 列（左原题 / 中动画 / 右控制） |
| 760–1100 px | 2 列（左原题 + 中动画），控制吸到底部铺平 |
| <760 px | 单列纵向堆叠 |

### 主图比例

```css
.canvas-wrap{aspect-ratio: 16/8; max-height: 520px}
```

不要 16:9，太占屏；不要 4:3，太挤。

### 导出预览模式（双模式切换）

`body.export-mode` 时：
- 隐藏右控制列（`opacity:0; pointer-events:none`）
- 隐藏底部 timeline、subtitle、eyebrow
- 主图展开占满中+右
- 用于"老师下载素材"这种需要纯净画面的场景

按钮：topbar 中的 `#modeBtn`，点击 `body.classList.toggle('export-mode')`。

---

## 5 · q-shell.js · PathQuestion API

每个题页就一个调用：

```js
PathQuestion({
  // —— 元信息 —— //
  paperTitle: '2024 全国甲卷',
  paperHref: '../../index.html',
  eyebrow: '单选 · 第 3 题 · 6 分',
  title: '嫦娥六号 · 月球采样',
  subtitle: '简短描述用于 SEO/导览',

  // —— 动画卡片头部 —— //
  deliv: {
    title: '嫦娥六号 · 月球采样',     // 大标题
    sub: '环月、月面、转移三阶段 · 答案 D'   // 小副标
  },

  // —— 原题（左列）—— //
  originalProblem: {
    meta: '2024 全国甲卷 · 第 3 题 · 6 分',
    image: '../../source/images/image25.png',     // 原图（如有）
    text: `如图，质量为 <b>m</b> 的小环……`,         // 题面，可含 <b>
    subQuestions: ['A. ...', 'B. ...', 'C. ...', 'D. ...'],
    officialAnswer: 'D · 推导 + 关键步骤'
  },

  // —— 动画时长 + 时间步 —— //
  totalT: 8,                  // 物理总时间（秒/单位）
  speedFactor: 0.6,            // dt 乘子，值越小越慢

  // —— 物理状态机 —— //
  evalState(t){
    // 返回 {phase: 1..N, ...任何中间量}
    // 必须支持 t 反转（playing 重置时 t<lastT 要复位状态）
    return {phase: t<3 ? 1 : t<6 ? 2 : 3, t};
  },

  // —— Canvas 绘制 —— //
  drawScene(ctx, view, state, t, opts){
    // ctx: CanvasRenderingContext2D
    // view: {w, h, X(x), Y(y), ox, oy, scale}（如果传了 viewBox）
    // opts: {showVec, showGuide, lineW}
    // 此函数每帧调用，**必须**先 fillRect 一层米黄底，否则录视频/GIF 时背景透明会变黑
  },

  // —— 阶段定义（与 evalState 的 phase 对应）—— //
  phases: [
    {
      label: '阶段 1 · 加速',           // pill 上显示
      label_short: '阶段 1',            // 注释条短标
      formula_tex: String.raw`a = \dfrac{F}{m}`,    // KaTeX 公式
      note: '老师讲解的一句话提示'
    },
    // ...
  ],

  // —— 右栏：实时数值 —— //
  stats: [
    {label: '位置 x', fmt: (s, t) => s.x.toFixed(3) + ' m'},
    // ...
  ],

  // —— 右栏：结论 —— //
  conclusions: [
    {label_text: '答案', value_text: 'B', note: '由万有引力推出'},
    {label_text: 'B', value_tex: String.raw`B = \dfrac{8\sqrt{3}\,mv_0}{eL}`}
  ],

  // —— 右栏：图例 —— //
  legend: [
    {swatch: {bg: '#c2611f', border: '#c2611f', type: 'dot'}, text: '电子'},
    {swatch: {bg: 'rgba(...)', border: '#3f6f8f', type: 'rect'}, text: '磁场区'}
  ],

  // —— 底部：三段过程时间轴 —— //
  timeline: [
    {name: '1 · 加速', sub: 'F = +20 N'},
    {name: '2 · 匀速', sub: 'F = 0'},
    {name: '3 · 减速', sub: 'F = −20 N'}
  ],

  // —— 默认参数 —— //
  defaults: {speed: 1.0, lineW: 3.5, vec: true, guide: true},
  fileName: '2024甲卷-Q3-嫦娥六号'    // 导出文件名前缀
});
```

### PPath 工具函数（q-shell.js 暴露）

```js
PPath.label(ctx, px, py, text, sub, leader)   // 统一锚点+引线+白底框标签
PPath.arrow(ctx, x1, y1, x2, y2, color, lw)   // 带箭头的线
PPath.axes(ctx, view, opts)                    // xy 坐标轴
PPath.fieldRect(ctx, view, x0, y0, x1, y1, fill, stroke, label)  // 场区矩形
```

### 自动得到的能力

- **▶ 播放 / ❚❚ 暂停 / 重置** — `requestAnimationFrame` 驱动
- **下载 PNG / GIF / WebM** — 已经接好（GIF 用 blob URL worker 避跨域；WebM 用 MediaRecorder）
- **导出预览模式切换**
- **KaTeX 渲染** phases.formula_tex 和 conclusions.value_tex / label_tex
- **Lucide 图标**

---

## 6 · 物理建模约定

### 6.1 数值积分

- 默认 **半隐式 Euler**：`v += a*dt; x += v*dt`（更稳定）
- **必须**钳制小距离防 1/r² 爆炸，例：`if(r < 0.05) r = 0.05;`
- **必须**限制单步速度变化：`Math.max(-0.5, Math.min(0.5, fA*dt))`
- 子步数：简单系统 60，复杂（双粒子库仑、电磁感应）200+

### 6.2 状态机

- 用模块级 `let S = {...}` 存全局状态
- 阶段切换用容差判定，**不要用 `==`**：
  ```js
  if(Math.abs(v - 0) < 0.01) S.phase++;     // ✓
  if(v === 0) S.phase++;                    // ✗ 浮点永远不等
  ```
- 容差宁宽勿严（容易切换时太敏感）

### 6.3 时间反转 / 重置

`evalState` 必须支持 `t` 倒回（用户拖动进度条会发生）：

```js
let lastT = 0;
function evalState(t){
  if(t < lastT){ S = {...initial}; lastT = 0; }    // 关键
  // ... 数值积分
  lastT = t;
  return {...};
}
```

### 6.4 性能缓存

任何"与 t 无关的预计算"必须缓存到 `window.__qNN_xxx` 避免每帧重算：

```js
if(!window.__q12_curves){
  // 一次性计算
  window.__q12_curves = {data_v, data_UC};
}
```

### 6.5 录制视频/GIF 必备

`drawScene` 每帧**第一行必须是**：
```js
ctx.fillStyle = '#fffdf9';   // 米黄底
ctx.fillRect(0, 0, view.w, view.h);
```

不能用 `ctx.clearRect`（透明背景在录制时会变黑底叠加成纯橙色）。

---

## 7 · 四关 agent 审核流程（**强制**）

每完成一题，**逐题**报告四关状态：

```markdown
| 关 | 状态 | 详情 |
|---|---|---|
| A 题目识别 | ✅ | meta + text + 选项 + officialAnswer 齐全 |
| B 物理推导 | ✅ | Agent 独立推 → 与官方一致 |
| D 代码审 | ✅ | 资源/KaTeX/性能/无 NaN 全过 |
| C 视觉审 | ⏭️ | 用户授权跳过（信任主观审美） |
```

### 关 A · 题目识别（人工 + 单 agent）

- 从 DOCX 提取题面 + 图片 + 官方答案
- 结构化到 `manifest.json`
- 字段：`{id, num, type, topic, answer, animatable, viz_type, tier, summary}`

### 关 B · 物理推导（**单 agent 默认；与官方答案不一致才升级双 agent**）

发 prompt 给 `general-purpose` agent，要求：
- 不看任何已有解答
- 独立推导
- 给出最终答案

如果与官方一致 → ✅ 单审通过
如果不一致 → 启动第二个 agent 复审，比对差异定夺

### 关 C · 视觉审 ⏭️（**用户授权跳过**）

用户原话："美观问题我相信你的暂时审美"。**不跑视觉审 agent**。

但要继续遵守：
- 3 列布局
- PhysicsPath 颜色 token
- 原题图限高 240px
- 标签用引线白底框

### 关 D · 代码审（**必跑**）

发 prompt 给 agent 静态分析 HTML，检查：
1. 资源路径正确性（`../../../_shared/`、`../../source/images/`）
2. KaTeX 转义符（`\dfrac`、`\;\Rightarrow\;`）
3. drawScene 性能（每帧三角函数密度、Path2D 缓存）
4. 数值积分稳定性（NaN、除零）
5. 时间反转重置正确性
6. originalProblem 完整性
7. 未声明变量、typo

每项 PASS/⚠️ WARN/🔴 FAIL，FAIL 必须修。

---

## 8 · 已知陷阱（Lessons Learned）

> 都是真踩过的坑。每个 bullet 后面是花了多少时间才发现。

1. **WebM 录制背景变橙色**（30 分钟）：`clearRect` 透明背景被播放器渲染成黑底，与场区低 alpha 叠加成纯橙。**修法**：每帧 `fillRect('#fffdf9')` 实底打底。
2. **GIF 编码卡 0%**（20 分钟）：gif.js 的 worker 跨域被浏览器拦。**修法**：`fetch` worker.js 转 blob URL。
3. **KaTeX 中文圆圈 ①②③ 渲染偏移**（10 分钟）：在 `\text{①}` 里基线对不齐。**修法**：用纯英文符号 `(1)` 或干脆不放进 LaTeX。
4. **半正弦力峰值 ≠ 平均值**（蹦床题踩过，30 分钟）：题目说"平均 3000 N"我直接拿 3000 当 sin 的峰值，导致 ∫F dt 严重偏小不满足动量定理。**修法**：F_peak = π/2 × F_avg = 1500π ≈ 4712。
5. **数值积分小 r 时库仑力爆炸**（双粒子题踩过，20 分钟）：r→0 时 1/r²→∞ 速度跳。**修法**：`if(r < 0.05) r = 0.05;` 钳制。
6. **阶段切换容差太粗**（弹性绳滑块踩过）：`|v|<0.01` 在临界点会反复振荡。**修法**：阈值收到 0.001 + 加静摩擦上限判定。
7. **状态变量随 t 反转不重置**（粒子模拟踩过）：用户拖进度条时模块级状态不回退。**修法**：evalState 开头 `if(t<lastT) S={...initial};`。
8. **PathQuestion 配置缺 originalProblem**（多次踩过）：D 关代码审会标 FAIL。**修法**：每题必须传，缺图也要传 `text`。
9. **drawScene 调用 PPath.arrow 但函数没传 opts**（Q8 踩过）：导致 ReferenceError 崩溃。**修法**：所有 sub-draw 函数都要透传 `opts`。
10. **典型物理建模错误的题**（见第 11 节）：抄题数据时尽量用符号；具体数值靠原图填，没原图就标 ⚠️ 待核。

---

## 9 · 添加新题的标准步骤

```
1. cd output/{年份}_{卷别}
2. mkdir -p source/images source/unpacked questions
3. 从 17-24物理 文件夹拷 docx → unzip 到 source/unpacked
4. cp source/unpacked/word/media/*.{png,wmf} source/images/
5. 写 source/extract.py（标准模板见 2025_陕晋宁青/source/extract.py）
6. 跑 python source/extract.py → 得 full_text.md + paragraph_index.json
7. 阅读 full_text.md，识别题号 + 答案 + 图引用，写 manifest.json
8. 复制现有题做模板（如 2024_全国甲卷/questions/q03/index.html），
   逐字段改物理逻辑、原题、答案
9. 跑 B + D 两关 agent 审，FAIL 修完再前进
10. 在 AUDIT_LOG.md 加一行
11. 写卷子级 index.html（复制现有模板，改 QUESTIONS 数组即可）
```

### 单题 HTML 模板骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>第 N 题 · 主题</title>
<link rel="stylesheet" href="../../../_shared/q-shell.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body>
<div id="app"></div>
<script src="../../../_shared/q-shell.js"></script>
<script>
// 物理常数 + 状态
let lastT_qNN = 0;
const S_qNN = {/* 初始状态 */};

function evalState(t){
  if(t < lastT_qNN){ Object.assign(S_qNN, /* initial */); lastT_qNN = 0; }
  // 数值积分
  lastT_qNN = t;
  return {phase: ..., ...S_qNN};
}

function drawScene(ctx, view, state, t, opts){
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(0, 0, view.w, view.h);
  // ... 自定义绘制
}

PathQuestion({
  // ... 配置
});
</script>
</body>
</html>
```

---

## 10 · 当前进度（**滚动更新**）

详见 `AUDIT_LOG.md`。

| 卷子 | 状态 | 题数 |
|---|---|---|
| 2025 陕晋宁青卷 | ✅ 完成 | 13/14（Q5 跳过纯公式） |
| 2024 全国甲卷 | ✅ 完成 | 12/12 |
| 其他 2024 19 份 | ⏳ 待做 | — |
| 2017–2023 ~90 份 | ⏳ 待做 | — |

---

## 11 · 已记录的学术争议

> 后人接手时，遇到这几道题要特别小心，下面是已知的物理争议或我抄题瑕疵。

### 真争议（物理本身）

**11.1 · 2024 全国甲卷 Q12（金属棒+磁场+电容）**
- 第 (1) 问：`P_F = 2P_R` 时求 v
- 严格推导（F 恒定 = `B²L²v₀/R`，P_F = `F·v`，P_R = `B²L²v²/R`）：联立得 **v = v₀/2**
- 部分标准答案给 **v = v₀/√2**（推导细节存疑，可能源于不同的"功率"定义）
- 当前页面采用 **v = v₀/2** 并在 originalProblem 里说明
- 待核：原题完整 docx 公式图（`image113.wmf`、`image114.wmf`）

**11.2 · 2025 陕晋宁青卷 Q7（横波·振动图求波形）**
- 答案 AD 一致
- 但 a-b 距离比例：当前页面 `5λ/12 与 7λ/12`；agent 推导 `3λ/4 与 1/4`
- 都满足 `比例 a→b + 比例 b→a = 1`，但具体值依赖原振动图标注
- 看不到原图细节（image64.wmf 等是公式不是图），**动画波形可能不完全准**，但选项判断不影响

### 抄题/数据错（已修，留此告诫）

| 题 | 我之前的错 | 正确 |
|---|---|---|
| 陕西卷 Q6 | 焦耳热比 1:2（manifest）/ 2:1 | 4:3（双 agent 抓到） |
| 陕西卷 Q12 | 编 V₂=1.05V₁、T₂=360K | 去掉具体数字，符号化 |
| 2024 Q11 | 时间 t=42 s | t=41 s（与 x=680 m 反推一致） |
| 2024 Q7 | 半正弦 F_peak = 3000 N | F_peak = 1500π ≈ 4712 N |
| 2024 Q10 | 定标点 (20%, 1.55V) → V=1.50 给 18% | (20%, 1.65V) → V=1.50 给 17% |

**经验**：抄数值之前先核动量/能量守恒。

---

## 12 · 给下一个对话框的开场白

> 复制这段贴进新对话框：

```
我接管 PhysicsPath 高考物理动画讲义项目。请先读三个文件：

1. C:\Users\60507\physics_anim\output\STANDARD.md         （本文件）
2. C:\Users\60507\physics_anim\output\AUDIT_LOG.md        （滚动审核日志）
3. C:\Users\60507\physics_anim\output\_shared\design-system\README.md   （PhysicsPath 品牌指南）

读完后概括给我听：
- 3 列布局规则
- 四关 agent 审核流程
- 当前已完成的卷子
- 已知 2 个学术争议

然后告诉我你打算从哪份卷子继续做（建议优先级：2024 新课标 → 2024 北京 → 2024 山东 → 2024 广东 → ...）。
```

---

## 13 · 不破坏的红线

- ❌ 不要修改 `_shared/q-shell.css` 的核心 layout 规则（3 列、原题图限高 240px）
- ❌ 不要把硬编码 hex 写进新页面（用 `--ppath-*` token）
- ❌ 不要在 KaTeX 里塞 `①②③` 中文圆圈
- ❌ 不要跑 C 视觉审 agent（用户授权跳过）
- ❌ 不要用 emoji
- ❌ 不要用蓝色霓虹/紫色 SaaS 配色
- ❌ 不要 `clearRect`（要 `fillRect('#fffdf9')`）
- ❌ 不要在 D 关代码审有 FAIL 时就提交，必须修
- ❌ 不要在 manifest 里编具体数字。看不到原图就用符号，并在 AUDIT_LOG 标 ⚠️ 待核

---

**最后更新**：本文件由当前对话产出。下次对话框可以直接 Edit 这个文件追加章节。

---
