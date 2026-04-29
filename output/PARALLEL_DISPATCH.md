# PhysicsPath · 多对话框并行任务分配

> 用户决定开 **6 个对话框** 并行做 2017-2023 全国卷系列。
> 每个对话框的提示词在下面，**直接复制粘贴**到对应对话框。
> 当前 commit 起点：`cef4315`（2026-04-29）

---

## 卷子分配总览

| 对话框 | 分配 3 卷 | 起步 paperDir |
|---|---|---|
| **#1** | 2023 新课标剩余（Q6-Q16）+ 2022 全国甲 + 2022 全国乙 | `2023_新课标卷` `2022_全国甲卷` `2022_全国乙卷` |
| **#2** | 2021 全国甲 + 2021 全国乙 + 2020 新课标 I | `2021_全国甲卷` `2021_全国乙卷` `2020_新课标I` |
| **#3** | 2020 新课标 II + 2020 新课标 III + 2019 新课标 I | `2020_新课标II` `2020_新课标III` `2019_新课标I` |
| **#4** | 2019 新课标 II + 2019 新课标 III + 2018 新课标 I | `2019_新课标II` `2019_新课标III` `2018_新课标I` |
| **#5** | 2018 新课标 II + 2018 新课标 III + 2017 新课标 I | `2018_新课标II` `2018_新课标III` `2017_新课标I` |
| **#6** | 2017 新课标 II + 2017 新课标 III（2 卷量）| `2017_新课标II` `2017_新课标III` |

---

## paper id 映射（exams.jsx 用）

- 全国甲卷 → `gk1`
- 全国乙卷 → `gk2`
- 新课标 I 卷（2017-2020）→ **新加 `xkbI`**（PAPERS 数组需扩展）
- 新课标 II 卷（2017-2020）→ **新加 `xkbII`**
- 新课标 III 卷（2017-2020）→ **新加 `xkbIII`**
- 新课标卷（2023）→ `xgk1`（沿用）

**对话框 #1 启动时**先扩 PAPERS 加 xkbI/xkbII/xkbIII（其他对话框依赖此）。

---

## ⚠️ DOCX 格式注意

| 年份 | 格式 |
|---|---|
| 2017-2021 | **.doc**（Word 97-2003 旧格式，python-docx 不支持）|
| 2022-2023 | .docx（python-docx 支持）|

**.doc → .docx 转换方法**：
```bash
# 用 LibreOffice 或 Word 命令行转换
soffice --headless --convert-to docx "*.doc"
# 或在 Windows 上手动用 Word 打开另存为 .docx
```

每对话框接手时如发现是 .doc，**先用 Bash + soffice 转成 .docx** 再用现有 extract.py 抽取。

---

## 🚨 共享文件冲突处理（关键）

### 共享文件（每对话框都要改 → 真冲突）
- `output/exams.jsx`（REAL_PROBLEMS 数组 + PROBLEM_META 字典）
- `output/AUDIT_LOG.md`（追加新卷 section）

### 独占文件（不冲突）
- `output/[年份]_[卷名]/`（自己卷的目录）

### 防冲突原则
1. **append-only**：只在数组/对象/section **末尾追加** entry，不修改现有内容
2. **paper id 不重复**：用 `{year}-{paper}-q{NN}` 格式，year 区分（2022-gk1-q01 vs 2023-gk1-q01）
3. **commit 频率高**：每 2-4 题就 push（缩短冲突窗口）
4. **commit 前必须 pull --rebase**

### 标准 push 工作流
```bash
git add output/exams.jsx output/AUDIT_LOG.md output/[自己卷子目录]
git commit -m "feat([卷标识]): ..."
git pull --rebase     # ← 关键：拉别人的更新
# 如有冲突 → 手动解决（保留双方 entry，不互相覆盖）
git rebase --continue
git push
```

### 冲突解决示例
```jsx
// exams.jsx REAL_PROBLEMS 数组冲突
<<<<<<< HEAD
  { id:'2022-gk1-q01', ... },     // 我（对话框 A）的
=======
  { id:'2021-gk2-q01', ... },     // 别人（对话框 B）的
>>>>>>> origin/main
];
```
**解决**：保留双方两行（双 +）：
```jsx
  { id:'2022-gk1-q01', ... },
  { id:'2021-gk2-q01', ... },
];
```

