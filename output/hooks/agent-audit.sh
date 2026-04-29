#!/usr/bin/env bash
# Agent Audit Hook - PostToolUse 触发，每次 Agent 调用后跑
# 作用: 1) 追加日志到 ~/.claude/agent_audit.jsonl
#       2) 通过 hookSpecificOutput.additionalContext 反馈给 Claude
#       3) 帮助检测违反铁律 1（4 关审核必须 4 个独立 agent）

LOG="$HOME/.claude/agent_audit.jsonl"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
NOW_EPOCH=$(date +%s)
CUTOFF=$((NOW_EPOCH - 300))   # 最近 5 分钟

# 读 stdin（hook 输入 JSON）
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
DESCRIPTION=$(echo "$INPUT" | jq -r '.tool_input.description // "no-desc"')
SUBAGENT=$(echo "$INPUT" | jq -r '.tool_input.subagent_type // "general-purpose"')

# 1) 追加日志（每行一个 JSON）
jq -nc \
  --arg t "$NOW" \
  --argjson e "$NOW_EPOCH" \
  --arg s "$SESSION_ID" \
  --arg d "$DESCRIPTION" \
  --arg a "$SUBAGENT" \
  '{ts:$t, epoch:$e, session:$s, description:$d, subagent:$a}' \
  >> "$LOG"

# 2) 统计本会话累计次数
SESSION_COUNT=$(grep -c "\"session\":\"$SESSION_ID\"" "$LOG" 2>/dev/null || echo 0)

# 3) 最近 5 分钟内本会话的所有调用
RECENT=$(jq -s \
  --arg sid "$SESSION_ID" \
  --argjson cut "$CUTOFF" \
  '[.[] | select(.session == $sid and .epoch >= $cut) | "  - \(.ts | split("T")[1] | rtrimstr("Z"))  \(.description)"] | join("\n")' \
  "$LOG" 2>/dev/null || echo "\"(无)\"")

# 4) 输出 hookSpecificOutput
jq -n \
  --argjson cnt "$SESSION_COUNT" \
  --arg recent "$RECENT" \
  '{
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: ("[Agent Audit] 本会话累计 Agent 调用: \($cnt) 次。最近 5 分钟:\n" + ($recent | fromjson? // $recent) + "\n[铁律 1 提醒] 多关审核必须用独立 Agent 调用，绝不合并 prompt 省 token。")
    }
  }'
