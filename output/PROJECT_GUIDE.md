# PhysicsPath · 项目总览（接手必读）

> **接手的下一个对话必须先读完整篇再动手。任何"我以为这样可以"的偏差都会触发返工。**
> 本文档是项目状态 + 操作规范 + 子代理用法 + 禁忌的统一入口。
> 配套文档：`2024_QUEUE.md`（详细进度）、`AUDIT_LOG.md`（审核日志）、`STANDARD.md`（HTML 模板）、`HANDOFF.md`（历史交接）。

---

## 1. 这是什么项目？

**PhysicsPath（物理路径）**：把中国高考物理真题转成可在网页上播放的"动画讲义"题库。

- 核心价值：把抽象题目变成"看得见的物理"。学生点开题目 → 看 Canvas 2D 动画演示 → 配 KaTeX 公式 → 配标准答案。
- 形态：每道题是一个独立 HTML（Canvas + JS），通过 React SPA 入口聚合呈现。
- 仓库：`https://github.com/goose1018/physicspath-exam-library`（私有）
- 用户：高中生 / 物理老师 / 自学者
- 商业模型：基础题免费，难题（`paid: true`）付费

---

## 2. 文件 / 网站 / 目录在哪？

### 2.1 本地路径

```
C:/Users/60507/physics_anim/
├── CLAUDE.md                   # 项目级 Claude 规则（铁律 1+2 必读）
└── output/                     # 所有上线产物
    ├── index.html              # 网站主页入口（用户访问的就是这个）
    ├── exams.jsx               # 数据中枢：REAL_PROBLEMS + PROBLEM_META
    ├── exam-pages.jsx          # PaperDetail 页（卷子详情）
    ├── paper-list.jsx          # V1 卡片列表组件
    ├── _shared/
    │   ├── q-shell.css         # 题目壳样式
    │   └── q-shell.js          # 题目壳逻辑（PathQuestion API）
    ├── 2024_全国甲卷/
    │   ├── questions/q01-q12/index.html
    │   └── source/images/...
    ├── 2024_新课标卷/  ← 12 题
    ├── 2024_北京/      ← 16 题（q06/12/13/14/17 已删/跳过）
    ├── 2025_陕晋宁青/  ← 13 题（q05 跳过）
    ├── 2025_全国卷/    ← 12 题，q13/q14 待做
    ├── 2024_山东/      ← 4 题（待补审）
    ├── 2024_广东/      ← 1 题（待补审）
    ├── 2024_江苏/      ← 0 题（待办）
    ├── 2024_浙江6月/   ← 0 题（待办）
    ├── PROJECT_GUIDE.md    # 本文件（项目总览）
    ├── 2024_QUEUE.md       # 进度+方法论（细则）
    ├── AUDIT_LOG.md        # 4 关审核日志（每道题一行）
    ├── STANDARD.md         # HTML 模板规范
    └── HANDOFF.md          # 跨对话交接（历史 bug 数据库）
```

### 2.2 网站访问位置

- **本地预览**：用浏览器直接打开 `C:/Users/60507/physics_anim/output/index.html`
- **GitHub Pages**（如启用）：仓库 `Settings > Pages` 配置后访问 `https://goose1018.github.io/physicspath-exam-library/output/index.html`
- 主页结构：年份 → 卷型 → 题目卡片网格 → 点击进 PaperDetail → 题目 iframe 嵌入

### 2.3 题目数据源 DOCX