AUDIT_LOG.md 同样：每个对话框的卷 section 是独立的，**不会**真正冲突（除非两个对话框碰巧编辑同一行）。

---

## 通用提示词模板（每对话框开头粘贴这一段）

```
PhysicsPath 项目继续。本对话框分配的任务见下方【任务】段落。

═══════════════════════════════════════════════════
【接手第一件事必读 — 按顺序读完才动手】
═══════════════════════════════════════════════════

1. C:\Users\60507\physics_anim\CLAUDE.md
   重点：
   - 铁律 1（5 关 = 5 个独立 sub-agent A/B/C1/C2/D，绝不合并 prompt 省 token）
   - 铁律 2（测试套件完整跑）
   - 实时进度报告纪律

2. output/COMMUNICATION_CONTRACT.md
   重点：
   - §1.1 表格汇报 5 关
   - §1.2 hook 审计强制行（每次汇报末尾必须加 `Hook 审计：本题 N 次 / 累计 M 次`）
   - §2.1 完成一题立即进下一题不需指令

3. output/PROJECT_GUIDE.md（项目总览）

4. output/2024_QUEUE.md 顶部状态

5. output/AUDIT_LOG.md 末尾 100 行
   ⚠️ 重点读"铁律补救"段（合并 agent 是大错；发现合并必须立即回头重做不能只警告）

6. output/PARALLEL_DISPATCH.md（本文件 — 卷子分配 + 冲突处理）

7. git log --oneline -15

8. 看 todo 列表

读完后向用户汇报：
- 最近 commit hash（应是 cef4315 或之后）
- 我负责的 3 卷
- 5 关 agent 分工
- 上次会话铁律教训
- 是否需要确认才开始

═══════════════════════════════════════════════════
【铁律纪律 — 违反 = 作假】
═══════════════════════════════════════════════════

✅ 5 关必须 5 个独立 Agent 调用（绝不合并 prompt 省 token）
✅ 发现合并必须立即回头重做（仅警告 = 知错不改）
✅ 每完成一原子动作立即同步 AUDIT_LOG（不能累积）
✅ commit 前实测：cd output && python -m http.server 8765
✅ 每次汇报加 hook 审计行

═══════════════════════════════════════════════════
【共享文件冲突处理】
═══════════════════════════════════════════════════

共享文件：output/exams.jsx + output/AUDIT_LOG.md
独占目录：output/[年份]_[卷名]/

每次 push 前必须：
  git add ...
  git commit -m "..."
  git pull --rebase     ← 关键
  # 解冲突保留双方 entry
  git rebase --continue
  git push

详细见 output/PARALLEL_DISPATCH.md

═══════════════════════════════════════════════════
【DOCX → raw_text 抽取】
═══════════════════════════════════════════════════

2017-2021 是 .doc（旧格式），先转 .docx：
  soffice --headless --convert-to docx "源文件.doc"

然后参考 2023 全国乙卷 source/extract.py 改路径运行。

═══════════════════════════════════════════════════
【服务器命令】
═══════════════════════════════════════════════════

cd output && python -m http.server 8765
浏览器：http://localhost:8765/index.html
```

---

## 各对话框具体任务段落

### 对话框 #1
```
【任务】
负责 3 卷（按顺序做完）：
  卷 1：2023 新课标卷剩余 Q6-Q16（已做 Q5）
        DOCX：C:\Users\60507\Desktop\17-24物理\2023·高考物理真题\2023年高考物理试卷（新课标）（解析卷）.docx
        paperDir：output/2023_新课标卷（已存在，已抽 raw_text）
        paper id：xgk1
        起点：从 Q6 开始（Q1-Q4 已跳过见 AUDIT_LOG）

  卷 2：2022 全国甲卷
        DOCX：C:\Users\60507\Desktop\17-24物理\2022·高考物理真题\2022年高考物理试卷（全国甲卷）（解析卷）.docx
        paperDir：output/2022_全国甲卷（待新建）
        paper id：gk1（year=2022 区分）

  卷 3：2022 全国乙卷
        DOCX：C:\Users\60507\Desktop\17-24物理\2022·高考物理真题\2022年高考物理试卷（全国乙卷）（解析卷）.docx
        paperDir：output/2022_全国乙卷（待新建）
        paper id：gk2

每卷完成后 commit + push，然后下一卷。
```

