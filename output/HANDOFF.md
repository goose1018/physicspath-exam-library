# 接力文档 · 给下一个对话框

> **这是一份完整的工作流交接文档。** 你（下一个对话框）开工前必须把这整份读完。读完后用一句话向用户复述以下五件事，证明你看懂了：(1) 目录结构、(2) React SPA 与独立 HTML 的关系、(3) 四关 agent 审核职责分工、(4) 每题完成后必跑的 3 步收尾、(5) 红线清单。复述对了再动手。

---

## 0 · 立刻确认的环境上下文

```
工作机：     Windows 11 中文（Microsoft YaHei 默认）
用户账号：   60507 / GitHub 账号 goose1018
仓库：       https://github.com/goose1018/physicspath-exam-library （PRIVATE）
本地路径：   C:\Users\60507\physics_anim\
入口文件：   output/index.html （是 React SPA）
HTTP 服务： python -m http.server 8765 （需要在 output/ 目录起，浏览器走 http://localhost:8765/）
DOCX 源：   C:\Users\60507\Desktop\17-24物理\{年份}·高考物理真题\
            C:\Users\60507\【2025新版】高考物理真题（持续更新）\
gh CLI：     已装 + 已登录（goose1018，token scopes: gist/read:org/repo）
git config： user.name=goose1018, user.email=60507@users.noreply.github.com（已设过）
```

**第一步必做**：起 HTTP 服务器，否则 React SPA 会因 file:// 协议下 Babel 不能 fetch 本地 .jsx 而白屏。

```bash
cd /c/Users/60507/physics_anim/output
python -m http.server 8765 &    # 后台启
# 浏览器访问 http://localhost:8765/index.html
```

---

## 1 · 项目背景（一句话能说清）

把 **2017–2025 年中国高考物理真题（解析版 DOCX）转成可动画讲义网页**，每题：

- 左侧：原题题面 + 原题图（来自 DOCX）
- 右侧：我们手写的 Canvas 动画（不是模板生成的）
- 底部：KaTeX 公式 + 老师讲解提示
- 可下载：PNG / GIF / WebM 素材（老师塞 PPT 用）
- 全部经过四关 agent 审核

外部 design 团队（goose1018/agentteaching 那个项目的同班子）提供了一个 **React SPA 外壳**（路由：home/library/paper/problem/workshop/ai），我们的工作是往里**填内容**而不是改外壳。

**当前进度**：
- 2025 陕晋宁青卷：13/14（Q5 跳过纯公式）
- 2024 全国甲卷：12/12

剩下 ~110 份卷子待做。

---

## 2 · 目录结构（**必须背下来**）

```
C:\Users\60507\physics_anim\output\
│
├── index.html                       ← React SPA 入口（外部 design 提供，**别改**）
├── app.jsx                          ← 主 App 路由
├── exams.jsx                        ← ★ YEARS / PAPERS / PROBLEMS + REAL_PROBLEMS（你要往里加）
├── exam-pages.jsx                   ← ProblemDetail 已加 htmlPath iframe 分支
├── pages.jsx, templates.jsx,
├── stages.jsx, params.jsx,
├── tweaks-panel.jsx                 ← 设计师调色面板
├── styles/
│   ├── ppath-tokens.css            ← PhysicsPath 设计令牌
│   ├── app.css, exam.css           ← React app 样式
│
├── STANDARD.md                      ← 13 章节标准（颜色/字体/布局/红线/PathQuestion API/陷阱）
├── AUDIT_LOG.md                     ← 25 题已审核记录（继续在这儿加行）
├── HANDOFF.md                       ← 本文件
│
├── _shared/                         ← 独立 HTML 共享资源
│   ├── design-system/               ← PhysicsPath 设计系统（外部 zip，**别改**，**.gitignore 排除**）
│   ├── q-shell.css                  ← ★ 单题页 CSS 框架（3 列布局 + KaTeX + 注释条）
│   └── q-shell.js                   ← ★ 单题页 JS 框架（PathQuestion 类 + GIF/WebM/PNG 录制）
│
├── 2024_全国甲卷/
│   ├── source/                      ← DOCX 提取产物（不进 git）
│   │   ├── extract.py              ← 标准提取脚本（python-docx）
│   │   ├── full_text.md            ← 提取的 markdown（带 ![](imageN.png) 锚点）
│   │   ├── images/                 ← .png/.wmf 图（**.gitignore 排除**）
│   │   └── unpacked/               ← DOCX 解包原文件（**.gitignore 排除**）
│   ├── manifest.json                ← Agent A 产物：题目分级清单
│   ├── index.html                   ← 卷子级首页（备用直链，可不点）
│   └── questions/q01..q12/index.html ← ★ 12 题独立 HTML
│
├── 2025_陕晋宁青/
│   └── （同结构，13 题）
│
└── 2025_全国卷/                    ← 仅识别完成，题未做
    └── （只有 manifest.json + source/）
```