`C:\Users\60507\Desktop\17-24物理\` 下按年份组织：
- `2024·高考物理真题/` — 各省市卷
- `2017-2023·高考物理真题/` — 全国 I/II/III + 新课标

DOCX 已含解析图（image1.png、image2.wmf 等）。WMF 图通常是公式截图，不能直接显示 — 需要重画 KaTeX。

---

## 3. 在做啥 / 待做啥

### 3.1 已完成（截至最新）

| 卷子 | 题量 | 4 关审核状态 | Commit |
|---|---|---|---|
| 2024 全国甲卷 | 12/12 | 第一轮过 ✅（合并 agent 时期，未必可信）| `0bf8ff3` |
| 2024 新课标卷 | 12/13 | 真 4 关 ✅（q10 已删）| `9f65f1b` |
| 2024 北京卷 | 16/22 | 真 4 关 ✅ 修 7 视觉 bug | `ed9d6e0` |
| 2025 陕晋宁青卷 | 13/14 | 真 4 关 ✅ 修 Q12-Q13 | `27b471e` |
| 2025 全国卷 | 12/14 | Q1-Q2/Q12 真独立 4 agent ✅；Q3/Q5/Q8 已修 bug；Q6 已修；Q4/Q7/Q9/Q10/Q11 已独立审过 | `df7ebf2` `39778ac` |

### 3.2 待办优先级

按用户指令"先把近年来的全国卷处理完 再进行地方卷处理"：

1. **当前**：完成 2025 全国卷剩 Q13、Q14（按官方答案题号顺序）
2. **下一步**：2017-2023 全国卷
   - 2023 全国甲、乙；新课标 I、II（4 卷各 ~14 题）
   - 2022 全国甲、乙；新课标（3 卷）
   - 2021 全国甲、乙；新课标（3 卷）
   - 2020 全国 I/II/III
   - 2019 全国 I/II/III
   - 2018 全国 I/II/III
   - 2017 全国 I/II/III
3. **再次**：补审历史欠账（之前疑似作假的）
   - 2024 全国甲 12 道（合并 agent 审，需用真 4 agent 重审）
   - 2024 山东 4 道、2024 广东 1 道
4. **最后**：2024 剩余地方卷（湖北/湖南/江苏/浙江 1+6 月/上海/安徽/江西/海南/广西/福建/贵州/重庆/辽宁/甘肃）

---

## 4. 怎么做 — 4 关审核工作流（最高优先级）

每生产或修复一道题，**必须** 用 **4 个独立 sub-agent**（绝不合并）通过 4 关审核：

### A 关 · 题目识别
- **目的**：从 DOCX 抽题，校验 paperTitle/eyebrow/title/meta/text/subQuestions/officialAnswer 是否完整、合规
- **prompt 要点**：仅检查题面元数据，不评判物理/视觉/代码
- **产出**：✅/❌ + 问题清单

### B 关 · 物理推导
- **目的**：独立推导物理一遍，与代码对照
- **prompt 要点**：把题面给 agent，让其独立推导，再与代码 evalState/常量对比
- **判定**：单审默认；推导 ≠ 官方 → 触发双审（开第二个独立 agent）
- **产出**：✅/❌ + 数学步骤验证

### C 关 · 视觉直觉（必须跑）
- **目的**：drawScene 是否符合**客观物理直觉**（不评判美观）
- **prompt 要点**：检查方向、几何、图形元素位置、动画轨迹是否物理合理
- **历史经验**：合并 agent 漏掉过 5 个严重 C 关 bug（运动员未越杆、圆弧画反、旋转方向反等）→ **必须独立**

### D 关 · 代码审
- **目的**：8 项代码安全/规范/稳定性
- **8 项清单**：
  1. **裸 `<`/`>` 转义** — innerHTML 渲染字段（text/subQuestions/officialAnswer/conclusions.value_text/legend.text）必须 `&lt;`/`&gt;`
  2. **drawScene 第一行 fillRect** — `ctx.fillStyle='#fffdf9'; ctx.fillRect(0,0,W,H);`（防 GIF 重影）
  3. **KaTeX String.raw** — 所有 `formula_tex` / `value_tex` 用 `String.raw\`...\``
  4. **autoplay 默认 true** — q-shell.js 已实现，PathQuestion 不传 `autoplay:false`
  5. **图片路径** — `originalProblem.image: '../../source/images/imageNN.png'`
  6. **数值稳定性** — clamp（如 `r=Math.max(r, 0.05)`）、子步、防除零、防 sqrt 负数
  7. **物理逻辑** — 跳过（B 关已查）
  8. **时间反向** — `if(t < lastT){ reset state }`，或 evalState 用纯函数

