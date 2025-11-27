# GitHub Actions Setup Guide

## 🎯 Overview

GitHub Actions workflow untuk otomatis push/sync code ke repository target: `https://github.com/rochiyat-tech/image-optimizer.git`

## 📋 Prerequisites

1. ✅ User `rochiyat` sudah menjadi contributor di target repository
2. ✅ Personal Access Token (PAT) dengan write access
3. ✅ Repository secrets configured

## 🔧 Setup Instructions

### Step 1: Create Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Set token name: `image-optimizer-sync`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Step 2: Add Secret to Source Repository

1. Go to your source repository settings
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click "New repository secret"
4. Add secret:
   - **Name**: `TARGET_REPO_TOKEN`
   - **Value**: [Paste your PAT from Step 1]
5. Click "Add secret"

### Step 3: Verify Workflow Files

Ensure these files exist in `.github/workflows/`:

```
.github/
└── workflows/
    ├── push-to-target.yml        (Recommended - Simple & Reliable)
    ├── sync-to-main-repo.yml     (Alternative - More features)
    └── mirror-repository.yml     (Alternative - Full mirror)
```

### Step 4: Test the Workflow

#### Option A: Automatic Trigger (Push)
```bash
# Make a commit and push
git add .
git commit -m "Test GitHub Actions sync"
git push origin main
```

#### Option B: Manual Trigger
1. Go to repository → Actions tab
2. Select "Push to Target Repository" workflow
3. Click "Run workflow"
4. Select branch (default: main)
5. Click "Run workflow" button

## 📁 Workflow Files

### 1. push-to-target.yml (Recommended)

**Features:**
- ✅ Simple and reliable
- ✅ Pushes on every commit to main/master
- ✅ Manual trigger available
- ✅ Includes tags sync
- ✅ Detailed summary

**Triggers:**
- Push to `main` or `master` branch
- Manual dispatch via Actions tab

**What it does:**
1. Checkout source code
2. Configure Git with rochiyat credentials
3. Push to target repository
4. Sync tags (if any)
5. Show summary

### 2. sync-to-main-repo.yml (Alternative)

**Features:**
- ✅ Syncs multiple branches
- ✅ Fetches target repo first
- ✅ More detailed logging
- ✅ Error notifications

**Triggers:**
- Push to `main`, `master`, or `develop`
- Manual dispatch

### 3. mirror-repository.yml (Alternative)

**Features:**
- ✅ Full repository mirror
- ✅ Mirrors all branches
- ✅ Mirrors branch deletions
- ✅ Uses SSH (requires SSH key setup)

**Note:** Requires `TARGET_REPO_SSH_KEY` secret instead of token.

## 🔐 Security Best Practices

### Token Permissions
- ✅ Use fine-grained tokens when possible
- ✅ Limit scope to specific repositories
- ✅ Set expiration date (e.g., 90 days)
- ✅ Rotate tokens regularly

### Secret Management
- ✅ Never commit tokens to repository
- ✅ Use GitHub Secrets for sensitive data
- ✅ Limit secret access to necessary workflows
- ✅ Audit secret usage regularly

## 🎯 Workflow Behavior

### On Push to Main
```
Developer commits → Push to source repo
    ↓
GitHub Actions triggered
    ↓
Checkout code
    ↓
Configure Git (user: rochiyat)
    ↓
Push to target repo (rochiyat-tech/image-optimizer)
    ↓
Success notification
```

### Manual Trigger
```
Developer → Actions tab → Run workflow
    ↓
Select branch
    ↓
Click "Run workflow"
    ↓
Same process as automatic trigger
```

## 📊 Monitoring

### View Workflow Runs
1. Go to repository → Actions tab
2. See all workflow runs
3. Click on a run to see details
4. Check logs for each step

### Success Indicators
- ✅ Green checkmark on workflow run
- ✅ Summary shows sync details
- ✅ Target repository updated

### Failure Indicators
- ❌ Red X on workflow run
- ❌ Check logs for error details
- ❌ Common issues:
  - Invalid token
  - Insufficient permissions
  - Network issues

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Cause:** Invalid or expired token  
**Solution:** 
1. Generate new PAT
2. Update `TARGET_REPO_TOKEN` secret
3. Re-run workflow

### Error: "Permission denied"
**Cause:** Token lacks required permissions  
**Solution:**
1. Check token has `repo` scope
2. Verify rochiyat is contributor on target repo
3. Regenerate token with correct scopes

### Error: "Remote repository not found"
**Cause:** Incorrect repository URL  
**Solution:**
1. Verify URL: `https://github.com/rochiyat-tech/image-optimizer.git`
2. Check repository exists and is accessible
3. Verify spelling and organization name

### Error: "Workflow not triggering"
**Cause:** Workflow file syntax error or wrong branch  
**Solution:**
1. Check YAML syntax
2. Verify trigger branches match your branch name
3. Check Actions tab is enabled in repository settings

## 🔄 Workflow Customization

### Change Target Branch
Edit workflow file:
```yaml
run: |
  git push "${TARGET_REPO}" HEAD:develop --force
  # Change 'develop' to your target branch
```

### Add More Branches
Edit trigger section:
```yaml
on:
  push:
    branches:
      - main
      - master
      - develop
      - feature/*  # Add pattern for feature branches
```

### Change Commit Author
Edit Git configuration:
```yaml
run: |
  git config user.name "Your Name"
  git config user.email "your.email@example.com"
```

### Add Slack Notification
Add step at the end:
```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Code synced to target repository"
      }
```

## 📝 Example Workflow Run

### Successful Run Output
```
✅ Checkout source repository
✅ Setup Git configuration
✅ Push to target repository
   Pushing branch main to target repository...
   ✅ Successfully pushed to rochiyat-tech/image-optimizer
✅ Push tags (if any)
   No tags to push
✅ Summary
   🚀 Sync Summary
   ✅ Successfully synced to rochiyat-tech/image-optimizer
   - Branch: main
   - Commit: abc123def456
   - Author: rochiyat
   - Message: Add new feature
```

## 🎯 Best Practices

### Commit Messages
Use clear, descriptive commit messages:
```bash
✅ "Add ZIP download feature"
✅ "Fix Vercel deployment issue"
❌ "Update"
❌ "Fix bug"
```

### Branch Strategy
- `main` → Production-ready code
- `develop` → Development code
- `feature/*` → Feature branches

### Testing
1. Test locally first
2. Push to feature branch
3. Verify sync works
4. Merge to main

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Using Secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

## 🎉 Quick Start Checklist

- [ ] Create Personal Access Token (PAT)
- [ ] Add `TARGET_REPO_TOKEN` secret to source repository
- [ ] Verify workflow files exist in `.github/workflows/`
- [ ] Commit and push to trigger workflow
- [ ] Check Actions tab for workflow run
- [ ] Verify code appears in target repository
- [ ] Test manual trigger (optional)
- [ ] Set up notifications (optional)

## 📞 Support

If you encounter issues:
1. Check workflow logs in Actions tab
2. Verify token permissions
3. Review this documentation
4. Check GitHub Actions status page

---

**Status**: ✅ Ready to use  
**Recommended Workflow**: `push-to-target.yml`  
**Target Repository**: https://github.com/rochiyat-tech/image-optimizer.git