**关键约定 — 路径深度**：

题目页 `output/{paper}/questions/qNN/index.html` 引用资源时是三级回溯：

```html
<link rel="stylesheet" href="../../../_shared/q-shell.css">
<script src="../../../_shared/q-shell.js"></script>
<!-- 原题图 -->
<img src="../../source/images/imageN.png">
```

写错路径会 404，**这是新人最容易犯的错**。

---

## 3 · React SPA 与独立 HTML 的关系（**新人必懂**）

```
                ┌─────────────────────────────────┐
                │     React SPA (index.html)       │
                │                                  │
                │     真题图库 (library 路由)        │
                │       ↓ 点某道题                  │
                │     ProblemDetail                 │
                │       ┌───────┬───────────────┐  │
                │       │ 左:   │ 右:           │  │
                │       │ 题干   │ <iframe       │  │
                │       │ 摘要   │   src=        │  │
                │       │ 已知量 │   htmlPath/>  │  │
                │       └───────┴───────────────┘  │
                └─────────────────┬────────────────┘
                                  │ iframe 加载
                                  ▼
        ┌──────────────────────────────────────────────┐
        │ 独立 HTML (questions/qNN/index.html)           │
        │                                               │
        │  引用 _shared/q-shell.{css,js}                │
        │  调用 PathQuestion({ ... })                  │
        │  渲染 3 列布局：原题 | Canvas 动画 | 控制      │
        │  Canvas 自己画（KaTeX/Lucide/PPath helpers）  │
        └──────────────────────────────────────────────┘
```

**两层各管各的**：
- **React SPA**：路由 / 题库分页 / 顶栏 breadcrumb / paywall / 导出按钮（这层用户外部 design 团队管，**别改**）
- **独立 HTML**：物理建模 / Canvas 绘制 / 实时数据面板（**你的战场**）

**接入新题只需改 2 个地方**：
1. 新建 `output/{paper}/questions/qNN/index.html`
2. 在 `output/exams.jsx` 的 `REAL_PROBLEMS` 数组**末尾追加**一条 entry，含 `htmlPath`

参考 `2024_全国甲卷/questions/q03/index.html` 是个好模板。

---

## 4 · 四关 agent 审核（**强制 + 顺序固定 + 每题都跑**）

每完成一题，**这四关按顺序跑**。任何一关 FAIL 必须修，修完再前进。

```
┌────────────────────────────────────────────────────────────┐
│  关 A · 题目识别            (人工 + 单 agent，可合并)         │
├────────────────────────────────────────────────────────────┤
│  关 B · 物理推导            (单 agent；不一致升级双 agent)    │
├────────────────────────────────────────────────────────────┤
│  关 C · 视觉审              (用户授权跳过 ⏭)                 │
├────────────────────────────────────────────────────────────┤
│  关 D · 代码审              (单 agent，每题强制)              │
└────────────────────────────────────────────────────────────┘
```

### 4.1 · 关 A · 题目识别

**职责**：从 DOCX 提取题面、图、官方答案 → 写进 `manifest.json` 和 `originalProblem`。

**怎么跑**：

```bash
# 1. 解包 DOCX
cd output/{paper}/source
mkdir -p unpacked images
unzip -o "C:/Users/60507/Desktop/17-24物理/{年份}·高考物理真题/{文件名}.docx" -d unpacked/
cp unpacked/word/media/*.png images/ 2>/dev/null
cp unpacked/word/media/*.wmf images/ 2>/dev/null

# 2. 标准提取脚本（参考 2024_全国甲卷/source/extract.py）
python source/extract.py
# 产出 full_text.md + paragraph_index.json
```

接着读 `full_text.md`，识别每道题的：
- 题号、类型（单选/多选/实验/计算）、分值
- 题干、子小问、官方答案
- 涉及哪些图（`![](imageN.png)` 锚点）
- 分级 tier（S 静态 / A 动画 / B 复杂动画双审 / X 跳过纯公式）