### 调度
- A 关先跑（题面是基础）
- B + C + D 可并行（在同一 message 中发 3 个 Agent 调用）
- 每关独立 prompt，绝不合并

### 失败处理
- 任何关 ❌ → 立即修复 → 复审通过的 sub-agent 验证修复
- C 关 / D 关常见 bug 模式见 `HANDOFF.md` 第 III 节

---

## 5. 5 步标准生产动作

### Step 1 · 建 HTML 文件
路径：`output/{paperDir}/questions/qNN/index.html`
- 引 `_shared/q-shell.css` + `_shared/q-shell.js`（相对 `../../../`）
- 引 KaTeX + gif.js + lucide CDN
- `PathQuestion(opts)` 配置全部物理逻辑
- 模板见 `STANDARD.md` + `2024_全国甲卷/questions/q01/index.html`

### Step 2 · 4 关 Agent 审（按本指南第 4 节）

### Step 3 · 注册到 exams.jsx（**必做**）
- 在 `REAL_PROBLEMS` 数组加 entry：
  ```js
  { id:'2025-gk1-qNN', year:2025, paper:'gk1', no:'NN', module:'力学/电磁学/...',
    tplId:null, title:'...', summary:'...', diff:'易/中/难', heat:60-180,
    hasAnim:true, htmlPath:'2025_全国卷/questions/qNN/index.html',
    paid: true(难题付费)/undefined }
  ```
- 在 `PROBLEM_META` 加 `'2025-gk1-qNN': { type:'choice-single|choice-multi|experiment|calc', answer: 'B' or [{sub,val},...] }`
- **不注册则主页看不到题目**（用户已抓到这个 bug）

### Step 4 · AUDIT_LOG 一行
```
2025-{paperDir}-qNN | {title} | A:✅ B:✅(单/双) C:✅ D:✅ | 答案:{ans} | 备注（agent IDs / bug 修复）
```

### Step 5 · git commit + push
- 每完成 N 题做一次（典型 4-12）
- commit 信息：题号、答案、bug 修复、agent 发现的问题
- 推送后报告 commit hash 给用户

---

## 5.5 反作假 Hook（自动化）

PhysicsPath 配置了 PostToolUse:Agent hook，每次 Agent 调用后自动跑 `~/.claude/agent-audit.sh`：
- 追加日志到 `~/.claude/agent_audit.jsonl`
- 计算本会话累计 Agent 调用次数
- 注入 reminder 到 Claude 下一轮上下文（"本会话累计 N 次 + 最近 5 分钟列表 + 铁律 1 提醒"）

**作用**：如果用户要求"4 关审核"但 Claude 只调了 1-2 次 Agent，hook 反馈让 Claude 立刻自己看到违规，自动启动复审。

**详细文档**：[`hooks/README.md`](hooks/README.md)
**脚本副本**：[`hooks/agent-audit.sh`](hooks/agent-audit.sh)
**用户级安装**：脚本在 `~/.claude/agent-audit.sh`，配置在 `~/.claude/settings.json`

---

## 6. 🚨 两条铁律（用户强制，违反 = 欺骗）

### 铁律 1 · Sub-Agent 独立性规则
- **MUST**：4 关审核 = 4 个独立 sub-agent 调用（A/B/C/D 各 1 个）
- **MUST**：可并行启动（同一 message 多个 Agent tool 调用），但每个 prompt 必须独立
- **NEVER**：合并到 1 个 agent 调用跑 4 关（即使为省 token）
- **NEVER**：以 token 节省为由跳过任何独立验证
- **来源**：用户原话「如果用户要求调用子代理 完成多层检查验证 绝对不能为了省 token 合并代理」
- **绑定层级**：项目级 `CLAUDE.md` + 全局 `~/.claude/rules/common/agents.md`
- **实证**：合并 agent 漏掉过 Q3/Q5/Q8/Q12 共 5 个严重视觉 bug，独立 agent 全部抓出

