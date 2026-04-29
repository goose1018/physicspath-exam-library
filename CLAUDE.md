# PhysicsPath 项目 — Claude Code 工作规则

> 这是 PhysicsPath（高考物理动画题库）项目的本地 Claude Code 规则。
> 全局规则在 `~/.claude/rules/common/`。本文件覆盖项目特定的强制约束。

---

## 🚨 第一条铁律 — Sub-Agent 独立性规则（用户强制）

**用户原话**：「如果用户要求调用子代理 完成多层检查验证 绝对不能为了省 token 合并代理」

### 绝对禁令

- ❌ **NEVER** 合并 4 关审核（A 题目识别 + B 物理推导 + C 视觉直觉 + D 代码审）到 1 个 agent 调用
- ❌ **NEVER** 用 1 个"合并 agent 同时跑 4 关"省 token
- ❌ **NEVER** 任何 token 节省理由都不能凌驾于独立 agent 验证之上

### 强制要求

- ✅ 每一关 = 一个独立的 Agent 工具调用（独立 prompt）
- ✅ 4 关审核 = 4 个独立 sub-agent（可并行启动 in single message，但 NOT 合并 prompt）
- ✅ 每完成一道题向用户**完整汇报 4 个 agent 的审核情况**（包括各自 agent ID）
- ✅ 独立性绝对优先于 token 经济

### 为什么这个规则至关重要

实证：合并 agent 在本项目中漏掉了多个严重 bug：
- Q3（撑杆跳）：运动员从未越过横杆（合并 agent 没发现）
- Q5（正方形磁场）：case 3 圆弧画到正方形外下方（合并 agent 没发现）
- Q8（圆环转动）：旋转方向反了，"顺时针"画成"逆时针"（合并 agent 没发现）
- Q12（圆弧弹簧 4 问）：5 像素错位 + Stage 3/4 小球与 Q 视觉脱离（合并 agent 没发现）

只有真正的 4 个独立 agent 才能用各自专注的视角抓出这些问题。

### 违反此规则的后果

**等同于欺骗用户**。用户已多次明确强调：
- 「你万万不可假装用了 agent 骗我」
- 「每一道题处理完 都需要向我汇报你的四个 agent 审核情况」
- 「必须调用所有 subagent 一起工作」

---

## 4 关审核标准（PhysicsPath 项目）

每生产或修复一道题，必须通过 4 关独立审核：

| 关 | 名称 | 内容 |
|---|------|------|
| A | 题目识别 | paperTitle/eyebrow/title/meta/text/subQuestions/officialAnswer 是否合规 |
| B | 物理推导 | 独立推导一遍，与代码对照；公式、数值、量纲一致 |
| C | 视觉直觉 | drawScene 是否符合客观物理直觉规律（不评判美观）|
| D | 代码审 | 8 项清单：裸 < 转义 / fillRect 第一行 / KaTeX String.raw / autoplay / image 路径 / 数值稳定 / 物理逻辑 / 时间反向 |

---

## 数据注册铁律

生产 HTML 题目文件后，**必须**同时注册到 `output/exams.jsx`：
1. 在 `REAL_PROBLEMS` 数组中加入 entry（id/year/paper/no/module/title/summary/htmlPath）
2. 在 `PROBLEM_META` 对象中加入元数据（type + answer）
3. 不注册则主页网站看不到题目入口（用户已发现这个 bug）

---

## Git 工作流

- 每完成 N 道题（典型 4-12 道）做一次 commit + push
- commit 信息要详细记录：题号、答案、bug 修复、agent 发现的问题
- 推送后立即向用户报告 commit hash

---

## 工作纪律

- 不假装跑 agent — 必须真调用，必须报告 agent ID
- 不省略汇报 — 每道题必须汇报完整 4 关结果
- 不合并 agent — 严格遵守上面的铁律

---

## 🚨 第二条铁律 — Sub-Agent 测试套件完整性规则（用户强制）

**用户原话**：「让 subagent 运行完整的测试套件，并报告所有失败项 必须让子代理运行完所有测试 must 必须」

### 绝对要求

- ✅ **MUST** 让 sub-agent 运行**完整**测试套件
- ✅ **MUST** sub-agent 报告**所有**失败项（不只前几个、不仅关键项、不截断）
- ✅ **MUST** sub-agent 必须**跑完所有测试**才能返回（不允许中途退出）
- ✅ **MUST** 输出明确：总数/通过数/失败数 + 每个失败项详情

### 绝对禁令

- ❌ **NEVER** 让 sub-agent 跑部分测试就报"完成"
- ❌ **NEVER** 因测试时间长跳过 / 缩减
- ❌ **NEVER** 第一个测试失败就停（必须继续到底）
- ❌ **NEVER** 选择性报告失败项

### 调用 sub-agent 跑测试的 prompt 必须包含

```
任务：运行完整测试套件
要求：
1. 运行所有测试（具体命令）
2. 跑完所有测试 — 即使有失败也不要中途退出
3. 报告所有失败项 — 不截断、不省略
4. 输出格式：总数 / 通过 / 失败 + 每个失败的测试名 + 错误信息 + 文件路径
```

### 为什么这个规则至关重要

- 测试是真理的最后一道防线
- 部分测试报告会让你以为代码 OK，但隐藏的失败可能在生产中爆炸
- 用户已多次警告"不可假装"，sub-agent 不跑完所有测试就是另一种形式的假装

**违反此规则等同于欺骗用户**。在所有项目中遵守。

---

## 同步绑定

两条铁律也写入全局规则：
- `~/.claude/rules/common/agents.md` — Sub-Agent 独立性规则
- `~/.claude/rules/common/testing.md` — Sub-Agent 测试套件完整性规则

跨项目都生效。
