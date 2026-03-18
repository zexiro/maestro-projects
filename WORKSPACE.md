# Agent Workspace

This is your working directory. All file operations default to here.

## Directory Layout

- **projects/** — All projects live in a single monorepo: `maestro-projects`. Clone it from GitHub if not already present. Create a subdirectory per project inside it.
- **scratch/** — Temporary work area for experiments, drafts, throwaway code.
- **outputs/** — Files you generate that should be shared back (reports, exports, etc).
- **outputs/tweet-drafts/** — Draft tweets for founder review before posting.
- **uploads/** — Files uploaded by users via Slack. Read-only, don't modify these.

## Rules

1. All projects go in `projects/maestro-projects/<project-name>/`.
2. Clone the monorepo on first use if it exists on GitHub.
3. Commit and push changes within the monorepo to share work.
4. Use scratch/ for anything temporary. It may be cleaned periodically.
5. Put shareable output in outputs/ so it can be uploaded back to Slack.
6. Don't store secrets or credentials anywhere in the workspace.

## Memory

Your memory lives at /data/memory/ (separate from workspace):
- /data/memory/MEMORY.md — long-term curated facts
- /data/memory/log/YYYY-MM-DD.md — daily activity log
