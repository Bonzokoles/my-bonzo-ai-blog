# 🗑️ Manual Branch Deletion Required

## ⚠️ Action Required

The following **14 stale branches** need to be deleted manually via GitHub UI. These branches have been merged or are no longer needed.

## 📋 Branches to Delete

### Backup Branches (3 branches)
```
backup-2024-10-26
backup-stable-version
backup-v1.0.0
```

### Merged Copilot PR Branches (8 branches)
```
copilot/add-meble-pumo-api-configuration
copilot/check-actions-settings
copilot/cleanup-repository-structure
copilot/fix-advanced-monitoring-failures
copilot/fix-post-deployment-health-check
copilot/merge-added-improvements
copilot/sub-pr-3-another-one
copilot/sub-pr-3-yet-again
```

### Sub-PR Branches (2 branches)
```
copilot/sub-pr-4
copilot/sub-pr-4-again
```

### Other Merged Branches (1 branch)
```
feature/modernization-step-by-step
```

## ✅ Branches to Keep

These branches should **NOT** be deleted:
- `main` - Production branch
- `claude/analyze-function-control-011CUp65GfuUCnJQJC7ePo6t` - PR #16 (active)
- `copilot/sub-pr-3-again` - PR #7 (active)
- `copilot/sub-pr-3` - PR #6 (active)
- `fix-remove-leaked-secrets` - PR #4 (active)
- `copilot/delete-stale-branches` - PR #17 (this PR)
- `copilot/cleanup-repository-docs` - (not in original list, keeping for safety)

## 🔧 How to Delete (Option 1: GitHub UI)

1. Go to https://github.com/Bonzokoles/my-bonzo-ai-blog/branches
2. Find each branch from the list above
3. Click the trash icon (🗑️) next to each branch name
4. Confirm the deletion

## 🔧 How to Delete (Option 2: Git Command)

If you have push access, you can delete all stale branches with:

```bash
# Delete backup branches
git push origin --delete backup-2024-10-26
git push origin --delete backup-stable-version
git push origin --delete backup-v1.0.0

# Delete merged copilot PR branches
git push origin --delete copilot/add-meble-pumo-api-configuration
git push origin --delete copilot/check-actions-settings
git push origin --delete copilot/cleanup-repository-structure
git push origin --delete copilot/fix-advanced-monitoring-failures
git push origin --delete copilot/fix-post-deployment-health-check
git push origin --delete copilot/merge-added-improvements
git push origin --delete copilot/sub-pr-3-another-one
git push origin --delete copilot/sub-pr-3-yet-again

# Delete sub-PR branches
git push origin --delete copilot/sub-pr-4
git push origin --delete copilot/sub-pr-4-again

# Delete other merged branches
git push origin --delete feature/modernization-step-by-step
```

Or delete all at once:

```bash
git push origin --delete \
  backup-2024-10-26 \
  backup-stable-version \
  backup-v1.0.0 \
  copilot/add-meble-pumo-api-configuration \
  copilot/check-actions-settings \
  copilot/cleanup-repository-structure \
  copilot/fix-advanced-monitoring-failures \
  copilot/fix-post-deployment-health-check \
  copilot/merge-added-improvements \
  copilot/sub-pr-3-another-one \
  copilot/sub-pr-3-yet-again \
  copilot/sub-pr-4 \
  copilot/sub-pr-4-again \
  feature/modernization-step-by-step
```

## 🔍 Verification

After deleting the branches, verify that only the active branches remain:

```bash
git ls-remote --heads origin
```

Expected remaining branches:
- `main`
- `claude/analyze-function-control-011CUp65GfuUCnJQJC7ePo6t`
- `copilot/sub-pr-3-again`
- `copilot/sub-pr-3`
- `copilot/delete-stale-branches`
- `copilot/cleanup-repository-docs`
- `fix-remove-leaked-secrets`

## 📝 Notes

- All deleted branches remain in git history
- Merged code is preserved in the `main` branch
- Branches can be restored from git history if needed
- This cleanup improves repository navigation and reduces clutter

---

**Status:** Awaiting manual deletion  
**Created:** 2026-01-11  
**PR:** #17 - Repository Cleanup
