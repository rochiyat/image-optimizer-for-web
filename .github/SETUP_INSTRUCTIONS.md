# Quick Setup Instructions

## 🚀 Setup GitHub Actions Sync

### 1️⃣ Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `image-optimizer-sync`
4. Select scopes:
   - ✅ `repo`
   - ✅ `workflow`
5. Generate and **copy the token**

### 2️⃣ Add Secret to Repository

1. Go to repository **Settings**
2. **Secrets and variables** → **Actions**
3. Click "**New repository secret**"
4. Name: `TARGET_REPO_TOKEN`
5. Value: [Paste your token]
6. Click "**Add secret**"

### 3️⃣ Test the Workflow

**Option A - Automatic:**
```bash
git add .
git commit -m "Test sync"
git push origin main
```

**Option B - Manual:**
1. Go to **Actions** tab
2. Select "**Push to Target Repository**"
3. Click "**Run workflow**"
4. Click "**Run workflow**" button

### 4️⃣ Verify

1. Check **Actions** tab for green checkmark ✅
2. Visit: https://github.com/rochiyat-tech/image-optimizer
3. Verify your code is there!

---

## 🎯 What Happens

```
Your Commit → GitHub Actions → Auto Push to Target Repo
```

Every push to `main` or `master` branch automatically syncs to:
**https://github.com/rochiyat-tech/image-optimizer.git**

---

## 🐛 Troubleshooting

### ❌ Authentication failed
→ Regenerate token and update secret

### ❌ Permission denied
→ Verify rochiyat is contributor on target repo

### ❌ Workflow not running
→ Check Actions tab is enabled in settings

---

## 📚 Full Documentation

See: `GITHUB_ACTIONS_SETUP.md` for complete guide

---

**Target Repository**: https://github.com/rochiyat-tech/image-optimizer.git  
**Workflow File**: `.github/workflows/push-to-target.yml`
