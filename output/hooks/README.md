# PhysicsPath Hooks · 反作假 / 反幻觉

> 项目级 hook 配置文档。Hook 安装在用户级 `~/.claude/` 下，但配置脚本副本和说明保留在项目仓库供复现。

---

## 已配置的 Hook

### `agent-audit` · PostToolUse:Agent

**目的**：自动记录每次 sub-agent 调用 → 反馈累计次数给 Claude → 检测违反 [铁律 1（禁合并 agent）](../CLAUDE.md)

**机制**：
```
Claude 调 Agent tool
    ↓
Claude Code 执行 sub-agent
    ↓
PostToolUse hook 自动触发 → bash ~/.claude/agent-audit.sh
    ↓
脚本: ① 追加日志到 ~/.claude/agent_audit.jsonl
       ② 计算本会话累计 Agent 调用次数
       ③ 列出最近 5 分钟所有调用
    ↓
通过 hookSpecificOutput.additionalContext 注入到 Claude 下一轮上下文
    ↓
Claude 看到 "本会话累计 N 次 + 列表" → 自我约束
    ↓
若用户要求 4 关审核但 Claude 只调了 1-2 次 → Claude 立刻发现违反铁律 1
```

**特性**：
- ✅ 完全被动 — UI 不打扰用户，只反馈给 Claude
- ✅ 跨会话审计 — 日志永久保留在 `~/.claude/agent_audit.jsonl`
- ✅ 用户可手动审计 — `cat ~/.claude/agent_audit.jsonl` 看历史

---

## 安装步骤（跨设备复现）

### 1. 拷贝脚本到用户级 .claude

```bash
cp output/hooks/agent-audit.sh ~/.claude/agent-audit.sh
chmod +x ~/.claude/agent-audit.sh
```

### 2. 在 `~/.claude/settings.json` 加 hook 配置

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Agent|Task",
        "hooks": [
          {
            "type": "command",
            "command": "bash $HOME/.claude/agent-audit.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

注意：matcher 用 `Agent|Task` 双重匹配，覆盖 Claude Code 不同版本对 sub-agent 工具的命名差异。

### 3. 验证 schema

```bash
jq -e '.hooks.PostToolUse[] | select(.matcher == "Agent|Task") | .hooks[] | select(.type == "command") | .command' ~/.claude/settings.json
```

应输出 `"bash $HOME/.claude/agent-audit.sh"`。

### 4. 重启 Claude Code 或运行 `/hooks` 重载配置

settings 监听器只扫描 session 启动时已存在的 settings 文件，新加的 hook 需要重启或打开 `/hooks` UI 才生效。

### 5. 触发测试

跑一个最小的 Agent 调用：
```
"做一个最小测试: 1+1=?"
```

应在 transcript 里看到 `<system-reminder>PostToolUse:Agent hook additional context: ...</system-reminder>`，并且 `~/.claude/agent_audit.jsonl` 有新记录。

---

## 实战场景示例

### 场景 1 · Q15 4 关审核

| Claude 实际行为 | Hook 反馈 | 后果 |
|----------------|----------|------|
| 调 4 个独立 agent（A/B/C/D 各一） | "累计 4 次。最近: A关、B关、C关、D关" | ✅ 符合铁律 1，正常汇报 |
| 合并到 1 个 agent 偷懒 | "累计 1 次" | ⚠️ Claude 立刻知道违反铁律 1，自动启动复审 |

### 场景 2 · 手动审计

```bash
# 看本机所有 Agent 调用历史
cat ~/.claude/agent_audit.jsonl | jq -c

# 看今天的
grep "$(date -u +%Y-%m-%d)" ~/.claude/agent_audit.jsonl

# 统计 4 关分布（必须每关至少 N 次）
cat ~/.claude/agent_audit.jsonl | jq -r '.description' | grep -oE 'A关|B关|C关|D关' | sort | uniq -c

# 检查某次会话总调用数
cat ~/.claude/agent_audit.jsonl | jq -r 'select(.session == "<SESSION_ID>") | .description' | wc -l
```

---

## 输出示例

Hook 注入到 Claude 上下文的格式：

```
[Agent Audit] 本会话累计 Agent 调用: 4 次。最近 5 分钟:
  - 02:15:30  Q15 A 关 题目识别
  - 02:15:31  Q15 B 关 物理推导
  - 02:15:31  Q15 C 关 视觉直觉
  - 02:15:32  Q15 D 关 代码审
[铁律 1 提醒] 多关审核必须用独立 Agent 调用，绝不合并 prompt 省 token。
```

---

## 设计选择

### 为什么是"被动反馈型"而不是"硬阻塞型"？

| 方案 | 优势 | 劣势 |
|------|------|------|
| **当前（PostToolUse 反馈）** | 不打扰、可观测、跨会话审计 | 仅约束诚实模型，恶意模型可绕过 |
| 硬阻塞（PreToolUse + 复杂判定） | 强制执行 | 难以判定"什么算 4 关"，误伤大量正常调用 |

PhysicsPath 当前需求是**让我自我约束**（已经有铁律 1 写在 rules 里），所以反馈型够用。如果未来发现仍有偷懒，可升级为带 Stop hook 校验"会话末总数 ≥ 任务量×4"。

### 为什么 5 分钟窗口？

- 4 关审核典型耗时 1-3 分钟（agent 并行启动）
- 5 分钟覆盖一道题完整周期 + 修复轮次
- 太短（如 1 分钟）会漏掉真合规的并行调用
- 太长（如 30 分钟）会污染跨题目的统计

---

## 故障排查

### Hook 不触发？

1. 检查 settings.json 语法：`jq empty ~/.claude/settings.json`
2. 检查脚本权限：`ls -la ~/.claude/agent-audit.sh` 应有执行位
3. 检查 jq 是否可用：`which jq`（脚本依赖 jq）
4. 重启 Claude Code 或开 `/hooks` 重载

### 日志没在写？

```bash
# 手动跑脚本看错误
echo '{"session_id":"test","tool_name":"Agent","tool_input":{"description":"test"}}' | bash ~/.claude/agent-audit.sh
```

### additionalContext 没注入？

最后一行必须是合法 JSON `{"hookSpecificOutput": {...}}`。用 `jq empty` 验证脚本最后输出。

---

## 配套规则（一起读）

- [`CLAUDE.md`](../../CLAUDE.md) — 铁律 1（禁合并 agent）+ 铁律 2（跑完整测试）
- [`~/.claude/rules/common/agents.md`](https://) — 全局规则
- [`PROJECT_GUIDE.md`](../PROJECT_GUIDE.md) — 项目总览（接手必读）

---

**最后更新**：2026-04-29 — 配置 PostToolUse:Agent hook 闭环验证通过
