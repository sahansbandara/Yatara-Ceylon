# Agent Rules — Auto-loaded on Every Session

> **This file is loaded automatically. You MUST follow every instruction below.**

## RULE 1: Boot Sequence (Before ANY Code)
Before writing, editing, or deleting any code file, read these files in order:
1. `.agent/CLAUDE.md` — tech stack and project config
2. `.agent/TODO.md` — read **Last Session** first, then tasks
3. `.agent/MEMORY.md` — mistakes to avoid, patterns that work
4. `.agent/BRIEF.md` — requirements and acceptance criteria

After reading, state: what was last done, what's next, any relevant past mistakes.

## RULE 2: Live File Updates (Non-Negotiable)
You update `.agent/` files IN REAL-TIME as you work. Not at the end. Not when asked. Immediately.

**When you START a task** → edit `.agent/TODO.md`: move the task to "In Progress"
**When you COMPLETE a task** → edit `.agent/TODO.md`: move to "Done" with today's date
**When you find or fix a bug** → edit `.agent/MEMORY.md` → Mistakes: what broke, why, fix
**When a workaround or pattern works well** → edit `.agent/MEMORY.md` → Patterns That Work
**When you add a dependency** → edit `.agent/MEMORY.md` → Dependencies & Versions
**When you make an architecture decision** → edit `.agent/MEMORY.md` → Architecture Decisions
**When you change config or env** → edit `.agent/MEMORY.md` → Project Knowledge
**When you stop or the session ends** → edit `.agent/TODO.md` → Last Session with full handoff

## RULE 3: Last Session Handoff (Every Time You Stop)
Before ending any session, update `.agent/TODO.md` → Last Session:
```
**Date**: YYYY-MM-DD
**What was done**: [list completed items]
**What to do next**: [specific next step]
**Current state**: branch, dev server status, last file, errors
**Files changed**: [list]
```

## RULE 4: Never Repeat Mistakes
Before implementing anything, check `.agent/MEMORY.md` → Mistakes section.
If your current approach matches a past mistake, use the documented fix instead.

## RULE 5: No Scope Creep
Only build what `.agent/BRIEF.md` specifies. Do not add features, pages, or functionality that aren't in the requirements. If you think something is missing, ask — don't invent.

These rules apply to EVERY session, EVERY chat, EVERY task. No exceptions.