写进 `output/{paper}/manifest.json`（schema 见现有 manifest）。

### 4.2 · 关 B · 物理推导（**最关键**）

**职责**：独立验证你给出的答案是否符合物理。**不准让 agent 看你已有的答案**。

**默认单 agent**。如果 agent 推导结果与官方答案一致 → ✅ 通过。如果不一致 → 启动**第二个 agent** 复审，比对差异定夺。

**Agent prompt 模板**：

```
独立验证 [年份] [卷别] 第 N 题。**不要假设已有任何解答**，请从零推导。

题目：[完整题面，能用 ASCII 表达就用 ASCII，复杂图用文字描述]
[选项 A/B/C/D 或子小问 (1)(2)(3)]

官方答案：[只在最后一行给，让 agent 先独立推导]

请独立分析：
1. [给出关键物理量列表]
2. [指出可能的解题路径]
3. 每个选项 ✓ / ✗ 论证
4. 如果与官方不一致，明确指出差异

报告 ≤ N 字。
```

**调用方式**（用 Agent tool，subagent_type 用 general-purpose）：

```
Agent({
  description: "X卷 QN 物理审",
  subagent_type: "general-purpose",
  prompt: "<上面的模板>"
})
```

**重要陷阱**（看 STANDARD.md 第 8 节）：
- 不要在 prompt 里把官方答案放在题面之前 → agent 会"先入为主"
- 数值题让 agent 给具体数字，能比对
- 如果你抄题数据可能错（DOCX 中数值是 .wmf 图无法直接读），让 agent 用符号表达

### 4.3 · 关 C · 视觉审（**跳过**）

**用户原话**："美观问题我相信你的暂时审美。"

**不跑视觉审 agent**。但要继续遵守：
- 3 列布局
- PhysicsPath 颜色 token（`--ppath-*`，禁蓝色霓虹/紫色 SaaS）
- 原题图限高 240px
- 标签用引线白底框（`PPath.label`）

### 4.4 · 关 D · 代码审（**每题强制**）

**职责**：静态分析新写的 HTML，找 bug、性能问题、KaTeX 错。

**Agent prompt 模板**：

```
代码审查 [文件绝对路径]

检查：
1. 资源路径正确性（../../../_shared/ 三级回溯；../../source/images/ 两级回溯）
2. KaTeX 转义符（\dfrac、\sqrt、\;\Rightarrow\;、String.raw 包裹）
3. drawScene 性能（每帧三角函数密度、Path2D 是否缓存）
4. 数值积分稳定性（NaN、除零、小 r 时库仑力爆炸）
5. 时间反转重置正确性（t < lastT 时 state 复位）
6. originalProblem 完整性（meta + image + text + subQuestions + officialAnswer）
7. 未声明变量、未定义函数引用、typo
8. 状态机阶段切换容差是否合理（不要用 ===）

每项给 PASS / ⚠️ WARN / 🔴 FAIL + 具体问题（**不需修复，只指出**）。
报告 ≤ 350 字。
```

**FAIL 必须立刻修**。WARN 记录在 AUDIT_LOG 但不阻塞。

**已知 D 关常见 FAIL**（已在 STANDARD.md 第 8 节"已知陷阱"详列）：
- KaTeX 中文 ①②③ 在 `\text{}` 偏移
- WebM 录制透明背景变橙色 → 必须 fillRect 米黄实底
- 数值积分小 r 库仑力爆炸 → 钳制 r > 0.05
- 阶段切换容差太粗（0.01 → 收到 0.001）
- 缺 originalProblem 字段
- drawScene 调用 PPath.arrow 但子函数没透传 opts
- 半正弦力峰值 ≠ 平均值（蹦床类）

### 4.5 · 并行调度技巧

**多题同时审时并行调用 agent**（一条消息里发多个 Agent 工具调用，不要串行）：

```
[同一条消息中]
Agent({description: "Q01 物理审", ...})
Agent({description: "Q02 物理审", ...})
Agent({description: "Q01 代码审", ...})
Agent({description: "Q02 代码审", ...})
```

并行能省 50%+ 时间。但单题内 B → D 顺序还是先后跑（D 关有时依赖 B 的结论）。

---

## 5 · 每题完成后的 3 步收尾（**雷打不动**）