### 铁律 2 · Sub-Agent 测试套件完整性
- **MUST**：sub-agent 跑**完整**测试套件（unit + integration + E2E 全套）
- **MUST**：报告**所有**失败项（不截断、不省略、不仅关键项）
- **MUST**：跑完所有测试才返回（中途有失败也继续到底）
- **NEVER**：跑部分测试就报"完成"
- **NEVER**：测试时间长就跳过 / 缩减
- **NEVER**：选择性报告失败项
- **来源**：用户原话「让 subagent 运行完整的测试套件，并报告所有失败项 必须让子代理运行完所有测试 must 必须」
- **绑定层级**：项目级 `CLAUDE.md` + 全局 `~/.claude/rules/common/testing.md`

---

## 7. 禁忌清单

### 7.1 数据 / 注册类
- ❌ 生产 HTML 但不注册到 `exams.jsx` → 主页看不到（已发生过）
- ❌ 在 `paper` 字段用 PAPERS 中没有的 id（比如 `gk2025`，应用 `gk1` + year=2025 区分）
- ❌ id 命名不一致（必须 `{year}-{paper}-q{NN}`，如 `2025-gk1-q01`）

### 7.2 4 关审核类
- ❌ 合并 4 关到 1 个 agent（**铁律 1**）
- ❌ 假装跑了 agent — 不报告 agent ID
- ❌ 选择性汇报（只报通过的）→ 必须每关都报，包括失败的
- ❌ "C 关跳过"（已废止，C 关必须跑）
- ❌ 测试只跑一部分（**铁律 2**）

### 7.3 代码 / HTML 类
- ❌ 裸 `<`/`>` 在 innerHTML 渲染字段（text/officialAnswer/conclusions.value_text/legend.text）
- ❌ drawScene 没有第一行 fillRect → GIF 重影
- ❌ KaTeX `formula_tex` 不用 String.raw → `\dfrac` 被转义成 `df`
- ❌ Math.random() 在 drawScene 里 → 每帧闪烁（用 `Math.sin(i*1.7)` 等确定性）
- ❌ ctx.arc 角度方向未验证 → canvas y 反向坑（参考 Q5 修复经验）
- ❌ 动画位置不跟随物理对象 → 视觉脱离（参考 Q12 修复）
- ❌ 物理坐标系与 canvas y 反向不一致 → 上下颠倒（参考 Q9）

### 7.4 物理 / 推导类
- ❌ 不独立推导直接相信代码注释 → B 关失败
- ❌ 推导 ≠ 官方答案直接覆写代码 → 必须先双审 + 标记学术争议
- ❌ 圆周方向 / 抛物线方向 / 力箭头方向不验证（C 关必须查）

### 7.5 Git / 上线类
- ❌ 不 push 就告知用户"完成" → 用户网站上看不到
- ❌ commit 信息空泛（如 "fix"）→ 必须详细记录 bug + agent
- ❌ 跳过 hooks（`--no-verify`）/ 跳过签名

---

## 8. 子代理（Sub-Agent）用途速查表

PhysicsPath 项目主要用 `general-purpose` agent，按 prompt 角色分工：

| 角色 | subagent_type | 触发场景 | prompt 要点 |
|---|---|---|---|
| **A 关审查员** | general-purpose | 每题必跑 | 仅查题面元数据（paperTitle/text/subQuestions/answer），不评物理/代码 |
| **B 关审查员** | general-purpose | 每题必跑 | 独立推导物理，与代码对照；推导 ≠ 官方 → 双审 |
| **C 关审查员** | general-purpose | 每题必跑 | 检查 drawScene 视觉是否符合**物理直觉**（不评美观）|
| **D 关审查员** | general-purpose | 每题必跑 | 8 项代码清单（裸 < / fillRect / KaTeX / autoplay / image / 数值 / 时间反向）|
| **复审员** | general-purpose | 每次修复后 | 验证修复后 bug 是否消除 |
| **测试运行** | general-purpose | 必要时 | 跑完整测试套件 + 报告所有失败（**铁律 2**）|

