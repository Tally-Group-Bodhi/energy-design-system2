# Upload energy-design-system to GitHub — Step by Step

## Step 1: Stage and commit your changes (done locally)

Your project already has git initialized. Stage all changes and create a commit:

```bash
git add .
git commit -m "Initial commit: Energy Design System with components and foundation"
```

---

## Step 2: Create a new repository on GitHub

1. Go to **[github.com/new](https://github.com/new)**
2. Set **Repository name**: `energy-design-system` (or any name you prefer)
3. Add a **Description** (optional), e.g. "Energy Design System – UI components and foundation"
4. Choose **Public** or **Private**
5. **Do not** check "Add a README" or "Add .gitignore" — you already have these locally
6. Click **Create repository**

---

## Step 3: Connect your local repo to GitHub

After creating the repo, GitHub shows you a URL. Use your GitHub username and repo name:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/energy-design-system.git
```

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/energy-design-system.git
```

---

## Step 4: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If GitHub asks you to log in, use a **Personal Access Token** (not your password) when using HTTPS, or ensure SSH keys are set up if using SSH.

---

## Quick reference

| Step | Action |
|------|--------|
| 1 | `git add .` then `git commit -m "Your message"` |
| 2 | Create new repo on github.com/new |
| 3 | `git remote add origin https://github.com/USERNAME/REPO.git` |
| 4 | `git push -u origin main` |

---

## Troubleshooting

- **"Permission denied" or "Authentication failed"**  
  Use a [Personal Access Token](https://github.com/settings/tokens) (HTTPS) or set up [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) (SSH).

- **"Repository not found"**  
  Check the remote URL and that the repo exists under your account:  
  `git remote -v`

- **"Updates were rejected"**  
  If the GitHub repo has commits you don’t have (e.g. README added on the site):  
  `git pull origin main --rebase` then `git push -u origin main`
