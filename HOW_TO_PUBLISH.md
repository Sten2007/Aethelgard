# 🚀 How to Publish Aethelgard on GitHub Pages

Your game link will be: **https://Sten2007.github.io/Aethelgard/**

---

## Step 1 — Create the GitHub Repository

1. Go to: https://github.com/new
2. Set **Repository name** to: `Aethelgard`
3. Set it to **Public**
4. ⚠️ Do NOT tick "Add a README file" (we already have one)
5. Click **Create repository**

---

## Step 2 — Push Your Code

Open a terminal in your project folder (`C:\Own-Project`) and run:

```
git branch -M main
git remote add origin https://github.com/Sten2007/Aethelgard.git
git push -u origin main
```

It will ask for your GitHub **username** and **password**.
> ⚠️ For the password, use a **Personal Access Token** (not your real password).
> Create one here: https://github.com/settings/tokens/new
> → Tick **repo** scope → Generate → Copy the token → Paste it as your password

---

## Step 3 — Enable GitHub Pages

1. Go to your repo: https://github.com/Sten2007/Aethelgard
2. Click **Settings** (top tab)
3. Click **Pages** (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

---

## Step 4 — Wait for Deployment

- Go to the **Actions** tab in your repo
- You should see a workflow called "Deploy to GitHub Pages" running
- Wait ~2 minutes for it to finish (green checkmark ✅)

---

## ✅ Done! Your game is live at:

**https://Sten2007.github.io/Aethelgard/**

---

## 🔄 How to Update the Game in the Future

Every time you make changes and want to push them online, just run:

```
git add .
git commit -m "describe what you changed"
git push
```

The game will automatically redeploy within ~2 minutes!

---

## ❓ Troubleshooting

- **"Repository not found"** → Make sure you created the repo on GitHub first (Step 1)
- **"Authentication failed"** → Use a Personal Access Token instead of your password
- **Game shows 404** → Check that GitHub Pages source is set to "GitHub Actions" in Settings
- **Game assets not loading** → Make sure `vite.config.js` has `base: '/Aethelgard/'` (already done!)
