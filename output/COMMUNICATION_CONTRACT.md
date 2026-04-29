# PhysicsPath · 沟通契约（用户偏好钉死）

> ⚠️ **接手对话第一件事必读**。
> 本文档是用户在多次对话中明确强调过的偏好/态度/汇报方式/禁忌的完整清单。
> /compact 后这些细节可能丢失，所以钉死成永久文档。
> **读完才能动手**。

---

## 0. 用户档案

- 中文母语，工作语言中文（commit message、文档、汇报全用中文）
- 邮箱：`zy18066830375@gmail.com`
- GitHub：`goose1018`
- 项目仓库：`https://github.com/goose1018/physicspath-exam-library`（私有）
- 严肃态度："刀架在脖子上"——对作假行为零容忍

---

## 1. 汇报方式（每完成一题必做）

### 1.1 必须用表格汇报 5 关结果（2026-04-29 起，双 C 关）

```markdown
## 📋 [题号] [标题] 5 关 agent 审核汇报

| 关卡 | Agent ID | 结果 | 详情 |
|------|---------|------|------|
| **A 题目识别** | `axxx...` | ✅/❌ | 关键发现 |
| **B 物理推导** | `axxx...` | ✅/❌ | 推导验证 |
| **C1 视觉几何** | `axxx...` | ✅/❌ | 坐标/方向/形状/原图对照 |
| **C2 视觉冗余** | `axxx...` | ✅/❌ | 多余/误导元素 |
| **D 代码审** | `axxx...` | ✅/❌ | 9 项清单（含变量遮蔽）|

**总判**：✅ PASS / 🟡 WARN / ❌ FAIL（修复后复审通过）
```

### 1.2 汇报必须包含
- ✅ **5 个 agent 的真实 ID**（`tool_use_id`，不能编造；C1/C2 必须不同 ID）
- ✅ 每关具体发现（不能只写"通过")
- ✅ 总判用 ✅/❌/🟡 三档（PASS / FAIL / WARN）
- ✅ 如果有 bug 修复，列出修复内容（带行号）
- ✅ **Hook 审查行（2026-04-29 用户强制加入）**：每次 5 关汇报末尾必须加一行 `Hook 审计：本题 Agent 调用 N 次（含复审）/ 本会话累计 M 次` — 数据来自 PostToolUse:Agent hook 实时注入的 `[Agent Audit] 本会话累计 Agent 调用: M 次` 反馈。用户原话「你汇报的时候要加上 hook 审查结果 用来检查 agent 是不是确实调用了」 — 防作假闭环。

### 1.3 引用用户原话用「」括起来

```
用户原话「不能为了省 token 合并代理」 → 这是铁律 1
用户原话「必须让子代理运行完所有测试 must 必须」 → 这是铁律 2
```

不能改写、不能简化、不能省略。

---

## 2. 进度推进（不需等指令）

### 2.1 自动推进规则

- **完成一题 → 立即进下一题**，不需要等用户指令
- 但**每完成一题必须汇报**（按第 1 节格式）
- 用户原话「每次进入下一个问题你就直接进入 无需我的指令 你只是需要在对话框向我汇报」

### 2.2 题目优先级（用户指令）

按这个顺序处理：

1. **当前**：2025 全国卷剩 Q13、Q14
2. **近年全国卷**：2017-2023 全国甲/乙、新课标 I/II
3. **历史欠账补审**：2024 全国甲 12 道、山东 4 道、广东 1 道
4. **2024 地方卷**：湖北/湖南/江苏/浙江/上海/安徽/江西/海南/广西/福建/贵州/重庆/辽宁/甘肃

用户原话「先把近年来的全国卷处理完 再进行地方卷处理」

### 2.3 可以跳过的题型

用户允许跳过：
- ✅ **概念题**（纯理论、无可视化）
- ✅ **所有实验题**（任何实验类题目都直接跳过，不限于电路图）
- ✅ **纯公式推导题**（如 2025 陕晋宁青 q05 德布罗意波长）
- ✅ **加速度计/阿秒光/忆阻器/水果电池**（北京卷 q12-q17 复杂前沿题）