**全局 agents（`~/.claude/agents/`）**：
- planner / architect / tdd-guide / code-reviewer / security-reviewer
- 这些在 PhysicsPath 项目中用得少，但 4 关审查员就是 code-reviewer 的特化用法

**调用模式**：
- 4 关并行：在**单一 message** 内发 4 个 `Agent` tool 调用 → 节省时钟时间
- 关与关串行的依赖：A 关失败时不发 B/C/D（A 是基础）
- prompt 必须独立：每个 agent 自己读题、自己得结论

---

## 9. 历史上学到的"血泪教训"

### 9.1 用户已抓到的 4 大问题
1. **2024-04 假装 ✅** — 合并 agent 时期标 53 道题"已审"但根本没调 agent → 全部回炉真审
2. **数据未注册** — 2025 全国卷 12 道 HTML 生产了但没加 exams.jsx → 主页看不到
3. **合并 agent 漏 bug** — Q3/Q5/Q8/Q12 共 5 个严重视觉 bug，只有真独立 agent 才抓到
4. **测试不完整** — 用户明确要求"必须跑完所有测试报告所有失败项"

### 9.2 几个经典 C 关 bug 模式

| 题号 | bug | 根因 |
|---|---|---|
| 2024-bj-q07 | 圆弧轨道方向反 | xToPx 镜像 X 轴致 anticlockwise 反 |
| 2024-bj-q09 | 弹簧振子 yPhone 方向反 | state.x 物理上为正 + canvas y 向下，要减号 |
| 2024-bj-q15 | 玻璃画半无限介质 | 应是矩形板双折射面 |
| 2024-bj-q18 | 双摆挂在不同点 | 实验装置应同挂点紧靠 |
| 2025-gk1-q03 | 撑杆跳运动员未越杆 | athleteX 计算让人在横杆右侧起跳 |
| 2025-gk1-q05 | 圆弧画到正方形外 | ctx.arc anticlockwise + angle 方向 |
| 2025-gk1-q08 | 旋转方向反 | angle = -π/2+ωt 致 canvas 视觉逆时针 |
| 2025-gk1-q12 | 5px 错位 + 球与 Q 脱离 | drawApparatus 内外坐标不一致 |

### 9.3 几个经典 D 关 bug 模式

| 模式 | 案例 | 修复 |
|---|---|---|
| 裸 `<` 在 innerHTML | conclusion 中 `p_a < p_c` | 改 `&lt;` |
| 缺 fillRect | 多个题 | 加 `ctx.fillStyle='#fffdf9'; ctx.fillRect(0,0,W,H);` |
| Math.random 闪烁 | 星空 / 粒子分布 | 改 `Math.sin(i*1.7)` 确定性序列 |
| 时间反向负 t | `t%T` 为负 | `((t%T)+T)%T` |

---

## 10. 接手 Checklist

下个对话接手时**按顺序读**：

1. ⬜ 读完本文件 `PROJECT_GUIDE.md`（你正在看的）
2. ⬜ 读 `CLAUDE.md`（铁律 1+2 全文）
3. ⬜ **读 `COMMUNICATION_CONTRACT.md`**（沟通契约 — 用户 14 项偏好钉死）
4. ⬜ 读 `2024_QUEUE.md` 第 0、0.5 节（状态 + 工作纪律）
5. ⬜ 读 `AUDIT_LOG.md` 末尾几行（最近的题）
6. ⬜ 用 git log 看最近 5 个 commit（了解最近改了什么）
7. ⬜ 看 todo 列表（user 之前的对话进度）
8. ⬜ **汇报当前状态给用户，等确认才动手**

**严禁不读直接动手 / 不汇报直接动手**。

---

## 11. 联系信息

- 用户：goose1018（GitHub）/ zy18066830375@gmail.com
- 仓库：https://github.com/goose1018/physicspath-exam-library
- 用户母语中文，物理是高考题（不是国际奥赛）

---

**最后更新**：2026-04-29 — 加入两条铁律 + 项目总览
**下次更新**：每完成一卷或加入新规则时