每题做完（含四关审核通过、FAIL 修完），**立刻执行**：

### 步 1 · 在 `exams.jsx` 的 `REAL_PROBLEMS` 末尾追加 entry

```js
{ id:'2024-bj-q03', year:2024, paper:'bj', no:'3', module:'力学', tplId:null,
  title:'某某题主题',
  summary:'30 字以内的概要',
  diff:'易/中/难',
  heat:80,                      // 数字越大越热门，乱写也行
  hasAnim:true,
  htmlPath:'2024_北京卷/questions/q03/index.html',
  paid:true                     // B 级题加这行（用户付费才能看动画）
}
```

**id 命名规范**：`{年份}-{paperId}-q{两位题号}`，paperId 看 PAPERS 数组。

### 步 2 · 在 `AUDIT_LOG.md` 加一行四关记录

模板（在对应卷子表格中加一行）：

```markdown
| Q03 题目主题 | ✅ | ✅ | ✅ | ⏭️ | 答案 X；原 FAIL（缺 R0 元件）已补 |
```

如果有争议或 WARN，写在备注列。

### 步 3 · git commit + push

**每题一个 commit**（颗粒度细，便于回滚和审计）：

```bash
cd /c/Users/60507/physics_anim
git add output/{paper}/questions/qNN/index.html
git add output/exams.jsx
git add output/AUDIT_LOG.md
git -c commit.gpgsign=false commit -m "$(cat <<'EOF'
{Year}-{Paper} Q{NN}: {题目主题}

四关审核：A ✅ B ✅ D ✅ C ⏭
关键修复：[列 D 关 FAIL 的修复，没就写"无"]
原题：image{NN}.png
答案：{选项 / 数值}
EOF
)"
git push origin main
```

**完整一题的卷一份卷子**做完，再追一个 paper-level commit：

```
{Year}-{Paper}: 全卷 NN/NN 题完成 + paper-level index
```

### 边角情况

- **修旧题**：`fix({Year}-{Paper}-Q{NN}): {简述}`，commit 单个文件
- **改 React SPA 数据**：`data: 加 N 题到 exams.jsx`
- **修共享框架**：`shared: q-shell.{js,css} {改动}`
- **改 STANDARD/AUDIT_LOG**：`docs: ...`

**禁止用 `--no-verify` 跳 hook**。**禁止 `--amend` 已 push 的 commit**。**push 用 https，认证由 gh 自动接管**。

---

## 6 · 不破坏的红线（**违反一律 revert**）

详见 STANDARD.md 第 13 节，这里抄一遍核心：

- ❌ 不要修改 React SPA 入口 (`output/index.html`、`app.jsx`、`pages.jsx`、`templates.jsx`、`stages.jsx`、`params.jsx`、`tweaks-panel.jsx`)。这是外部 design 团队的产物。**只能往 exams.jsx 的 `REAL_PROBLEMS` 加 entry，往 exam-pages.jsx 的 ProblemDetail 加 htmlPath 分支**（已加好，别再动）。
- ❌ 不要修改 `_shared/design-system/`（外部 zip 解压，已 .gitignore，别 commit）。
- ❌ 不要把 `source/unpacked/`、`source/images/` 加进 git（涉版权 + 大体积）。
- ❌ 不要在新页面写硬编码 hex 颜色，用 `--ppath-*` token。
- ❌ 不要在 KaTeX 里塞 `①②③` 中文圆圈（渲染偏移）。
- ❌ 不要跑 C 视觉审 agent（用户授权跳过）。
- ❌ 不要用 emoji（中文文档里可，UI 里禁）。
- ❌ 不要用蓝色霓虹 / 紫色 SaaS 配色。
- ❌ Canvas 不要 `clearRect`（透明背景导致 WebM 录制变黑），要 `fillRect('#fffdf9')`。
- ❌ D 关有 FAIL 时不要 commit，必须先修。
- ❌ manifest 里看不到原图就用符号，**绝对不要瞎编具体数字**（陕西卷 Q12 / 2024 Q11 都吃过这个亏，详见学术争议清单）。
- ❌ 不要 force push（`git push -f`），不要 `git reset --hard`，不要重写已 push 的 history。

---

## 7 · 数据流和 Agent 编排（**完整工作流图**）

