# 🚀 激活完整工作状态 · 一键咒语

> 新对话窗口 / `/compact` 后，把下面任意一段**复制粘贴**到对话框发给 Claude。
> Claude 会按 Checklist 加载所有上下文，汇报状态，等你确认后开始干活。

---

## 🟢 标准激活咒语（推荐，最稳）

```
继续 PhysicsPath 项目。请按 CLAUDE.md 顶部"接手对话第一件事必读"
的 7 步 Checklist 全部读完：

1. 读 CLAUDE.md（铁律 1+2）
2. 读 output/COMMUNICATION_CONTRACT.md（沟通契约 14 项）
3. 读 output/PROJECT_GUIDE.md（项目总览 11 章节）
4. 读 output/2024_QUEUE.md 顶部状态
5. 读 output/AUDIT_LOG.md 末尾几行
6. 跑 git log --oneline -15
7. 看 todo 列表

读完后向我汇报：
- 当前项目进度（最近 commit、当前题目、待办）
- 你打算下一步做什么
- 是否需要我确认才开始

汇报格式按 COMMUNICATION_CONTRACT.md 第 10.2 节。
```

---

## 🔵 极简激活咒语（信任我已记住流程时用）

```
继续 PhysicsPath。读 CLAUDE.md 后按流程汇报状态再动手。
```

我会自动按规则展开。

---

## 🟡 任务专属激活咒语（直接派活）

```
继续 PhysicsPath，做 [具体任务，例如：2025 全国卷 Q13]。
按 4 关独立 agent 流程，每完成一题完整汇报 4 个 agent ID + 4 关结果。
开始前先读 COMMUNICATION_CONTRACT.md 14 项偏好，确认后动手。
```

---

## 🔴 排错型激活咒语（怀疑 Claude 状态不对时）

```
等等。先停下手上动作。

1. 读 output/CLAUDE.md 全文
2. 读 output/COMMUNICATION_CONTRACT.md 全文（14 项偏好）
3. 检查 ~/.claude/rules/common/agents.md 铁律 1 还在不在
4. 检查 ~/.claude/rules/common/testing.md 铁律 2 还在不在
5. cat ~/.claude/agent_audit.jsonl 看最近你调过几次 Agent

汇报：
- 哪条铁律可能被我违反了
- 你打算怎么纠正
等我确认才继续。
```

---

## 📋 激活后你能验证的 3 件事

激活咒语发完后，看我的回复是否包含：

### ✅ 必含信号（说明状态完整）
1. "我已读完：CLAUDE.md / COMMUNICATION_CONTRACT.md / PROJECT_GUIDE.md / ..."（清单形式）
2. **当前进度概要**：最近 commit hash + 待办题号 + 跳过题列表
3. **下一步具体动作**：不是"我可以做..."而是"我打算做 Q13，按 4 关独立 agent 流程"
4. **等待确认**：句末有 "是否开始？"或 "要不要先 [动作]？"

### ⚠️ 警告信号（说明状态不全）
- 没读 COMMUNICATION_CONTRACT.md → 可能漏掉你 14 项偏好
- 直接动手不汇报 → 违反第 10 节"动手前必汇报"规则
- 用合并 agent 跑多关 → 违反铁律 1
- 假装跑测试不报失败 → 违反铁律 2

发现警告信号 → 用上面"🔴 排错型激活咒语"重置我。

---

## 🔧 三层防御机制（compact 后还在）

```
第 1 层 · Rules（永久 system prompt 注入）
├── ~/.claude/rules/common/agents.md ← 铁律 1
└── ~/.claude/rules/common/testing.md ← 铁律 2

第 2 层 · 项目文档（接手 Checklist 强制读）
├── CLAUDE.md ← 铁律项目级
├── output/COMMUNICATION_CONTRACT.md ← 14 项偏好
├── output/PROJECT_GUIDE.md ← 11 章节总览
├── output/2024_QUEUE.md ← 进度
├── output/AUDIT_LOG.md ← 历史审核
└── output/HANDOFF.md ← 历史 bug 数据库

第 3 层 · Hook（自动反馈，不会忘）
├── PostToolUse:Agent → agent-audit.sh
│   每次我调 Agent，hook 注入"累计 N 次"提醒
└── PreToolUse:Edit|Write → suggest-compact.sh
    50 次后提醒考虑 /compact
```

**只要这三层都在，compact 后我必然能恢复完整工作状态**。

---

## 🆘 如果激活后我表现仍异常

可能原因（按概率排序）：

1. **rules 没生效**：检查 `~/.claude/rules/common/agents.md` 文件还在
   ```bash
   ls ~/.claude/rules/common/
   # 应该看到 agents.md / testing.md / 等 8 个文件
   ```

2. **hook 没生效**：可能需要 `/hooks` 重载或重启 Claude Code
   ```bash
   jq empty ~/.claude/settings.json   # 确认配置合法
   cat ~/.claude/agent_audit.jsonl    # 应该有日志
   ```

3. **项目文档没拉到位**：跨设备时需要 `git pull origin main`
   ```bash
   cd C:/Users/60507/physics_anim/output
   git pull origin main
   ```

4. **我自己漂移了**：发"🔴 排错型激活咒语"重置我

---

## 📝 你能想到的 3 个常见场景

### 场景 A：第二天接着做
```
继续 PhysicsPath Q13。先读完 Checklist 再动手。
```
→ 我会读完所有文档，汇报到 Q12 已完成，要做 Q13，等你确认。

### 场景 B：换设备
```
我换了台电脑。先 cd 到 PhysicsPath 项目目录跑 git pull，
然后按 CLAUDE.md Checklist 读全部文档，汇报状态。
```
→ 我先 pull 代码，再读文档，最后汇报。

### 场景 C：怀疑我状态不对
```
[🔴 排错型激活咒语全文复制]
```
→ 我重新加载所有规则，自查违反点，汇报。

---

**最后更新**：2026-04-29 — 创建（用户担心 /compact 丢失上下文）

**位置**：`C:/Users/60507/physics_anim/output/ACTIVATION.md`