跳过时必须在 AUDIT_LOG 标注 `跳过原因`。

用户原话（2026-04-29 更新）「实验题不需要画图了 遇到实验题直接跳过」
用户原话「概念题无需画图 直接就跳过就行了 不管这个题 有些图你觉得不用画就跳过 不需要画图 不是每个题都值得画大功夫去做的」

---

## 3. 4 关审核（铁律 1，违反 = 欺骗）

### 3.1 5 关 = 5 个独立 sub-agent（绝不合并，2026-04-29 双 C 关升级）

```
A 关 题目识别  → 1 个独立 Agent 调用
B 关 物理推导  → 1 个独立 Agent 调用
C1 关 视觉几何 → 1 个独立 Agent（专审：坐标/方向/形状/原图对照）
C2 关 视觉冗余 → 1 个独立 Agent（专审：多余/误导元素 — 多画、错层、误标）
D 关 代码审   → 1 个独立 Agent 调用
共 5 个 Agent tool 调用，可并行（同一 message 多个调用块），但 prompt 必须独立
```

**为什么双 C 关**：单 C 关容易基于代码逻辑判 PASS 而漏抓视觉冗余/误导。
- 2025 Q8 多余 "O 轨迹圆"（学生误以为是第二个圆环）— 单 C 关漏抓
- 2025 Q12 圆弧圆心位置反（凹向左下 vs 右上）— 单 C 关漏抓
- 双 C 关分工：C1 验证"应有元素是否对"（积极审核），C2 验证"是否有不该出现的"（消极审核），互补

### 3.2 绝对禁令

- ❌ NEVER 合并到 1 个 agent 调用跑 4 关
- ❌ NEVER 用 token 节省理由跳过独立验证
- ❌ NEVER 假装跑 agent（必须真调，agent ID 用户能用 hook 审计）
- ❌ NEVER 选择性汇报（只报通过的）

### 3.3 历史血泪教训

实证：**合并 agent 在 PhysicsPath 漏掉了 5 个严重视觉 bug**：
- Q3 撑杆跳 — 运动员从未越过横杆（200px 错位）
- Q5 正方形磁场 — 圆弧画到正方形外下方
- Q8 圆环转动 — 旋转方向反（题目顺时针，画成逆时针）
- Q12 圆弧弹簧 — 5px 错位 + 球与 Q 板视觉脱离
- Q6 V-T 图 — 橙虚线越界画到图框外

**只有真正独立 agent 才抓到的 bug**。这是用户为什么坚持铁律 1 的实证根据。

用户原话「绝对不能为了省 token 合并代理」「你万万不可假装用了 agent 骗我」

---

## 4. 测试套件（铁律 2）

用户原话「让 subagent 运行完整的测试套件，并报告所有失败项 必须让子代理运行完所有测试 must 必须」

### 4.1 调用 sub-agent 跑测试时 prompt 必须包含

```
任务：运行完整测试套件
要求：
1. 运行所有测试（具体命令）
2. 跑完所有测试 — 即使有失败也不要中途退出
3. 报告所有失败项 — 不截断、不省略
4. 输出格式：总数 / 通过 / 失败 + 每个失败的测试名 + 错误信息 + 文件路径
```

### 4.2 绝对禁令

- ❌ NEVER 跑部分测试就报"完成"
- ❌ NEVER 因测试时间长跳过/缩减
- ❌ NEVER 第一个测试失败就停（必须继续到底）
- ❌ NEVER 选择性报告失败项

---

## 5. 4 关审核 C 关具体范围

用户对 C 关的明确要求：

- ✅ 检查 drawScene 视觉是否符合**客观物理直觉**
- ✅ 方向、几何、图形元素位置、动画轨迹是否物理合理
- ❌ **不评判美观**（颜色、字号、排版那种交给我自己审美决定）

用户原话「视觉审核负责检查是否符合客观直觉规律 无需检查美观与否」

---

## 6. 数据 / 网站（容易踩的坑）

### 6.1 必须注册到 exams.jsx