### 对话框 #2
```
【任务】
负责 3 卷：
  卷 1：2021 全国甲卷
        DOCX：C:\Users\60507\Desktop\17-24物理\2021·高考物理真题\2021年高考物理试卷（全国甲卷）（解析卷）.doc ⚠️ .doc 需转
        paperDir：output/2021_全国甲卷
        paper id：gk1

  卷 2：2021 全国乙卷
        DOCX：C:\Users\60507\Desktop\17-24物理\2021·高考物理真题\2021年高考物理试卷（全国乙卷）（解析卷）.doc ⚠️ .doc 需转
        paperDir：output/2021_全国乙卷
        paper id：gk2

  卷 3：2020 新课标 I 卷
        DOCX：C:\Users\60507\Desktop\17-24物理\2020·高考物理真题\2020年高考物理试卷（新课标Ⅰ）（解析卷）.doc ⚠️ .doc 需转
        paperDir：output/2020_新课标I
        paper id：xkbI（PAPERS 数组若无则需先扩展）

⚠️ 启动时若 PAPERS 已被对话框 #1 扩展加好 xkbI/II/III 则直接用；若还没则你需要扩 + push（再开协调）。
```

### 对话框 #3
```
【任务】
负责 3 卷：
  卷 1：2020 新课标 II 卷
        DOCX：...2020·高考物理真题\...新课标Ⅱ...doc ⚠️ .doc 需转
        paperDir：output/2020_新课标II
        paper id：xkbII

  卷 2：2020 新课标 III 卷
        paperDir：output/2020_新课标III
        paper id：xkbIII

  卷 3：2019 新课标 I 卷
        DOCX：...2019·高考物理真题\...新课标Ⅰ...doc
        paperDir：output/2019_新课标I
        paper id：xkbI（year=2019 区分）
```

### 对话框 #4
```
【任务】
负责 3 卷：
  卷 1：2019 新课标 II 卷（paper id xkbII，year=2019）
  卷 2：2019 新课标 III 卷（paper id xkbIII，year=2019）
  卷 3：2018 新课标 I 卷（paper id xkbI，year=2018）

DOCX 路径：C:\Users\60507\Desktop\17-24物理\[2018|2019]·高考物理真题\... .doc（需转 .docx）
paperDir：output/[2018|2019]_新课标[I|II|III]
```

### 对话框 #5
```
【任务】
负责 3 卷：
  卷 1：2018 新课标 II 卷（year=2018, xkbII）
  卷 2：2018 新课标 III 卷（year=2018, xkbIII）
  卷 3：2017 新课标 I 卷（year=2017, xkbI）

DOCX 路径同上模式。
```

### 对话框 #6
```
【任务】
负责 2 卷（少一卷因为总数 17 卷）：
  卷 1：2017 新课标 II 卷（year=2017, xkbII）
  卷 2：2017 新课标 III 卷（year=2017, xkbIII）

DOCX 路径：C:\Users\60507\Desktop\17-24物理\2017·高考物理真题\... .doc
```

---

## 进度跟踪表（每对话框完成一卷在这里勾上）

| 卷子 | 对话框 | 状态 |
|---|---|---|
| 2023 新课标剩余 | #1 | ⬜ |
| 2022 全国甲 | #1 | ⬜ |
| 2022 全国乙 | #1 | ⬜ |
| 2021 全国甲 | #2 | ⬜ |
| 2021 全国乙 | #2 | ⬜ |
| 2020 新课标 I | #2 | ⬜ |
| 2020 新课标 II | #3 | ⬜ |
| 2020 新课标 III | #3 | ⬜ |
| 2019 新课标 I | #3 | ⬜ |
| 2019 新课标 II | #4 | ⬜ |
| 2019 新课标 III | #4 | ⬜ |
| 2018 新课标 I | #4 | ⬜ |
| 2018 新课标 II | #5 | ⬜ |
| 2018 新课标 III | #5 | ⬜ |
| 2017 新课标 I | #5 | ⬜ |
| 2017 新课标 II | #6 | ⬜ |
| 2017 新课标 III | #6 | ⬜ |

---

**最后更新**：2026-04-29 由 cef4315 后会话生成