```
用户："开始处理 2024 北京卷"
   ↓
你 (Claude Code 本对话框)
   │
   ├── ① 解包 DOCX → 生成 source/full_text.md（关 A 一半）
   │
   ├── ② 读 full_text.md → 识别题号、类型、答案、图引用
   │   └─ 单 agent 可选：让 agent 帮你识别题型分级
   │   └─ 写 manifest.json（关 A 完成）
   │
   ├── ③ 选定一题（比如 Q01），写独立 HTML
   │   └─ 复制 2024_全国甲卷/questions/q01/index.html 改物理逻辑
   │   └─ 引用 _shared/q-shell.{css,js}
   │   └─ 调 PathQuestion({ originalProblem, evalState, drawScene, phases, ... })
   │
   ├── ④ 同一条消息并行启动两个 agent (B + D)
   │   ├─ Agent 1: 物理推导（关 B）
   │   └─ Agent 2: 代码审查（关 D）
   │
   ├── ⑤ 等结果回来，看 4 个状态
   │   │
   │   ├─ 关 B 与官方一致？
   │   │  ├─ 是 → ✅ 通过
   │   │  └─ 否 → 启动第三个 agent 复审，2:1 多数决；如仍不一致 → 用 agent 严格推导优先（不盲信官方）
   │   │
   │   ├─ 关 D 有 FAIL？
   │   │  ├─ 否 → ✅ 通过
   │   │  └─ 是 → 立刻修，再跑一次 D 关验证
   │
   ├── ⑥ 4 关全部 ✅ 后做 3 步收尾
   │   ├─ 加 entry 到 exams.jsx
   │   ├─ 加行到 AUDIT_LOG.md
   │   └─ git commit + push
   │
   └── ⑦ 重复 ③-⑥，处理本卷下一题
       │
       └── 一卷做完 → 再 paper-level commit 收尾
```

### 物理推导 agent 不一致时的决策树

```
Agent 推导结果 vs 官方答案
   │
   ├─ 完全一致 → ✅ 通过
   │
   ├─ 数值不同 / 答案不同
   │  │
   │  ├─ 启动第二个 agent 独立推导（不告诉它前一个结果）
   │  │
   │  ├─ 两个 agent 一致，与官方不一致
   │  │  │
   │  │  ├─ 是抄题数据错？→ 改 manifest，重跑（如陕西 Q12 卡车气体）
   │  │  ├─ 是物理本身有歧义？→ 在 originalProblem.officialAnswer
   │  │  │   里写明双方推导，标 ⚠️ 学术争议（如 2024 Q12 v=v₀/2 vs v₀/√2）
   │  │  └─ 是官方答案错？→ 罕见，标 ⚠️ 但保留官方写法，让用户选
   │  │
   │  └─ 两 agent 之间不一致 → 第三 agent 复审，多数决
```

### 加视觉审（如果用户后续要求）

虽然现在跳过，但若用户要求加，protocol 是：

```
启动 headless Chrome → 打开题目 HTML → 截图 → vision agent 审：
1. 是否符合 PhysicsPath 设计令牌？
2. 主图区是否被遮挡？
3. 字体大小可读性？
4. 标签是否正确指向锚点（不重叠）？
5. 颜色对比度（WCAG AA）？
```

---

## 8 · 已记录的学术争议（**新人继续做时别踩同样的坑**）

### 真争议（物理本身）

**8.1 · 2024 全国甲卷 Q12（金属棒+磁场+电容）**
- 第 (1) 问：`P_F = 2P_R` 时求 v
- 严格推导：F = `B²L²v₀/R`，P_F = F·v，P_R = `B²L²v²/R`，联立 → **v = v₀/2**
- 部分标准答案给 **v = v₀/√2**（推导细节存疑）
- 当前页面采用 v₀/2，并在 originalProblem 里说明

**8.2 · 2025 陕晋宁青卷 Q7（横波·振动图求波形）**
- 答案 AD 一致，但 a-b 距离比例：当前页面 5λ/12 与 7λ/12；agent 推 3λ/4 与 1/4
- 看不到原振动图（image 是 .wmf 公式不是图），动画波形可能不准
- 选项判断不影响

### 抄题/数据错（已修，新人警示）

