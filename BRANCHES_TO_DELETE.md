# 🗑️ Stale Branches to Delete

This document lists branches that should be deleted manually via GitHub UI or git commands.

## ⚠️ Instructions

**Do not delete these branches via automated scripts.** Delete them manually using one of these methods:

### Option 1: GitHub UI
1. Go to https://github.com/Bonzokoles/my-bonzo-ai-blog/branches
2. Find each branch in the list below
3. Click the trash icon next to the branch name

### Option 2: Git Commands
```bash
# Delete local branches
git branch -d <branch-name>

# Delete remote branches
git push origin --delete <branch-name>
```

---

## 📋 Branches to Delete (17 total)

### Backup Branches (3 branches)
These were created for backup purposes and are preserved in git history:

- `backup-2024-10-26`
- `backup-stable-version`
- `backup-v1.0.0`

**Rationale:** Backup branches are no longer needed as active branches. The code is preserved in git history.

---

### Merged Copilot PR Branches (11 branches)
These branches were created by GitHub Copilot and have been merged:

- `copilot/add-meble-pumo-api-configuration` - Merged in PR #10
- `copilot/check-actions-settings` - Merged in PR #5
- `copilot/fix-advanced-monitoring-failures` - Merged in PR #11
- `copilot/fix-post-deployment-health-check` - Merged in PR #1
- `copilot/merge-added-improvements` - Merged in PR #13
- `copilot/sub-pr-3` - Sub-PR branch (no longer needed)
- `copilot/sub-pr-3-again` - Sub-PR branch (no longer needed)
- `copilot/sub-pr-3-another-one` - Sub-PR branch (no longer needed)
- `copilot/sub-pr-3-yet-again` - Sub-PR branch (no longer needed)
- `copilot/sub-pr-4` - Sub-PR branch (no longer needed)
- `copilot/sub-pr-4-again` - Sub-PR branch (no longer needed)

**Rationale:** These branches have been successfully merged into `main`. The changes are preserved in the main branch history.

---

### Other Merged Branches (3 branches)

- `claude/analyze-function-control-011CUp65GfuUCnJQJC7ePo6t` - Merged in PR #2
- `feature/modernization-step-by-step` - Inactive feature branch
- `fix-remove-leaked-secrets` - Merged in PR #4 and PR #12

**Rationale:** These branches have been merged or are no longer actively developed.

---

## ✅ Branches to Keep

Only the following branch should remain active:

- `main` - Production branch

---

## 🔍 Verification

After deleting the branches, verify that only `main` remains:

```bash
# List all remote branches
git branch -r

# Expected output:
# origin/main
# origin/HEAD -> origin/main
```

---

## 📝 Notes

- All deleted branches remain in git history
- Merged code is preserved in the `main` branch
- This cleanup improves repository navigation and reduces clutter
- Branches can be restored from git history if needed

---

**Last Updated:** 2026-01-11  
**Issue:** Repository Cleanup & Organization