生产 HTML 后**必须**同时改 `output/exams.jsx`：
1. 在 `REAL_PROBLEMS` 数组加 entry（id/year/paper/no/module/title/summary/htmlPath）
2. 在 `PROBLEM_META` 对象加（type + answer）

**不注册则主页看不到题目入口**。

用户已抓到过这个 bug（2025 全国卷 12 道题没注册）。

### 6.2 ID 命名规则

`{year}-{paper}-q{NN}` 格式，例如：
- `2024-gk1-q01`（2024 全国甲卷 第 1 题）
- `2025-gk1-q12`（2025 全国卷 第 12 题，paper id 复用 gk1，靠 year 区分）
- `2024-bj-q22`（2024 北京卷 第 22 题）
- `2025-xgk2-q14`（2025 陕晋宁青即新高考 II 卷 第 14 题）

PAPERS 数组的 paper id 列表：`gk1, gk2, xgk1, xgk2, bj, sh, tj, zj`（不能凭空创造）

### 6.3 网站访问方式

- **本地预览**：浏览器开 `output/index.html`
- **GitHub Pages**（如果开启）：https://goose1018.github.io/physicspath-exam-library/output/index.html

---

## 7. Git 工作流

### 7.1 commit 频率

- 每完成 **N 题（4-12）做一次 commit + push**
- 一卷完成后必 commit
- 修 bug 后立即 commit

### 7.2 commit message 必须详细

记录：题号、答案、bug 修复、agent 发现的问题（含 agent ID）

格式：
```
audit: 真跑 4 关 agent 重审 [卷子名] [N] 道（修 [M] 视觉 bug）

Q[N] [题名]（C 关 agent_id 发现）:
- bug: [具体描述]
- 修: [具体动作]

Q[N+1] ...
```

不能写空泛的 `fix` / `update` / `improve`。

### 7.3 push 后必报 commit hash

每次 push 后给用户报：
> ✅ 推送 `XXXXXXX` — [简短描述]

让用户能去 GitHub 验证。

### 7.4 不许跳过 hooks/签名

`--no-verify` / `--no-gpg-sign` 一律禁止。如果 hook 失败，修根因，不绕过。

---

## 8. 代码风格

### 8.1 题目 HTML 行数

- 200-400 行 OK
- 800 max
- 超过就该拆了

### 8.2 PathQuestion 字段格式

参考 `STANDARD.md` 模板。关键字段：
- `paperTitle / eyebrow / title / subtitle / deliv`
- `originalProblem` { meta, image, text, subQuestions, officialAnswer }
- `phases / stats / conclusions / legend`
- `evalState / drawScene`
- `defaults / fileName`

### 8.3 D 关 8 项清单（必查）

1. 裸 `<` `>` 转义（innerHTML 字段）
2. drawScene 第一行 `ctx.fillStyle='#fffdf9'; ctx.fillRect(0,0,W,H);`
3. KaTeX 用 String.raw
4. autoplay 默认 true
5. image 路径正确
6. 数值稳定（clamp/防除零/防 sqrt 负数）
7. 物理逻辑（B 关已查）
8. 时间反向（evalState 纯函数 或 lastT 重置）

### 8.4 经典 bug 模式

| 类型 | 案例 | 防御 |
|------|------|------|
| 裸 `<` 在 innerHTML | `p_a < p_c` 在 conclusion | 改 `&lt;` |
| 缺 fillRect | 多个题 | drawScene 第一行加 |
| Math.random 闪烁 | 星空/粒子 | 改 `Math.sin(i*1.7)` 确定性 |
| 负 t 模运算 | `t%T` 为负 | `((t%T)+T)%T` |
| canvas y 反向 | 物理 +y vs canvas y | 取负号 |
| ctx.arc 方向 | anticlockwise 参数 | Q5 修过的经验 |

更多见 `HANDOFF.md` III 节。

---

## 9. Hook 配置（已装）

### 9.1 PostToolUse:Agent → agent-audit.sh