| 题 | 旧错误 | 正确 |
|---|---|---|
| 陕西卷 Q6 | 焦耳热比 1:2 | 4:3（双 agent 抓到） |
| 陕西卷 Q12 | 编 V₂=1.05V₁、T₂=360K | 去掉具体数字，符号化 |
| 2024 Q11 | 时间 t=42 s | t=41 s（与 x=680 m 反推一致） |
| 2024 Q7 | 半正弦 F_peak = 3000 N | F_peak = 1500π ≈ 4712 N（让平均=3000 自洽） |
| 2024 Q10 | 定标点 (20%, 1.55V) | (20%, 1.65V) — 让 1.50V→17% 不是 18% |

**经验教训**：抄数值前先核动量/能量守恒。看不见原图的具体数字 **绝对不要瞎编**，用符号代替。

---

## 9 · 推荐的下一步顺序（按优先级）

```
P0 (高优)：完成 2024 主流卷（剩 19 份）
   1. 2024 新课标 I/II 卷
   2. 2024 北京卷
   3. 2024 山东卷
   4. 2024 广东卷
   5. 2024 江苏卷
   6. 2024 浙江 6 月卷
   7. 2024 河北卷
   8. 其他 12 份地方卷

P1 (中优)：完成 2025 剩余
   - 2025 全国卷（已 manifest 完成，题未做）
   - 2025 北京/山东/广东/江苏/...

P2 (低优)：2017-2023 共约 90 份
   - 优先全国卷 / 新高考 I/II 卷
   - 北京/上海/天津/浙江
   - 其他地方卷

每份卷子约 10-14 题，每题约 1 个交互式回合。完整 2024 全部做完估计 ~150 个回合。
```

**接手时优先做 2024 新课标 I 卷**（最通用，带动其他卷参考）。

---

## 10 · 故障排查 cheat sheet

| 现象 | 原因 | 修法 |
|---|---|---|
| 浏览器白屏 | file:// 协议下 babel 不能 fetch .jsx | 起 HTTP 服务器 |
| iframe 加载失败 | htmlPath 错（路径相对 SPA 不是 jsx） | 用 `2024_全国甲卷/questions/q01/index.html` 不要带 `output/` 前缀 |
| 题目页 404 资源 | 三级回溯路径错 | `../../../_shared/` 不是 `../../_shared/` |
| KaTeX 不渲染 | 没用 `String.raw` | 公式必须 `String.raw\`\dfrac{a}{b}\`` |
| GIF 卡 0% | gif.js worker 跨域 | 已改 fetch + blob URL，应该正常；如不是，检查 CDN 网络 |
| WebM 背景变橙色 | drawScene 用了 clearRect | 改 `ctx.fillStyle='#fffdf9'; ctx.fillRect(0,0,W,H);` |
| 数值积分爆炸 | 小 r 时 1/r²→∞ | 钳 `if(r<0.05) r=0.05;` |
| 阶段切换振荡 | 阈值太粗 | 收到 0.001 + 加静摩擦上限判定 |

---

## 11 · 接手开场白（直接复制贴给用户用）

```
我接管 PhysicsPath 高考物理动画讲义项目，已读完 STANDARD.md / AUDIT_LOG.md / HANDOFF.md。

我了解：
1. 仓库 https://github.com/goose1018/physicspath-exam-library 私有，本地 C:\Users\60507\physics_anim\
2. React SPA（output/index.html）由外部 design 团队提供，我只往 exams.jsx 加 entry，不改 SPA
3. 每题一个独立 HTML（output/{paper}/questions/qNN/index.html），引用 _shared/q-shell.{css,js}
4. 四关审核：A 题目识别 + B 物理（单 agent，不一致升级双 agent）+ D 代码审（每题强制）+ C 视觉跳过
5. 每题完成 3 步收尾：加 entry 到 exams.jsx + 加行到 AUDIT_LOG + git commit
6. 红线：不改 React SPA、不 commit 原图、不用 emoji 蓝色霓虹紫色、不 force push

需要先起 HTTP 服务器才能本地预览：
  cd C:\Users\60507\physics_anim\output
  python -m http.server 8765
  浏览器：http://localhost:8765/index.html

下一步建议：从 2024 新课标 I 卷开始（DOCX 在 C:\Users\60507\Desktop\17-24物理\2024·高考物理真题\）。
要不要我开始？
```

---

## 12 · 突发情况 / 你不知道怎么办时