每次 Agent 调用后自动跑：
- 写日志到 `~/.claude/agent_audit.jsonl`
- 注入 reminder 到我下一轮上下文（"本会话累计 N 次 + 最近 5 分钟"）
- 用户可 `cat ~/.claude/agent_audit.jsonl` 审计

### 9.2 PreToolUse:Edit|Write → suggest-compact.sh

50 次 Edit/Write 后提醒"考虑 /compact"，让我建议用户在逻辑边界主动压缩。

### 9.3 auto-compact（系统内置）

`autoCompactEnabled` 默认 true，context 快满系统自动压缩。但建议主动 /compact 在更早的逻辑边界。

### 9.4 不许擅自加新 hook 不商量

用户原话隐含态度：**任何全局配置改动必须先经过用户同意**（铁律隐含）。

---

## 10. 接手 / 推进流程

### 10.1 新对话 / compact 后第一件事

按 `PROJECT_GUIDE.md` 第 10 节 Checklist：
1. ⬜ 读 `PROJECT_GUIDE.md`（项目总览）
2. ⬜ 读 `CLAUDE.md`（铁律 1+2）
3. ⬜ **读本文件 `COMMUNICATION_CONTRACT.md`**（沟通契约）
4. ⬜ 读 `2024_QUEUE.md` 顶部状态
5. ⬜ 读 `AUDIT_LOG.md` 末尾几行
6. ⬜ git log 看最近 5 个 commit
7. ⬜ 看 todo 列表
8. ⬜ 才能动手

### 10.2 动手前必汇报当前状态

```
我已读完：
- PROJECT_GUIDE.md ✓
- CLAUDE.md ✓
- COMMUNICATION_CONTRACT.md ✓ ← 本文件
- 2024_QUEUE.md ✓
- AUDIT_LOG.md ✓

当前进度：[最近 commit / 当前题目 / 待办]
我打算：[下一步具体动作]
是否开始？
```

等用户确认后才动手。

---

## 11. 重要 commit 历史（截至 2026-04-29）

| Commit | 内容 |
|--------|------|
| `8ccdb73` | feat(hooks): PostToolUse:Agent hook 反作假闭环 |
| `11c582e` | docs: PROJECT_GUIDE.md 项目总览 |
| `98877ea` | docs: 第二条铁律 — Sub-Agent 测试套件完整性 |
| `39778ac` | fix: Q6 越界 + Q8 旋转方向反 + 第一条铁律写入 |
| `df7ebf2` | fix: 真正 4 agent 独立审核发现 3 道题视觉 bug |
| `9a828a7` | fix: 把 2025 全国卷 12 道注册到 exams.jsx |
| `ebbc501` | feat: 2025 全国卷选择题 Q1-Q8 |
| `ed9d6e0` | audit: 真跑 4 关 agent 重审 2024 北京卷 16 道 |

接手时跑 `git log --oneline -15` 看最新。

---

## 12. 14 项核心偏好速查

1. ✅ 每完成一题完整汇报 4 个 agent ID + 4 关结果（表格）
2. ✅ 不需等指令做完一题直接进下一题，但必须汇报
3. ✅ 引用用户原话用「」括起来
4. ✅ 总判 ✅/❌/🟡 三档
5. ✅ 题目优先级：近年全国卷 > 历史欠账 > 2024 地方卷
6. ✅ 概念题/**所有实验题**/纯公式题可跳过不画图
7. ✅ 美观无需检查，但视觉直觉（C 关）必查
8. ✅ 完成 N 题（4-12）做一次 commit+push，commit 详细
9. ✅ 推送后必报 commit hash
10. ✅ 严肃对待作假行为（"刀架在脖子上"零容忍）
11. ✅ 不许"我以为这样可以"的偏差
12. ✅ 加 hook/skill 必须先商量不擅自动手
13. ✅ 数据必须注册到 exams.jsx（不注册主页看不到）
14. ✅ 视觉直觉用真正 4 个独立 agent（合并 agent 漏 5 个严重 bug）

---

**最后更新**：2026-04-29 — 创建（用户担心 /compact 丢失沟通偏好）