- **某文件不知道改什么**：先读 STANDARD.md 对应章节
- **物理推导不确定**：双 agent 并行复审，绝不盲信你自己的判断
- **代码 bug 复杂**：让 D 关 agent 给详细分析，不要试图一行一行排查
- **用户改主意要重做**：保留旧版到 `_old_*.bak`，再做新版（用户之前的反馈大多是迭代式的）
- **CDN 挂了**：临时改用 jsdelivr 替代 unpacks（文档第 10 节）
- **被 system reminder 频繁打扰**：维护好 todo list，每完成一题立刻 mark complete
- **token 用量焦虑**：批量做时一条消息发多个 Agent 工具并行调用，最省 token

---

**最后**：这个项目的核心价值是**物理正确性 + 视觉可投屏**。两者都有了，老师才付费。代码再炫如果物理错了直接归零。所以**关 B 物理审是命门，永远不要为了赶进度跳过**。

完。读完后记得用一句话向用户复述上面那 5 件事。

---

## VI. 2026-04-29 新增血泪教训（2023 全国甲卷工作期间）

### Bug 1：JS 变量遮蔽（最严重，4 关全过仍漏）

**症状**：2023 全国甲 Q1 铅球水平向前几乎不下落
**根因**：
```js
const h = 1.8;  // 全局：物理推出高度 m
function drawTrajectory(ctx, X, Y, w, h, state){  // 参数 h 遮蔽全局！
  const pxPerM_y = ch / (h * 1.05);  // h 此时是面板像素高度（≈350），不是 1.8m
  const startY = ground - h * pxPerM_y;
}
```
结果：1.8m × pxPerM_y ≈ 1.4 px，铅球视觉只下落 1 像素。
**修复**：函数参数重命名 `h` → `panelH`。
**教训**：**4 关 agent 都基于代数推理审 PASS，但抓不到 JS 词法作用域陷阱**。从今往后 C/D 关 prompt 必须加「**变量作用域 / 遮蔽检查**」一项，明确扫全局 const vs 函数参数同名冲突。

### Bug 2：KaTeX aligned 多行环境

**症状**：Q12 phases[0] 公式渲染失败
**根因**：q-shell.js 用 `katex.render(..., {displayMode:false})`，不支持 `\begin{aligned}...\end{aligned}` 多行环境
**修复**：改单行 `\quad` 间隔
**教训**：**禁止在 formula_tex 用 aligned/align/cases/gather**（行内模式 KaTeX 不支持）。D 关 prompt 已加这一项检查。

### Bug 3：ctx.arc anticlockwise 错误（历史欠账）

**症状**：2025 全国卷 Q12 圆弧画成大半圆"奇怪盘子"形状
**根因**：`ctx.arc(cx, cy, R, PI/2, PI, true)` — anticlockwise=true 从 PI/2 逆时针走到 PI 经过 270°（大半圆），应为 false（顺时针 90° 小弧）
**修复**：true → false
**教训**：原 commit `df7ebf2` 的 4 关 agent 漏抓。**ctx.arc 的 anticlockwise 参数在 canvas y 翻转坐标系下极易出错**，C 关检查圆弧时必须**心算两端点位置 + 走向**确认。

### Bug 4：运算符优先级冗余

**症状**：Q15 line 230 `progress >= 2 && |tNorm-1|<0.001 || progress === 2` 因 `&&` 优先于 `||`，等价于 `progress === 2`
**修复**：直接简化为 `progress === 2`
**教训**：D 关 prompt 已加「逻辑表达式优先级审查」。

### Bug 5：死代码污染全局命名空间

**症状**：Q15 顶层 `const seg1_t = (P_in_to_BC) => P_in_to_BC.t; const total_t_jia = ...` 三个变量从未被引用
**修复**：删除
**教训**：D 关 prompt 加「未使用全局变量检查」。

---

## VII. agent 审核方法论的根本局限（2026-04-29 新认知）

agent 是基于**代码代数推理**审核，**不真在浏览器跑动画**。所以以下几类 bug 必须靠**用户/作者浏览器实测**才能抓到：

1. **JS 词法陷阱**：变量遮蔽、闭包、this 绑定、作用域链
2. **canvas 视觉细节**：anticlockwise、坐标变换、字体度量、roundRect 兼容
3. **KaTeX 渲染失败**：aligned 环境、displayMode 不匹配、未转义反斜杠
4. **CSS 布局问题**：overflow、z-index、flex/grid

**结论**：commit 前必须**至少手动开浏览器看一眼新做的题**。从今往后 commit 前 todo 列表必加一项「浏览器实测每道新题」。

---
